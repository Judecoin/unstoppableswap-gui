import { Box, DialogContentText } from '@material-ui/core';
import { SwapStatejudeLockInMempool } from '../../../../../models/storeModel';
import judeIcon from '../../../icons/judeIcon';
import { isTestnet } from '../../../../../store/config';
import { getjudeTxExplorerUrl } from '../../../../../utils/currencyUtils';
import TransactionInfoBox from '../TransactionInfoBox';

type judeLockTxInMempoolPageProps = {
  state: SwapStatejudeLockInMempool;
};

export default function judeLockTxInMempoolPage({
  state,
}: judeLockTxInMempoolPageProps) {
  const explorerUrl = getjudeTxExplorerUrl(
    state.alicejudeLockTxId,
    isTestnet()
  );
  const additionalText = `Confirmations: ${state.alicejudeLockTxConfirmations}/10`;

  return (
    <Box>
      <DialogContentText>
        The swap provider has published its jude lock transaction. The swap
        will proceed once the transaction has been confirmed.
      </DialogContentText>

      <TransactionInfoBox
        title="jude Lock Transaction"
        txId={state.alicejudeLockTxId}
        explorerUrl={explorerUrl}
        additionalText={additionalText}
        icon={<judeIcon />}
        loading
      />
    </Box>
  );
}
