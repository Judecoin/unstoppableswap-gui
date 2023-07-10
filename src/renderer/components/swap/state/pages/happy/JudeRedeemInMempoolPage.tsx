import { Box, Link, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStateJudeRedeemInMempool } from '../../../../../../models/store';
import { getJudeTxExplorerUrl } from '../../../../../utils/blockexplorer-utils';
import { isTestnet } from '../../../../../../store/config';

type JudeRedeemInMempoolPageProps = {
  state: SwapStateJudeRedeemInMempool;
};

export default function JudeRedeemInMempoolPage({
  state,
}: JudeRedeemInMempoolPageProps) {
  return (
    <Box>
      <Typography variant="h5">
        Jude redeem transaction has been published
      </Typography>
      <Typography variant="body1">
        TxId:{' '}
        <Link
          href={getJudeTxExplorerUrl(state.bobJudeRedeemTxId, isTestnet())}
          target="_blank"
        >
          {state.bobJudeRedeemTxId}
        </Link>
      </Typography>
    </Box>
  );
}
