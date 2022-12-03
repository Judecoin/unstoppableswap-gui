export interface SwapLog {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN';
  fields: {
    message: string;
    [index: string]: unknown;
  };
}

export interface SwapLogReceivedQuote extends SwapLog {
  fields: {
    message: 'Received quote';
    price: string;
    minimum_amount: string;
    maximum_amount: string;
  };
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

export interface SwapLogReceivedBtc extends SwapLog {
  fields: {
    message: 'Received Bitcoin';
    max_giveable: string;
    new_balance: string;
  };
}

export interface SwapLogStartedSwap extends SwapLog {
  fields: {
    message: 'Starting new swap';
    amount: string;
    fees: string;
    swap_id: string;
  };
}

export interface SwapLogPublishedBtcTx extends SwapLog {
  fields: {
    message: 'Published Bitcoin transaction';
    txid: string;
    kind: 'lock' | 'cancel' | 'withdraw';
  };
}

export interface SwapLogBtcTxStatusChanged extends SwapLog {
  fields: {
    message: 'Bitcoin transaction status changed';
    txid: string;
    new_status: string;
  };
}

export interface SwapLogAliceLockedJude extends SwapLog {
  fields: {
    message: 'Alice locked Jude';
    txid: string;
  };
}

export interface SwapLogReceivedJudeLockTxConfirmation extends SwapLog {
  fields: {
    message: 'Received new confirmation for Jude lock tx';
    txid: string;
    seen_confirmations: string;
    needed_confirmations: string;
  };
}

export interface SwapLogRedeemedJude extends SwapLog {
  fields: {
    message: 'Successfully transferred Jude to wallet';
    jude_receive_address: string;
    txid: string;
  };
}
