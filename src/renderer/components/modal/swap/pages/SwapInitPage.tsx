import { Box, Button, DialogContentText, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import judeAddressTextField from '../../../inputs/judeAddressTextField';
import BitcoinAddressTextField from '../../../inputs/BitcoinAddressTextField';
import { useAppSelector } from '../../../../../store/hooks';

const useStyles = makeStyles((theme) => ({
  initButton: {
    marginTop: theme.spacing(1),
  },
}));

export default function SwapInitPage() {
  const classes = useStyles();
  const [redeemAddress, setRedeemAddress] = useState(
    '59McWTPGc745SRWrSMoh8oTjoXoQq6sPUgKZ66dQWXuKFQ2q19h9gvhJNZcFTizcnT12r63NFgHiGd6gBCjabzmzHAMoyD6'
  );
  const [redeemAddressValid, setRedeemAddressValid] = useState(false);
  const [refundAddress, setRefundAddress] = useState(
    'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx'
  );
  const [refundAddressValid, setRefundAddressValid] = useState(false);
  const selectedProvider = useAppSelector(
    (state) => state.providers.selectedProvider
  );

  async function handleSwapStart() {
    if (selectedProvider) {
      try {
        await ipcRenderer.invoke(
          'spawn-buy-jude',
          selectedProvider,
          redeemAddress,
          refundAddress
        );
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <Box>
      <DialogContentText>
        Fill in your jude and Bitcoin addresses. They will be used only for
        this swap.
      </DialogContentText>

      <judeAddressTextField
        address={redeemAddress}
        onAddressChange={setRedeemAddress}
        onAddressValidityChange={setRedeemAddressValid}
        helperText="The jude will be sent to this address"
        fullWidth
      />

      <BitcoinAddressTextField
        address={refundAddress}
        onAddressChange={setRefundAddress}
        onAddressValidityChange={setRefundAddressValid}
        helperText="In case something goes terribly wrong, all Bitcoin will be refunded to this address"
        fullWidth
      />

      <Button
        disabled={
          !refundAddressValid || !redeemAddressValid || !selectedProvider
        }
        onClick={handleSwapStart}
        variant="contained"
        color="primary"
        size="large"
        className={classes.initButton}
      >
        Start swap
      </Button>
    </Box>
  );
}
