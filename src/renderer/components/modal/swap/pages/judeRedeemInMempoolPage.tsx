import { Box, Link, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStatejudeRedeemInMempool } from '../../../../../models/storeModel';
import { isTestnet } from '../../../../../store/config';
import { getjudeTxExplorerUrl } from '../../../../../utils/currencyUtils';

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
          href={getjudeTxExplorerUrl(state.bobjudeRedeemTxId, isTestnet())}
          target="_blank"
        >
          {state.bobjudeRedeemTxId}
        </Link>
      </Typography>
    </Box>
  );
}
