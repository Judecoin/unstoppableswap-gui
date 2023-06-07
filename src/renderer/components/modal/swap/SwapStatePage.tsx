import { Box } from '@material-ui/core';
import {
  isSwapStateBtcLockInMempool,
  isSwapStateBtcRedemeed,
  isSwapStateInitiated,
  isSwapStateProcessExited,
  isSwapStateReceivedQuote,
  isSwapStateStarted,
  isSwapStateWaitingForBtcDeposit,
  isSwapStatejudeLocked,
  isSwapStatejudeLockInMempool,
  isSwapStatejudeRedeemInMempool,
  SwapState,
} from '../../../../models/storeModel';
import InitiatedPage from './pages/InitiatedPage';
import WaitingForBitcoinDepositPage from './pages/WaitingForBitcoinDepositPage';
import StartedPage from './pages/StartedPage';
import BitcoinLockTxInMempoolPage from './pages/BitcoinLockTxInMempoolPage';
import judeLockTxInMempoolPage from './pages/judeLockInMempoolPage';
import ProcessExitedPage from './pages/ProcessExitedPage';
import judeRedeemInMempoolPage from './pages/judeRedeemInMempoolPage';
import ReceivedQuotePage from './pages/ReceivedQuotePage';
import WatingForBtcRedeemPage from './pages/WaitingForBtcRedeemPage';
import BitcoinRedeemedPage from './pages/BitcoinRedeemedPage';
import SwapInitPage from './pages/SwapInitPage';

export default function SwapStatePage({
  swapState,
}: {
  swapState: SwapState | null;
}) {
  if (swapState === null) {
    return <SwapInitPage />;
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
  if (isSwapStatejudeLocked(swapState)) {
    return <WatingForBtcRedeemPage />;
  }
  if (isSwapStateBtcRedemeed(swapState)) {
    return <BitcoinRedeemedPage />;
  }
  if (isSwapStatejudeRedeemInMempool(swapState)) {
    return <judeRedeemInMempoolPage state={swapState} />;
  }
  if (isSwapStateProcessExited(swapState)) {
    return <ProcessExitedPage state={swapState} />;
  }
  console.error(
    `No swap state page found for swap state State: ${JSON.stringify(
      swapState,
      null,
      4
    )}`
  );
  return <Box>No information to display</Box>;
}
