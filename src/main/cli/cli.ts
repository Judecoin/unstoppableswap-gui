import {
  ChildProcessWithoutNullStreams,
  spawn as spawnProc,
} from 'child_process';
import PQueue from 'p-queue';
import psList from 'ps-list';
import downloadSwapBinary from './downloader';
import { isTestnet } from '../../store/config';
import { isCliLog, CliLog } from '../../models/cliModel';
import { getAppDataDir, getCliDataBaseDir } from './dirs';
import { readFromDatabaseAndUpdateState } from './database';

const queue = new PQueue({ concurrency: 1 });
let cli: ChildProcessWithoutNullStreams | null = null;

async function getSpawnArgs(
  subCommand: string,
  options: { [option: string]: string }
): Promise<string[]> {
  const cliAppDataDir = await getCliDataBaseDir();

  const flagsArray = isTestnet()
    ? ['--json', '--debug', '--testnet', '--data-base-dir', cliAppDataDir]
    : ['--json', '--debug', '--data-base-dir', cliAppDataDir];

  const optionsArray: Array<string> = [];
  Object.entries(options).forEach(([key, value]) => {
    optionsArray.push(`--${key}`);
    optionsArray.push(value);
  });

  return [...flagsArray, subCommand, ...optionsArray];
}

async function killjudeWalletRpc() {
  const list = await psList();
  const pid = list.find(
    (p) =>
      p.name.match(/jude(.*)wallet(.*)rpc/gim) ||
      p.cmd?.match(/jude(.*)wallet(.*)rpc/gim)
  )?.pid;

  if (pid) {
    try {
      process.kill(pid);
      console.debug(`Successfully killed jude-wallet-rpc PID: ${pid}`);
    } catch (e) {
      console.error(`Failed to kill jude-wallet-rpc PID: ${pid} Error: ${e}`);
    }
  } else {
    console.debug(
      `jude-wallet-rpc was not killed because process could not be found`
    );
  }
}

export async function stopCli() {
  cli?.kill('SIGINT');
}

export async function spawnSubcommand(
  subCommand: string,
  options: { [option: string]: string },
  onLog: (log: CliLog[]) => void,
  onExit: (code: number | null, signal: NodeJS.Signals | null) => void,
  onStdOut: (data: string) => void
): Promise<ChildProcessWithoutNullStreams> {
  /*
  This looks bad, I know
  Two things are happening here:
    - It returns a promise that resolves as soon as the process is spawned
    - and it adds a function to the queue that is called as soon as no other cli process is running and which returns a promise that resolves as soon as the process exits

  This prevents multiple subcommands from being spawned at the same time and causing issues
   */
  return new Promise<ChildProcessWithoutNullStreams>(
    (resolveSpawn, rejectSpawn) => {
      queue.add(
        () =>
          new Promise<void>(async (resolveRunning) => {
            try {
              const [appDataPath, binaryInfo, spawnArgs] = await Promise.all([
                getAppDataDir(),
                downloadSwapBinary(),
                getSpawnArgs(subCommand, options),
                killjudeWalletRpc(),
              ]);

              cli = spawnProc(`./${binaryInfo.name}`, spawnArgs, {
                cwd: appDataPath,
              });

              // Added in: Node v15.1.0, v14.17.0
              cli.on('spawn', () => {
                if (cli) {
                  console.log(
                    `Spawned CLI Arguments: ${cli.spawnargs.join(
                      ' '
                    )} in folder ${appDataPath} with PID ${cli.pid}`
                  );

                  [cli.stderr, cli.stdout].forEach((stream) => {
                    stream.setEncoding('utf8');
                    stream.on('data', (data: string) => {
                      onStdOut(data);

                      const logs = data
                        .toString()
                        .split(/(\r?\n)/g)
                        .map((logText: string) => {
                          console.log(`[${subCommand}] ${data.trim()}`);

                          try {
                            const log = JSON.parse(logText);
                            if (isCliLog(log)) {
                              return log;
                            }
                            throw new Error('Required properties are missing');
                          } catch (e) {
                            console.log(
                              `[${subCommand}] Failed to parse cli log. Log text: ${logText} Error: ${e}`
                            );
                          }

                          return null;
                        })
                        .filter(isCliLog);

                      onLog(logs);

                      readFromDatabaseAndUpdateState();
                    });
                  });

                  resolveSpawn(cli);
                }
              });

              cli.on('error', (e) => {
                cli = null;
                rejectSpawn(e);
                resolveRunning();
              });

              cli.on('exit', async (code, signal) => {
                console.log(
                  `[${subCommand}] CLI excited with code: ${code} and signal: ${signal}`
                );

                cli = null;

                try {
                  await readFromDatabaseAndUpdateState();
                } finally {
                  onExit(code, signal);
                  resolveRunning();
                }
              });
            } catch (e) {
              rejectSpawn(e);
              resolveRunning();
            }
          })
      );
    }
  );
}
