import {
  Box,
  Button,
  makeStyles,
  TableCell,
  TableRow,
} from '@material-ui/core';
import React from 'react';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  isBtcLockedDbState,
  MergedDbState,
} from '../../../../models/databaseModel';
import { pionerosTojude, satsToBtc } from '../../../../utils/currencyUtils';
import { TxLock } from '../../../../models/bitcoinModel';

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

const useStyles = makeStyles((theme) => ({
  amountTransferContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  amountTransferIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

function AmountTransfer({
  btcAmount,
  judeAmount,
}: {
  judeAmount: string;
  btcAmount: string;
}) {
  const classes = useStyles();

  return (
    <Box className={classes.amountTransferContainer}>
      {btcAmount}
      <ArrowForwardIcon className={classes.amountTransferIcon} />
      {judeAmount}
    </Box>
  );
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
      <TableCell>{dbState.swapId.substr(0, 5)}...</TableCell>
      <TableCell>
        <AmountTransfer
          judeAmount={`${judeAmount.toFixed(5)} jude`}
          btcAmount={btcAmount ? `${btcAmount.toFixed(6)} BTC ` : '?'}
        />
      </TableCell>
      <TableCell>
        {btcAmount ? (btcAmount / judeAmount).toFixed(5) : '?'} jude/BTC
      </TableCell>
      <TableCell>{txLockFees || '?'} BTC</TableCell>
      <TableCell>{dbState.type}</TableCell>
      <TableCell>
        <Button>Action</Button>
      </TableCell>
    </TableRow>
  );
}
