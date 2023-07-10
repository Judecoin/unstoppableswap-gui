import { Box, Link, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStatejudeLockInMempool } from '../../../../../swap/swap-state-machine';

type judeLockTxInMempoolPageProps = {
  state: SwapStatejudeLockInMempool;
};

export default function judeLockTxInMempoolPage({
  state,
}: judeLockTxInMempoolPageProps) {
  return (
    <Box>
      <Typography variant="h5">
        Waiting for jude lock transaction be confirmed
      </Typography>
      <Typography variant="body1">
        TxId:{' '}
        <Link
          href={`${
            state.provider.testnet
              ? 'https://stagenet.judechain.net'
              : 'https://judechain.net'
          }/tx/${state.alicejudeLockTxId}`}
          target="_blank"
        >
          {state.alicejudeLockTxId}
        </Link>
      </Typography>
      <Typography variant="body1">
        Confirmations: {state.alicejudeLockTxConfirmations}
      </Typography>
    </Box>
  );
}
