import { Button, TableCell, TableRow } from '@material-ui/core';
import React from 'react';
import {
  isBtcLockedDbState,
  MergedDbState,
} from '../../../models/databaseModel';
import { pionerosTojude, satsToBtc } from '../../../swap/utils/unit-utils';
import { TxLock } from '../../../models/txLockModel';

type HistoryRowProps = {
  dbState: MergedDbState;
};

function getFees(tx: TxLock): number {
  const sumInput = tx.inner.inputs
    .map((input) => input.witness_utxo.value)
    .reduce((prev, next) => prev + next);

  const sumOutput = tx.inner.global.unsigned_tx.output
    .map((output) => output.value)
    .reduce((prev, next) => prev + next);

  return satsToBtc(sumInput - sumOutput);
}

export default function HistoryRow({ dbState }: HistoryRowProps) {
  const btcAmount = isBtcLockedDbState(dbState.state)
    ? satsToBtc(
        dbState.state.Bob.BtcLocked.state3.tx_lock.inner.global.unsigned_tx
          .output[0]?.value
      )
    : null;
  const txLockFees = isBtcLockedDbState(dbState.state)
    ? getFees(dbState.state.Bob.BtcLocked.state3.tx_lock)
    : null;
  const judeAmount = pionerosTojude(
    dbState.state.Bob.ExecutionSetupDone.state2.jude
  );

  return (
    <TableRow>
      <TableCell>{dbState.swapId}</TableCell>
      <TableCell>{judeAmount.toFixed(5)} jude</TableCell>
      <TableCell>{btcAmount ? btcAmount.toFixed(6) : '?'} BTC</TableCell>
      <TableCell>
        {btcAmount ? (btcAmount / judeAmount).toFixed(6) : '?'} jude/BTC
      </TableCell>
      <TableCell>{txLockFees || '?'} BTC</TableCell>
      <TableCell>{dbState.type}</TableCell>
      <TableCell>
        <Button>Action</Button>
      </TableCell>
    </TableRow>
  );
}
