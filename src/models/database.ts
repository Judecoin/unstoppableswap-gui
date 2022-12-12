export interface EncapsulatedDbState {
  swap_id: string;
  state: AnyDbState;
}

export type AnyDbState =
  | ExecutionSetupDoneDbState
  | BtcLockedDbState
  | judeLockProofReceivedDbState
  | judeLockedDbState
  | EncSigSentDbState
  | DonejudeRedeemedDbState
  | BtcCancelledDbState;

interface BaseDbState {
  swap_id: string;
  entered_at: string;
}

export interface ExecutionSetupDoneDbState extends BaseDbState {
  Bob: {
    ExecutionSetupDone: {
      state2: {
        jude: number;
        cancel_timelock: number;
        punish_timelock: number;
        refund_address: string;
        redeem_address: string;
        punish_address: string;
        min_jude_confirmations: number;
        tx_redeem_fee: number;
        tx_punish_fee: number;
        tx_refund_fee: number;
        tx_cancel_fee: number;
      };
    };
  };
}

export interface BtcLockedDbState {
  Bob: {
    BtcLocked: {
      state3: DbState3;
    };
  };
}

export interface judeLockProofReceivedDbState {
  Bob: {
    judeLockProofReceived: {
      state: DbState3;
      jude_wallet_restore_blockheight: {
        height: number;
      };
    };
  };
}

export interface judeLockedDbState {
  Bob: {
    judeLocked: {
      state4: DbState4;
    };
  };
}

export interface EncSigSentDbState {
  Bob: {
    EncSigSent: {
      state4: DbState4;
    };
  };
}

export interface BtcRedeemedDbState {
  Bob: {
    BtcRedeemed: DbState5;
  };
}

export interface DonejudeRedeemedDbState {
  Bob: {
    Done: {
      judeRedeemed: {
        tx_lock_id: string;
      };
    };
  };
}

export interface CancelTimelockExpiredDbState {
  Bob: {
    CancelTimelockExpired: DbState6;
  };
}

export interface BtcCancelledDbState {
  Bob: {
    BtcCancelled: DbState6;
  };
}

export interface DoneBtcRefundedDbState {
  Bob: {
    Done: {
      BtcRefunded: DbState6;
    };
  };
}

export interface DoneBtcPunishedDbState {
  Bob: {
    Done: {
      BtcPunished: {
        tx_lock_id: string;
      };
    };
  };
}

export interface DbState3 {
  jude: number;
  cancel_timelock: number;
  punish_timelock: number;
  refund_address: string;
  redeem_address: string;
  min_jude_confirmations: number;
  tx_redeem_fee: number;
  tx_refund_fee: number;
  tx_cancel_fee: number;
}

export interface DbState4 {
  cancel_timelock: number;
  punish_timelock: number;
  refund_address: string;
  redeem_address: string;
  jude_wallet_restore_blockheight: {
    height: number;
  };
  tx_redeem_fee: number;
  tx_refund_fee: number;
  tx_cancel_fee: number;
}

export interface DbState5 {
  jude_wallet_restore_blockheight: {
    height: number;
  };
}

export interface DbState6 {
  cancel_timelock: number;
  punish_timelock: number;
  refund_address: string;
  tx_refund_fee: number;
  tx_cancel_fee: number;
}
