/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import log from 'electron-log';
import blocked from 'blocked-at';
import { resolveHtmlPath } from './util';
import watchDatabase from './cli/database';
import { stopCli } from './cli/cli';
import spawnBalanceCheck from './cli/commands/balanceCommand';
import { spawnBuyjude, resumeBuyjude } from './cli/commands/buyjudeCommand';
import spawnWithdrawBtc from './cli/commands/withdrawBtcCommand';
import downloadSwapBinary from './cli/downloader';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();

  blocked((time, stack) => {
    console.log(
      `Main thread has been blocked for ${time}ms, operation started here:`,
      stack
    );
  });
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minHeight: 728,
    minWidth: 1024,
    resizable: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/main/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }

    await watchDatabase();
    await spawnBalanceCheck();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.addListener('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

app.on('will-quit', stopCli);

ipcMain.handle('stop-cli', stopCli);

ipcMain.handle('spawn-balance-check', spawnBalanceCheck);

ipcMain.handle(
  'spawn-buy-jude',
  (_event, provider, redeemAddress, refundAddress) =>
    spawnBuyjude(provider, redeemAddress, refundAddress)
);

ipcMain.handle('resume-buy-jude', (_event, swapId) => resumeBuyjude(swapId));

ipcMain.handle('spawn-withdraw-btc', (_event, address) =>
  spawnWithdrawBtc(address)
);

ipcMain.handle('initiate-downloader', downloadSwapBinary);
