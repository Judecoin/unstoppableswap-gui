import {
  Box,
  LinearProgress,
  Link,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { SwapStateJudeLockInMempool } from '../../../../../../models/store';
import JudeIcon from '../../../../icons/JudeIcon';
import { getJudeTxExplorerUrl } from '../../../../../utils/blockexplorer-utils';
import { isTestnet } from '../../../../../../store/config';

const useStyles = makeStyles((theme) => ({
  depositAddressOuter: {
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  depositAddress: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    alignItems: 'center',
    display: 'flex',
    '& > *': {
      paddingRight: theme.spacing(0.25),
    },
  },
  depositStatusText: {
    paddingTop: theme.spacing(0.5),
  },
}));

type JudeLockTxInMempoolPageProps = {
  state: SwapStateJudeLockInMempool;
};

export default function JudeLockTxInMempoolPage({
  state,
}: JudeLockTxInMempoolPageProps) {
  const classes = useStyles();

  return (
    <Box>
      <Typography variant="h5" align="center">
        Waiting for Jude lock confirmations
      </Typography>
      <Paper variant="outlined" className={classes.depositAddressOuter}>
        <Typography variant="subtitle1">Jude Lock Transaction</Typography>
        <Box className={classes.depositAddress}>
          <JudeIcon />
          <Typography variant="h5">{state.aliceJudeLockTxId}</Typography>
        </Box>
        <LinearProgress variant="indeterminate" />
        <Typography variant="subtitle2" className={classes.depositStatusText}>
          Confirmations: {state.aliceJudeLockTxConfirmations}/10
        </Typography>
        <Typography variant="body1">
          <Link
            href={getJudeTxExplorerUrl(state.aliceJudeLockTxId, isTestnet())}
            target="_blank"
          >
            View on explorer
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
