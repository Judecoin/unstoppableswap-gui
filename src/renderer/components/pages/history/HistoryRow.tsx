import {
  Box,
  Collapse,
  IconButton,
  makeStyles,
  TableCell,
  TableRow,
} from '@material-ui/core';
import React, { useState } from 'react';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { MergedDbState } from '../../../../models/databaseModel';
import HistoryRowActions from './HistoryRowActions';
import HistoryRowExpanded from './HistoryRowExpanded';
import {
  getSwapBtcAmount,
  getSwapjudeAmount,
} from '../../../../utils/parseUtils';

type HistoryRowProps = {
  dbState: MergedDbState;
};

const useStyles = makeStyles((theme) => ({
  amountTransferContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

function AmountTransfer({
  btcAmount,
  judeAmount,
}: {
  judeAmount: number;
  btcAmount: number | null;
}) {
  const classes = useStyles();

  return (
    <Box className={classes.amountTransferContainer}>
      {btcAmount ? `${btcAmount.toFixed(6)} BTC` : '?'}
      <ArrowForwardIcon />
      {`${judeAmount.toFixed(6)} jude`}
    </Box>
  );
}

export default function HistoryRow({ dbState }: HistoryRowProps) {
  const btcAmount = getSwapBtcAmount(dbState);
  const judeAmount = getSwapjudeAmount(dbState);

  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{dbState.swapId.substr(0, 5)}...</TableCell>
        <TableCell>
          <AmountTransfer judeAmount={judeAmount} btcAmount={btcAmount} />
        </TableCell>
        <TableCell>{dbState.type}</TableCell>
        <TableCell>
          <HistoryRowActions dbState={dbState} />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <HistoryRowExpanded dbState={dbState} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
