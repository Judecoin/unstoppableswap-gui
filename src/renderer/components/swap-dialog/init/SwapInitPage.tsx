import {
  Button,
  DialogActions,
  DialogContent,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { ChangeEvent, useState } from 'react';
import useStore, { Provider } from '../../../store';
import SwapDialogTitle from '../SwapDialogTitle';
import {
  isBtcAddressValid,
  isjudeAddressValid,
} from '../../../../swap/utils/crypto-utils';
import { startSwap } from '../../../../swap/swap-process-manager';

const useStyles = makeStyles((theme) => ({
  alertBox: {
    marginTop: theme.spacing(1),
  },
  redeemAddressField: {
    marginBottom: theme.spacing(2),
  },
}));

type FirstPageProps = {
  onClose: () => void;
};

export default function SwapInitPage({ onClose }: FirstPageProps) {
  const classes = useStyles();

  const currentProvider = useStore(
    (state) => state.currentProvider
  ) as Provider;
  const [redeemAddress, setPayoutAddress] = useState(
    '59McWTPGc745SRWrSMoh8oTjoXoQq6sPUgKZ66dQWXuKFQ2q19h9gvhJNZcFTizcnT12r63NFgHiGd6gBCjabzmzHAMoyD6'
  );
  const [refundAddress, setRefundAddress] = useState(
    'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx'
  );

  function handlePayoutChange(event: ChangeEvent<HTMLInputElement>) {
    let text = event.target.value.trim();
    if (text.toLowerCase().startsWith('jude:')) {
      text = text.substring(7);
    }
    setPayoutAddress(text);
  }

  function handleRefundChange(event: ChangeEvent<HTMLInputElement>) {
    const text = event.target.value.trim();
    setRefundAddress(text);
  }

  function getRedeemAddressError() {
    if (isjudeAddressValid(redeemAddress, currentProvider.testnet)) {
      return null;
    }
    return 'Not a valid jude address';
  }

  function getRefundAddressError() {
    if (isBtcAddressValid(refundAddress, currentProvider.testnet)) {
      return null;
    }
    return `Only bech32 addresses are supported. They begin with "${
      currentProvider.testnet ? 'tb1' : 'bc1'
    }"`;
  }

  function handleSwapStart() {
    startSwap(currentProvider, redeemAddress, refundAddress);
    onClose();
  }

  return (
    <>
      <SwapDialogTitle title="Enter your addresses" />
      <DialogContent dividers>
        <TextField
          variant="outlined"
          label="jude payout address"
          value={redeemAddress}
          onChange={handlePayoutChange}
          error={Boolean(getRedeemAddressError() && redeemAddress.length > 5)}
          fullWidth
          className={classes.redeemAddressField}
          placeholder={
            currentProvider.testnet ? '59McWTPGc745...' : '888tNkZrPN6J...'
          }
          helperText={
            getRedeemAddressError() ||
            'The judej will be sent to this address'
          }
        />

        <TextField
          variant="outlined"
          label="Bitcoin refund address"
          value={refundAddress}
          onChange={handleRefundChange}
          error={Boolean(getRefundAddressError() && refundAddress.length > 5)}
          fullWidth
          placeholder={
            currentProvider.testnet ? 'tb1q4aelwalu...' : 'bc18ociqZ9mZ...'
          }
          helperText={
            getRefundAddressError() ||
            'In case something goes wrong all BTC is refunded to this address'
          }
        />

        <Alert severity="warning" className={classes.alertBox}>
          <AlertTitle>Attention</AlertTitle>
          Double check the jude address — funds sent to the wrong address
          can&apos;t be recovered
        </Alert>
        {currentProvider.testnet ? (
          <Alert severity="info" className={classes.alertBox}>
            <AlertTitle>Testnet</AlertTitle>
            This swap provider only trades testnet coins. They don&apos;t hold
            any value. If you want to swap real coins switch to a mainnet swap
            provider.
          </Alert>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button
          disabled={Boolean(getRedeemAddressError() || getRefundAddressError())}
          onClick={handleSwapStart}
          color="primary"
          variant="contained"
        >
          Next
        </Button>
      </DialogActions>
    </>
  );
}
