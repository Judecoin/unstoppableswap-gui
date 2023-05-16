import { Box, DialogContentText } from '@material-ui/core';
import { SwapStatejudeRedeemInMempool } from '../../../../../models/storeModel';
import { isTestnet } from '../../../../../store/config';
import {
  getjudeTxExplorerUrl,
  pionerosTojude,
} from '../../../../../utils/currencyUtils';
import TransactionInfoBox from '../TransactionInfoBox';
import judeIcon from '../../../icons/judeIcon';
import { useActiveDbState } from '../../../../../store/hooks';

type judeRedeemInMempoolPageProps = {
  state: SwapStatejudeRedeemInMempool;
};

export default function judeRedeemInMempoolPage({
  state,
}: judeRedeemInMempoolPageProps) {
  const explorerUrl = getjudeTxExplorerUrl(
    state.bobjudeRedeemTxId,
    isTestnet()
  );
  const judeAmount = useActiveDbState()?.state.Bob.ExecutionSetupDone.state2.jude;
  const additionalText = judeAmount
    ? `This transaction transfers ${pionerosTojude(judeAmount).toFixed(
        6
      )} jude to ${state.bobjudeRedeemAddress}`
    : null;

  return (
    <Box>
      <DialogContentText>
        The judej has been sent to your redeem address. You may exit the
        application now.
      </DialogContentText>
      <TransactionInfoBox
        title="jude Redeem Transaction"
        explorerUrl={explorerUrl}
        icon={<judeIcon />}
        txId={state.bobjudeRedeemTxId}
        additionalText={additionalText}
        loading={false}
      />
    </Box>
  );
}
