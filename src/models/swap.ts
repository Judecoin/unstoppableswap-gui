export interface SwapLog {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN';
  fields: {
    message: string;
    [index: string]: unknown;
  };
}

export function isSwapLog(log: any): log is SwapLog {
  return (
    'timestamp' in log &&
    'level' in log &&
    'fields' in log &&
    typeof log.fields?.message === 'string'
  );
}

export interface SwapLogReceivedQuote extends SwapLog {
  fields: {
    message: 'Received quote';
    price: string;
    minimum_amount: string;
    maximum_amount: string;
  };
}

export function isSwapLogReceivedQuote(
  log: SwapLog
): log is SwapLogReceivedQuote {
  return log.fields.message === 'Received quote';
}

export interface SwapLogWaitingForBtcDeposit extends SwapLog {
  fields: {
    message: 'Waiting for Bitcoin deposit';
    deposit_address: string;
    max_giveable: string;
    minimum_amount: string;
    maximum_amount: string;
  };
}

export function isSwapLogWaitingForBtcDeposit(
  log: SwapLog
): log is SwapLogWaitingForBtcDeposit {
  return log.fields.message === 'Waiting for Bitcoin deposit';
}

export interface SwapLogReceivedBtc extends SwapLog {
  fields: {
    message: 'Received Bitcoin';
    max_giveable: string;
    new_balance: string;
  };
}

export function isSwapLogReceivedBtc(log: SwapLog): log is SwapLogReceivedBtc {
  return log.fields.message === 'Received Bitcoin';
}

export interface SwapLogStartedSwap extends SwapLog {
  fields: {
    message: 'Starting new swap';
    swap_id: string;
  };
}

export function isSwapLogStartedSwap(log: SwapLog): log is SwapLogStartedSwap {
  return log.fields.message === 'Starting new swap';
}

export interface SwapLogPublishedBtcTx extends SwapLog {
  fields: {
    message: 'Published Bitcoin transaction';
    txid: string;
    kind: 'lock' | 'cancel' | 'withdraw';
  };
}

export function isSwapLogPublishedBtcTx(
  log: SwapLog
): log is SwapLogPublishedBtcTx {
  return log.fields.message === 'Published Bitcoin transaction';
}

export interface SwapLogBtcTxStatusChanged extends SwapLog {
  fields: {
    message: 'Bitcoin transaction status changed';
    txid: string;
    new_status: string;
  };
}

export function isSwapLogBtcTxStatusChanged(
  log: SwapLog
): log is SwapLogBtcTxStatusChanged {
  return log.fields.message === 'Bitcoin transaction status changed';
}

export interface SwapLogAliceLockedjude extends SwapLog {
  fields: {
    message: 'Alice locked jude';
    txid: string;
  };
}

export function isSwapLogAliceLockedjude(
  log: SwapLog
): log is SwapLogAliceLockedjude {
  return log.fields.message === 'Alice locked jude';
}

export interface SwapLogReceivedjudeLockTxConfirmation extends SwapLog {
  fields: {
    message: 'Received new confirmation for jude lock tx';
    txid: string;
    seen_confirmations: string;
    needed_confirmations: string;
  };
}

export function isSwapLogReceivedjudeLockTxConfirmation(
  log: SwapLog
): log is SwapLogReceivedjudeLockTxConfirmation {
  return log.fields.message === 'Received new confirmation for jude lock tx';
}

export interface SwapLogRedeemedjude extends SwapLog {
  fields: {
    message: 'Successfully transferred jude to wallet';
    jude_receive_address: string;
    txid: string;
  };
}

export function isSwapLogRedeemedjude(log: SwapLog): log is SwapLogRedeemedjude {
  return log.fields.message === 'Successfully transferred jude to wallet';
}
