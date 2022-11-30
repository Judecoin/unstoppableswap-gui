import { Box, Link, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStatejudeRedeemInMempool } from '../../../../../swap/swap-state-machine';

type judeRedeemInMempoolPageProps = {
  state: SwapStatejudeRedeemInMempool;
};

export default function judeRedeemInMempoolPage({
  state,
}: judeRedeemInMempoolPageProps) {
  return (
    <Box>
      <Typography variant="h5">
        jude redeem transaction has been published
      </Typography>
      <Typography variant="body1">
        TxId:{' '}
        <Link
          href={`${
            state.provider.testnet
              ? 'https://stagenet.judechain.net'
              : 'https://judechain.net'
          }/tx/${state.bobjudeRedeemTxId}`}
          target="_blank"
        >
          {state.bobjudeRedeemTxId}
        </Link>
      </Typography>
    </Box>
  );
}
