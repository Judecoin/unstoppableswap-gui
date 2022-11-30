import React, { useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import SwapDialogTitle from '../SwapDialogTitle';
import SwapStopAlert from './SwapStopAlert';
import {
  SwapState,
  SwapStateBtcLockInMempool,
  SwapStateInitiated,
  SwapStatePreparingBinary,
  SwapStateProcessExited,
  SwapStateWaitingForBtcDeposit,
  SwapStateJudeLockInMempool,
  SwapStateJudeRedeemInMempool,
} from '../../../../swap/swap-state-machine';
import SwapStateStepper from './SwapStateStepper';
import PreparingBinaryPage from './pages/PreparingBinaryPage';
import useStore from '../../../store';
import WaitingForBitcoinDepositPage from './pages/WaitingForBitcoinDepositPage';
import BitcoinLockTxInMempoolPage from './pages/BitcoinLockTxInMempoolPage';
import InitiatedPage from './pages/InitiatedPage';
import StartedPage from './pages/StartedPage';
import JudeLockTxInMempoolPage from './pages/JudeLockInMempoolPage';
import JudeRedeemInMempoolPage from './pages/JudeRedeemInMempoolPage';
import ProcessExitedPage from './pages/ProcessExitedPage';

const useStyles = makeStyles({
  content: {
    overflow: 'hidden',
    minHeight: '25rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

function InnerContent({ state }: { state: SwapState }) {
  switch (state.state) {
    case 'preparing binary':
      return <PreparingBinaryPage state={state as SwapStatePreparingBinary} />;
    case 'initiated':
      return <InitiatedPage state={state as SwapStateInitiated} />;
    case 'waiting for btc deposit':
      return (
        <WaitingForBitcoinDepositPage
          state={state as SwapStateWaitingForBtcDeposit}
        />
      );
    case 'started':
      return <StartedPage />;
    case 'btc lock tx is in mempool':
      return (
        <BitcoinLockTxInMempoolPage
          state={state as SwapStateBtcLockInMempool}
        />
      );
    case 'Jude lock tx is in mempool':
      return (
        <JudeLockTxInMempoolPage state={state as SwapStateJudeLockInMempool} />
      );
    case 'jude redeem tx is in mempool':
      return (
        <JudeRedeemInMempoolPage state={state as SwapStateJudeRedeemInMempool} />
      );
    case 'process excited':
      return <ProcessExitedPage state={state as SwapStateProcessExited} />;
    default:
      return <pre>{JSON.stringify(state, null, '\t')}</pre>;
  }
}

export default function SwapStatePage({ state }: { state: SwapState }) {
  const classes = useStyles();
  const [openCancelAlert, setOpenCancelAlert] = useState(false);
  const setSwapState = useStore((s) => s.setSwapState);

  function onCancel() {
    if (state.running) {
      setOpenCancelAlert(true);
    } else {
      setSwapState(null);
    }
  }

  return (
    <>
      <SwapDialogTitle title="Swapping BTC for Jude" />

      <DialogContent dividers className={classes.content}>
        <InnerContent state={state} />
        <SwapStateStepper state={state} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} variant="text">
          Cancel
        </Button>
      </DialogActions>

      <SwapStopAlert
        open={openCancelAlert}
        onClose={() => setOpenCancelAlert(false)}
      />
    </>
  );
}
