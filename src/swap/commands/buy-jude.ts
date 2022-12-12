import {
  SwapLog,
  SwapLogAliceLockedjude,
  SwapLogBtcTxStatusChanged,
  SwapLogPublishedBtcTx,
  SwapLogReceivedBtc,
  SwapLogReceivedQuote,
  SwapLogReceivedjudeLockTxConfirmation,
  SwapLogRedeemedjude,
  SwapLogStartedSwap,
  SwapLogWaitingForBtcDeposit,
} from '../../models/swap';
import { store } from '../../store/store';
import {
  addLog,
  aliceLockedjudeLog,
  appendStdOut,
  btcTransactionStatusChangedLog,
  downloadProgressUpdate,
  initiateSwap,
  processExited,
  publishedBtcTransactionLog,
  receivedBtcLog,
  receivedQuoteLog,
  startingNewSwapLog,
  transferredjudeToWalletLog,
  waitingForBtcDepositLog,
  judeLockStatusChangedLog,
} from '../../store/features/swap/swapSlice';
import { Provider } from '../../models/store';
import { BinaryDownloadStatus } from '../downloader';
import { spawnSubcommand } from '../cli';

function onSwapLog(log: SwapLog) {
  store.dispatch(addLog(log));

  switch (log.fields.message) {
    case 'Received quote':
      store.dispatch(receivedQuoteLog(log as SwapLogReceivedQuote));
      break;
    case 'Waiting for Bitcoin deposit':
      store.dispatch(
        waitingForBtcDepositLog(log as SwapLogWaitingForBtcDeposit)
      );
      break;
    case 'Received Bitcoin':
      store.dispatch(receivedBtcLog(log as SwapLogReceivedBtc));
      break;
    case 'Starting new swap':
      store.dispatch(startingNewSwapLog(log as SwapLogStartedSwap));
      break;
    case 'Published Bitcoin transaction':
      store.dispatch(publishedBtcTransactionLog(log as SwapLogPublishedBtcTx));
      break;
    case 'Bitcoin transaction status changed':
      store.dispatch(
        btcTransactionStatusChangedLog(log as SwapLogBtcTxStatusChanged)
      );
      break;
    case 'Alice locked jude':
      store.dispatch(aliceLockedjudeLog(log as SwapLogAliceLockedjude));
      break;
    case 'Received new confirmation for jude lock tx':
      store.dispatch(
        judeLockStatusChangedLog(log as SwapLogReceivedjudeLockTxConfirmation)
      );
      break;
    case 'Successfully transferred jude to wallet':
      store.dispatch(transferredjudeToWalletLog(log as SwapLogRedeemedjude));
      break;
    default:
      console.error(`Swap log was not reduced Log: ${JSON.stringify(log)}`);
  }
}

function onDownloadProgress(status: BinaryDownloadStatus) {
  store.dispatch(downloadProgressUpdate(status));
}

function onProcExit(code: number | null, signal: NodeJS.Signals | null) {
  store.dispatch(
    processExited({
      exitCode: code,
      exitSignal: signal,
    })
  );
}

function onStdOut(data: string) {
  store.dispatch(appendStdOut(data));
}

export default async function startSwap(
  provider: Provider,
  redeemAddress: string,
  refundAddress: string
) {
  const sellerIdentifier = `${provider.multiAddr}/p2p/${provider.peerId}`;

  await spawnSubcommand(
    'buy-jude',
    {
      'change-address': refundAddress,
      'receive-address': redeemAddress,
      seller: sellerIdentifier,
    },
    onDownloadProgress,
    onSwapLog,
    onProcExit,
    onStdOut
  );

  store.dispatch(
    initiateSwap({
      provider,
    })
  );
}
