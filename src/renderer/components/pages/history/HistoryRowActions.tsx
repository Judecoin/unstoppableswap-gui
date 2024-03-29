import { Button } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import { ButtonProps } from '@material-ui/core/Button/Button';
import {
  MergedDbState,
  isSwapRefundable,
  isSwapResumable,
} from '../../../../models/databaseModel';

export function SwapResumeButton({
  dbState,
  ...props
}: { dbState: MergedDbState } & ButtonProps) {
  const resumable = isSwapResumable(dbState);

  async function resume() {
    await ipcRenderer.invoke('resume-buy-jude', dbState.swapId);
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={resume}
      disabled={!resumable}
      {...props}
    >
      Resume
    </Button>
  );
}

export function SwapCancelRefundButton({
  dbState,
  ...props
}: {
  dbState: MergedDbState;
} & ButtonProps) {
  const cancelable = isSwapResumable(dbState);
  const refundable = isSwapRefundable(dbState);

  async function cancelOrRefund() {
    if (cancelable) {
      await ipcRenderer.invoke('cancel-buy-jude', dbState.swapId);
    } else if (refundable) {
      await ipcRenderer.invoke('refund-buy-jude', dbState.swapId);
    }
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={cancelOrRefund}
      disabled={!cancelable && !refundable}
      {...props}
    >
      Cancel & Refund
    </Button>
  );
}

export default function HistoryRowActions({
  dbState,
}: {
  dbState: MergedDbState;
}) {
  return <SwapResumeButton dbState={dbState} />;
}
