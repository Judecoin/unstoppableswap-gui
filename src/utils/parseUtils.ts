/*
Extract btc amount from string

E.g: "0.00100000 BTC"
Output: 0.001
 */
import { pionerosTojude, satsToBtc } from './currencyUtils';
import {
  isBtcCancelledDbState,
  isBtcLockedDbState,
  isBtcRedeemedDbState,
  isDoneBtcPunishedDbState,
  isDoneBtcRefundedDbState,
  isMergedBtcLockedDbState,
  isMergedBtcRedeemedDbState,
  isMergedEncSigSentDbState,
  isMergedExecutionSetupDoneDbState,
  isMergedjudeLockedDbState,
  isMergedjudeLockProofReceivedDbState,
  MergedDbState,
} from '../models/databaseModel';

export function extractAmountFromUnitString(text: string): number | null {
  if (text != null) {
    const parts = text.split(' ');
    if (parts.length === 2) {
      const amount = Number.parseFloat(parts[0]);
      return amount;
    }
  }
  return null;
}

export function getSwapTxFees(dbState: MergedDbState): number | null {
  if (isBtcLockedDbState(dbState.state)) {
    const tx = dbState.state.Bob.BtcLocked.state3.tx_lock;

    const sumInput = tx.inner.inputs
      .map((input) => input.witness_utxo.value)
      .reduce((prev, next) => prev + next);

    const sumOutput = tx.inner.global.unsigned_tx.output
      .map((output) => output.value)
      .reduce((prev, next) => prev + next);

    return satsToBtc(sumInput - sumOutput);
  }

  return null;
}

export function getSwapBtcAmount(dbState: MergedDbState): number | null {
  if (isBtcLockedDbState(dbState.state)) {
    // This assumes that the lock tx always has one output
    return satsToBtc(
      dbState.state.Bob.BtcLocked.state3.tx_lock.inner.global.unsigned_tx
        .output[0]?.value
    );
  }

  return null;
}

export function getSwapjudeAmount(dbState: MergedDbState): number {
  return pionerosTojude(dbState.state.Bob.ExecutionSetupDone.state2.jude);
}

export function getSwapExchangeRate(dbState: MergedDbState): number | null {
  const txFees = getSwapTxFees(dbState);
  const btcAmount = getSwapBtcAmount(dbState);
  const judeAmount = getSwapjudeAmount(dbState);

  if (txFees && btcAmount && judeAmount) {
    return btcAmount / judeAmount;
  }

  return null;
}

export function isSwapResumable(dbState: MergedDbState): boolean {
  return (
    isMergedExecutionSetupDoneDbState(dbState) ||
    isMergedBtcLockedDbState(dbState) ||
    isMergedjudeLockProofReceivedDbState(dbState) ||
    isMergedjudeLockedDbState(dbState) ||
    isMergedEncSigSentDbState(dbState) ||
    isMergedBtcRedeemedDbState(dbState)
  );
}

export function isSwapCancellable(dbState: MergedDbState): boolean {
  return (
    isBtcLockedDbState(dbState.state) &&
    !isBtcRedeemedDbState(dbState.state) &&
    !isBtcCancelledDbState(dbState.state)
  );
}

export function isSwapRefundable(dbState: MergedDbState): boolean {
  return (
    isBtcLockedDbState(dbState.state) &&
    isBtcCancelledDbState(dbState.state) &&
    !isDoneBtcRefundedDbState(dbState.state) &&
    !isDoneBtcPunishedDbState(dbState.state)
  );
}
