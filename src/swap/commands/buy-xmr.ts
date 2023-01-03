import {
  isSwapLogAliceLockedjude,
  isSwapLogBtcTxStatusChanged,
  isSwapLogPublishedBtcTx,
  isSwapLogReceivedBtc,
  isSwapLogReceivedQuote,
  isSwapLogReceivedjudeLockTxConfirmation,
  isSwapLogRedeemedjude,
  isSwapLogStartedSwap,
  isSwapLogWaitingForBtcDeposit,
  SwapLog,
  SwapLogBtcTxStatusChanged,
  SwapLogReceivedjudeLockTxConfirmation,
  SwapLogRedeemedjude,
} from '../../models/swapModel';
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
import { Provider } from '../../models/storeModel';
import { BinaryDownloadStatus } from '../downloader';
import { spawnSubcommand } from '../cli';

function onSwapLog(log: SwapLog) {
  store.dispatch(addLog(log));

  if (isSwapLogReceivedQuote(log)) {
    store.dispatch(receivedQuoteLog(log));
  } else if (isSwapLogWaitingForBtcDeposit(log)) {
    store.dispatch(waitingForBtcDepositLog(log));
  } else if (isSwapLogReceivedBtc(log)) {
    store.dispatch(receivedBtcLog(log));
  } else if (isSwapLogStartedSwap(log)) {
    store.dispatch(startingNewSwapLog(log));
  } else if (isSwapLogPublishedBtcTx(log)) {
    store.dispatch(publishedBtcTransactionLog(log));
  } else if (isSwapLogBtcTxStatusChanged(log)) {
    store.dispatch(
      btcTransactionStatusChangedLog(log as SwapLogBtcTxStatusChanged)
    );
  } else if (isSwapLogAliceLockedjude(log)) {
    store.dispatch(aliceLockedjudeLog(log));
  } else if (isSwapLogReceivedjudeLockTxConfirmation(log)) {
    store.dispatch(
      judeLockStatusChangedLog(log as SwapLogReceivedjudeLockTxConfirmation)
    );
  } else if (isSwapLogRedeemedjude(log)) {
    store.dispatch(transferredjudeToWalletLog(log as SwapLogRedeemedjude));
  } else {
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
