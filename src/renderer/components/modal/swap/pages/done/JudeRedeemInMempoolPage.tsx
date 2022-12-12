import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateJudeRedeemInMempool } from '../../../../../../models/storeModel';
import { pionerosToJude } from '../../../../../../utils/conversionUtils';
import { useActiveDbState } from '../../../../../../store/hooks';
import JudeTransactionInfoBox from '../../JudeTransactionInfoBox';

type JudeRedeemInMempoolPageProps = {
  state: SwapStateJudeRedeemInMempool | null;
};

export default function JudeRedeemInMempoolPage({
  state,
}: JudeRedeemInMempoolPageProps) {
  const judeAmount = useActiveDbState()?.state.Bob.ExecutionSetupDone.state2.jude;
  const additionalContent = judeAmount
    ? `This transaction transfers ${pionerosToJude(judeAmount).toFixed(
        6
      )} JUDE to ${state?.bobJudeRedeemAddress}`
    : null;

  return (
    <Box>
      <DialogContentText>
        The swap was successful and the Jude has been sent to the address you
        specified. The swap is completed and you may exit the application now.
      </DialogContentText>
      {state && (
        <JudeTransactionInfoBox
          title="Jude Redeem Transaction"
          txId={state.bobJudeRedeemTxId}
          additionalContent={additionalContent}
          loading={false}
        />
      )}
    </Box>
  );
}
