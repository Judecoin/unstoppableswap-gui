import { isTestnet } from 'store/config';
import { getJudeTxExplorerUrl } from 'utils/conversionUtils';
import JudeIcon from 'renderer/components/icons/JudeIcon';
import { ReactNode } from 'react';
import TransactionInfoBox from './TransactionInfoBox';

type Props = {
  title: string;
  txId: string;
  additionalContent: ReactNode;
  loading: boolean;
};

export default function JudeTransactionInfoBox({ txId, ...props }: Props) {
  const explorerUrl = getJudeTxExplorerUrl(txId, isTestnet());

  return (
    <TransactionInfoBox
      txId={txId}
      explorerUrl={explorerUrl}
      icon={<JudeIcon />}
      {...props}
    />
  );
}
