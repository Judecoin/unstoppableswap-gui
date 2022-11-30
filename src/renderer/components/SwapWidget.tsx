import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  makeStyles,
  Box,
  Paper,
  Typography,
  TextField,
  LinearProgress,
  Fab,
  Button,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import useStore, { ExtendedProvider } from '../store';
import ProviderSelect from './provider-dialog/ProviderSelect';
import { satsToBtc } from '../../swap/utils/unit-utils';
import ProviderSubmitDialog from './provider-dialog/ProviderSubmitDialog';
import SwapInitDialog from './swap-dialog/init/SwapInitDialog';

const useStyles = makeStyles((theme) => ({
  outer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inner: {
    width: 'min(480px, 100%)',
    minHeight: '150px',
    display: 'grid',
    padding: theme.spacing(1),
    gridGap: theme.spacing(1),
  },
  header: {
    padding: 0,
  },
  headerText: {
    padding: theme.spacing(1),
  },
  providerInfo: {
    padding: theme.spacing(1),
  },
  swapIconOuter: {
    display: 'flex',
    justifyContent: 'center',
  },
  swapIcon: {
    marginRight: theme.spacing(1),
  },
}));

function Title() {
  const classes = useStyles();

  return (
    <Box className={classes.header}>
      <Typography variant="h5" className={classes.headerText}>
        Trade
      </Typography>
    </Box>
  );
}

function HasProviderSwapWidget({ provider }: { provider: ExtendedProvider }) {
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);

  const [btcFieldValue, setBtcFieldValue] = useState(0.02);
  const [judeFieldValue, setjudeFieldValue] = useState(1);

  function onBtcAmountChange(event: ChangeEvent<HTMLInputElement>) {
    setBtcFieldValue(Number(event.target.value));
  }

  function updatejudeValue() {
    const parsedBtcAmount = Number(btcFieldValue);
    if (Number.isNaN(parsedBtcAmount)) {
      setjudeFieldValue(0);
    } else {
      const convertedjudeAmount = parsedBtcAmount / satsToBtc(provider.price);
      setjudeFieldValue(convertedjudeAmount);
    }
  }

  function getBtcFieldError(): string | null {
    const parsedBtcAmount = Number(btcFieldValue);
    if (Number.isNaN(parsedBtcAmount)) {
      return 'This is not a valid number';
    }
    if (parsedBtcAmount < satsToBtc(provider.minSwapAmount)) {
      return `The minimum swap amount is ${satsToBtc(
        provider.minSwapAmount
      )} BTC`;
    }
    if (parsedBtcAmount > satsToBtc(provider.maxSwapAmount)) {
      return `The maximum swap amount is ${satsToBtc(
        provider.maxSwapAmount
      )} BTC`;
    }
    return null;
  }

  function handleGuideDialogOpen() {
    if (!getBtcFieldError()) {
      setShowDialog(true);
    }
  }

  useEffect(updatejudeValue, [btcFieldValue, provider]);

  useEffect(() => {
    if (getBtcFieldError()) {
      setBtcFieldValue(satsToBtc(provider.minSwapAmount));
    }
  }, [provider, getBtcFieldError]);

  return (
    // 'elevation' prop can't be passed down (type def issue)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Box className={classes.inner} component={Paper} elevation={15}>
      <Title />
      <TextField
        label="Send"
        size="medium"
        variant="outlined"
        value={btcFieldValue}
        onChange={onBtcAmountChange}
        error={!!getBtcFieldError()}
        helperText={getBtcFieldError()}
        autoFocus
        InputProps={{
          endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
        }}
      />
      <Box className={classes.swapIconOuter}>
        <ArrowDownwardIcon fontSize="small" />
      </Box>
      <TextField
        label="Receive"
        variant="outlined"
        size="medium"
        value={judeFieldValue.toFixed(4)}
        InputProps={{
          endAdornment: <InputAdornment position="end">jude</InputAdornment>,
        }}
      />
      <ProviderSelect />
      <Fab
        variant="extended"
        color="secondary"
        disabled={!!getBtcFieldError()}
        onClick={handleGuideDialogOpen}
      >
        <SwapHorizIcon className={classes.swapIcon} />
        Swap
      </Fab>
      <SwapInitDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </Box>
  );
}

function HasNoProviderSwapWidget() {
  const classes = useStyles();

  const [showSubmitProviderDialog, setShowSubmitProviderDialog] =
    useState(false);

  return (
    // 'elevation' prop can't be passed down (type def issue)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Box className={classes.inner} component={Paper} elevation={15}>
      <Title />
      <LinearProgress />
      <Button onClick={() => setShowSubmitProviderDialog(true)} size="small">
        Submit swap provider
      </Button>
      <ProviderSubmitDialog
        open={showSubmitProviderDialog}
        onClose={() => setShowSubmitProviderDialog(false)}
      />
    </Box>
  );
}

export default function SwapWidget() {
  const classes = useStyles();
  const currentProvider = useStore((state) => state.currentProvider);

  if (currentProvider === null || currentProvider === undefined) {
    return (
      <Box className={classes.outer}>
        <HasNoProviderSwapWidget />
      </Box>
    );
  }
  return (
    <Box className={classes.outer}>
      <HasProviderSwapWidget provider={currentProvider} />
    </Box>
  );
}
