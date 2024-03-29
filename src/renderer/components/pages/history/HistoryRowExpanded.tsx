import {
  Box,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import {
  MergedDbState,
  getSwapBtcAmount,
  getSwapExchangeRate,
  getSwapTxFees,
  getSwapjudeAmount,
} from '../../../../models/databaseModel';
import { SwapCancelRefundButton, SwapResumeButton } from './HistoryRowActions';

const useStyles = makeStyles((theme) => ({
  outer: {
    display: 'grid',
    flexDirection: 'column',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  outerActionBar: {
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

function ActionBar({ dbState }: { dbState: MergedDbState }) {
  const classes = useStyles();
  return (
    <Box className={classes.outerActionBar}>
      <SwapResumeButton dbState={dbState} size="small" variant="outlined" />
      <SwapCancelRefundButton
        dbState={dbState}
        size="small"
        variant="outlined"
      />
    </Box>
  );
}

export default function HistoryRowExpanded({
  dbState,
}: {
  dbState: MergedDbState;
}) {
  const classes = useStyles();

  const btcAmount = getSwapBtcAmount(dbState);
  const judeAmount = getSwapjudeAmount(dbState);
  const txFees = getSwapTxFees(dbState);
  const exchangeRate = getSwapExchangeRate(dbState);
  const { provider } = dbState;

  return (
    <Box className={classes.outer}>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Swap ID</TableCell>
              <TableCell>{dbState.swapId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>State Name</TableCell>
              <TableCell>{dbState.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>jude Amount</TableCell>
              <TableCell>{judeAmount} BTC</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bitcoin Amount</TableCell>
              <TableCell>{btcAmount || '?'} BTC</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Exchange Rate</TableCell>
              <TableCell>{exchangeRate.toPrecision(6)} jude/BTC</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bitcoin Network Fees</TableCell>
              <TableCell>{txFees} BTC</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Provider Address</TableCell>
              <TableCell>{provider.multiAddr}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <ActionBar dbState={dbState} />
    </Box>
  );
}
