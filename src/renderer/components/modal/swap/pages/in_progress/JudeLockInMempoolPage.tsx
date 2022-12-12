import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateJudeLockInMempool } from '../../../../../../models/storeModel';
import JudeTransactionInfoBox from '../../JudeTransactionInfoBox';

type JudeLockTxInMempoolPageProps = {
  state: SwapStateJudeLockInMempool;
};

export default function JudeLockTxInMempoolPage({
  state,
}: JudeLockTxInMempoolPageProps) {
  const additionalContent = `Confirmations: ${state.aliceJudeLockTxConfirmations}/10`;

  return (
    <Box>
      <DialogContentText>
        They have published their Jude lock transaction. The swap will proceed
        once the transaction has been confirmed.
      </DialogContentText>

      <JudeTransactionInfoBox
        title="Jude Lock Transaction"
        txId={state.aliceJudeLockTxId}
        additionalContent={additionalContent}
        loading
      />
    </Box>
  );
}
