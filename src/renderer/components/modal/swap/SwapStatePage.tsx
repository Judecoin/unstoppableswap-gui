import React from 'react';
import {
  isSwapStateBtcLockInMempool,
  isSwapStateDownloadingBinary,
  isSwapStateInitiated,
  isSwapStateProcessExited,
  isSwapStateReceivedQuote,
  isSwapStateStarted,
  isSwapStateWaitingForBtcDeposit,
  isSwapStatejudeLockInMempool,
  isSwapStatejudeRedeemInMempool,
  SwapState,
} from '../../../../models/storeModel';
import DownloadingBinaryPage from './pages/DownloadingBinaryPage';
import InitiatedPage from './pages/InitiatedPage';
import WaitingForBitcoinDepositPage from './pages/WaitingForBitcoinDepositPage';
import StartedPage from './pages/StartedPage';
import BitcoinLockTxInMempoolPage from './pages/BitcoinLockTxInMempoolPage';
import judeLockTxInMempoolPage from './pages/judeLockInMempoolPage';
import ProcessExitedPage from './pages/ProcessExitedPage';
import judeRedeemInMempoolPage from './pages/judeRedeemInMempoolPage';
import ReceivedQuotePage from './pages/ReceivedQuotePage';

export default function SwapStatePage({
  swapState,
  onCancel,
}: {
  swapState: SwapState;
  onCancel: () => void;
}) {
  if (isSwapStateDownloadingBinary(swapState)) {
    return <DownloadingBinaryPage state={swapState} />;
  }
  if (isSwapStateInitiated(swapState)) {
    return <InitiatedPage />;
  }
  if (isSwapStateReceivedQuote(swapState)) {
    return <ReceivedQuotePage />;
  }
  if (isSwapStateWaitingForBtcDeposit(swapState)) {
    return <WaitingForBitcoinDepositPage state={swapState} />;
  }
  if (isSwapStateWaitingForBtcDeposit(swapState)) {
    return <WaitingForBitcoinDepositPage state={swapState} />;
  }
  if (isSwapStateStarted(swapState)) {
    return <StartedPage />;
  }
  if (isSwapStateBtcLockInMempool(swapState)) {
    return <BitcoinLockTxInMempoolPage state={swapState} />;
  }
  if (isSwapStatejudeLockInMempool(swapState)) {
    return <judeLockTxInMempoolPage state={swapState} />;
  }
  if (isSwapStatejudeRedeemInMempool(swapState)) {
    return <judeRedeemInMempoolPage state={swapState} />;
  }
  if (isSwapStateProcessExited(swapState)) {
    return <ProcessExitedPage state={swapState} onCancel={onCancel} />;
  }
  return <pre>{JSON.stringify(swapState, null, 4)}</pre>;
}
