export function getBitcoinTxExplorerUrl(txid: string, testnet: boolean) {
  return `https://blockchair.com/bitcoin${
    testnet ? '/testnet' : ''
  }/transaction/${txid}`;
}

export function getjudeTxExplorerUrl(txid: string, stagenet: boolean) {
  if (stagenet) {
    return `https://stagenet.judechain.net/tx/${txid}`;
  }
  return `https://judechain.net/tx/${txid}`;
}
