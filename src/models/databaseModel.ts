import { satsToBtc, pionerosTojude } from '../utils/currencyUtils';
import { TxLock } from './bitcoinModel';
import { Provider } from './storeModel';

export interface DbState {
  Bob: {
    [stateName: string]: unknown;
  };
}

export interface DbStateDone extends DbState {
  Bob: {
    Done: {
      [stateName: string]: unknown;
    };
  };
}

export function getTypeOfDbState(dbState: DbState): DbStateType {
  let [firstKey] = Object.keys(dbState.Bob);
  if (firstKey === 'Done') {
    [firstKey] = Object.keys((dbState as DbStateDone).Bob.Done);
  }

  return firstKey as DbStateType;
}

export interface ExecutionSetupDoneDbState extends DbState {
  Bob: {
    ExecutionSetupDone: {
      state2: {
        jude: number;
        cancel_timelock: number;
        punish_timelock: number;
        refund_address: string;
        redeem_address: string;
        punish_address: string;
        tx_lock: TxLock;
        min_jude_confirmations: number;
        tx_redeem_fee: number;
        tx_punish_fee: number;
        tx_refund_fee: number;
        tx_cancel_fee: number;
      };
    };
  };
}

export function isExecutionSetupDoneDbState(
  dbState: DbState
): dbState is ExecutionSetupDoneDbState {
  return 'ExecutionSetupDone' in dbState.Bob;
}

export interface BtcLockedDbState extends DbState {
  Bob: {
    BtcLocked: {
      state3: DbState3;
    };
  };
}

export function isBtcLockedDbState(
  dbState: DbState
): dbState is BtcLockedDbState {
  return 'BtcLocked' in dbState.Bob;
}

export interface judeLockProofReceivedDbState extends DbState {
  Bob: {
    judeLockProofReceived: {
      state: DbState3;
      jude_wallet_restore_blockheight: {
        height: number;
      };
    };
  };
}

export function isjudeLockProofReceivedDbState(
  dbState: DbState
): dbState is judeLockProofReceivedDbState {
  return 'judeLockProofReceived' in dbState.Bob;
}

export interface judeLockedDbState extends DbState {
  Bob: {
    judeLocked: {
      state4: DbState4;
    };
  };
}

export function isjudeLockedDbState(
  dbState: DbState
): dbState is judeLockedDbState {
  return 'judeLocked' in dbState.Bob;
}

export interface EncSigSentDbState extends DbState {
  Bob: {
    EncSigSent: {
      state4: DbState4;
    };
  };
}

export function isEncSigSentDbState(
  dbState: DbState
): dbState is EncSigSentDbState {
  return 'EncSigSent' in dbState.Bob;
}

export interface BtcRedeemedDbState extends DbState {
  Bob: {
    BtcRedeemed: DbState5;
  };
}

export function isBtcRedeemedDbState(
  dbState: DbState
): dbState is BtcRedeemedDbState {
  return 'BtcRedeemed' in dbState.Bob;
}

export interface DonejudeRedeemedDbState extends DbStateDone {
  Bob: {
    Done: {
      judeRedeemed: {
        tx_lock_id: string;
      };
    };
  };
}

export function isDonejudeRedeemedDbState(
  dbState: DbState
): dbState is DonejudeRedeemedDbState {
  return (
    'Done' in dbState.Bob && 'judeRedeemed' in (dbState as DbStateDone).Bob.Done
  );
}

export interface CancelTimelockExpiredDbState extends DbState {
  Bob: {
    CancelTimelockExpired: DbState6;
  };
}

export function isCancelTimelockExpiredDbState(
  dbState: DbState
): dbState is CancelTimelockExpiredDbState {
  return 'CancelTimelockExpired' in dbState.Bob;
}

export interface BtcCancelledDbState extends DbState {
  Bob: {
    BtcCancelled: DbState6;
  };
}

export function isBtcCancelledDbState(
  dbState: DbState
): dbState is BtcCancelledDbState {
  return 'BtcCancelled' in dbState.Bob;
}

export interface DoneBtcRefundedDbState extends DbStateDone {
  Bob: {
    Done: {
      BtcRefunded: DbState6;
    };
  };
}

export function isDoneBtcRefundedDbState(
  dbState: DbState
): dbState is DoneBtcRefundedDbState {
  return (
    'Done' in dbState.Bob && 'BtcRefunded' in (dbState as DbStateDone).Bob.Done
  );
}

export interface DoneBtcPunishedDbState extends DbStateDone {
  Bob: {
    Done: {
      BtcPunished: {
        tx_lock_id: string;
      };
    };
  };
}

export function isDoneBtcPunishedDbState(
  dbState: DbState
): dbState is DoneBtcPunishedDbState {
  return (
    'Done' in dbState.Bob && 'BtcPunished' in (dbState as DbStateDone).Bob.Done
  );
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
  tx_lock: TxLock;
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
  tx_lock: TxLock;
}

export interface DbState5 {
  jude_wallet_restore_blockheight: {
    height: number;
  };
  tx_lock: TxLock;
}

export interface DbState6 {
  cancel_timelock: number;
  punish_timelock: number;
  refund_address: string;
  tx_refund_fee: number;
  tx_cancel_fee: number;
  tx_lock: TxLock;
}

export enum DbStateType {
  EXECUTION_SETUP_DONE = 'ExecutionSetupDone',
  BTC_LOCKED = 'BtcLocked',
  jude_LOCK_PROOF_RECEIVED = 'judeLockProofReceived',
  jude_LOCKED = 'judeLocked',
  ENC_SIG_SENT = 'EncSigSent',
  BTC_REDEEMED = 'BtcRedeemed',
  DONE_jude_REDEEMED = 'judeRedeemed',
  CANCEL_TIMELOCK_EXPIRED = 'CancelTimelockExpired',
  BTC_CANCELLED = 'BtcCancelled',
  DONE_BTC_REFUNDED = 'BtcRefunded',
  DONE_BTC_PUNISHED = 'BtcPunished',
}

export enum DbStatePathType {
  HAPPY_PATH = 'happy path',
  UNHAPPY_PATH = 'unhappy path',
}

export interface MergedDbState {
  swapId: string;
  type: DbStateType;
  state: ExecutionSetupDoneDbState; // Only ExecutionSetupDone states or more are saved
  provider: Provider;
}

export interface MergedExecutionSetupDoneDbState extends MergedDbState {
  type: DbStateType.EXECUTION_SETUP_DONE;
  state: ExecutionSetupDoneDbState;
}

export function isMergedExecutionSetupDoneDbState(
  dbState: MergedDbState
): dbState is MergedExecutionSetupDoneDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    dbState.type === DbStateType.EXECUTION_SETUP_DONE
  );
}

export interface MergedBtcLockedDbState extends MergedDbState {
  type: DbStateType.BTC_LOCKED;
  state: ExecutionSetupDoneDbState & BtcLockedDbState;
}

export function isMergedBtcLockedDbState(
  dbState: MergedDbState
): dbState is MergedBtcLockedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    dbState.type === DbStateType.BTC_LOCKED
  );
}

export interface MergedjudeLockProofReceivedDbState extends MergedDbState {
  type: DbStateType.jude_LOCK_PROOF_RECEIVED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    judeLockProofReceivedDbState;
}

export function isMergedjudeLockProofReceivedDbState(
  dbState: MergedDbState
): dbState is MergedjudeLockProofReceivedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isjudeLockProofReceivedDbState(dbState.state) &&
    dbState.type === DbStateType.jude_LOCK_PROOF_RECEIVED
  );
}

export interface MergedjudeLockedDbState extends MergedDbState {
  type: DbStateType.jude_LOCKED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    judeLockProofReceivedDbState &
    judeLockedDbState;
}

export function isMergedjudeLockedDbState(
  dbState: MergedDbState
): dbState is MergedjudeLockedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isjudeLockProofReceivedDbState(dbState.state) &&
    isjudeLockedDbState(dbState.state) &&
    dbState.type === DbStateType.jude_LOCKED
  );
}

export interface MergedEncSigSentDbState extends MergedDbState {
  type: DbStateType.ENC_SIG_SENT;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    judeLockProofReceivedDbState &
    judeLockedDbState &
    EncSigSentDbState;
}

export function isMergedEncSigSentDbState(
  dbState: MergedDbState
): dbState is MergedEncSigSentDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isjudeLockProofReceivedDbState(dbState.state) &&
    isjudeLockedDbState(dbState.state) &&
    isEncSigSentDbState(dbState.state) &&
    dbState.type === DbStateType.ENC_SIG_SENT
  );
}

export interface MergedBtcRedeemedDbState extends MergedDbState {
  type: DbStateType.BTC_REDEEMED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    judeLockProofReceivedDbState &
    judeLockedDbState &
    EncSigSentDbState &
    BtcRedeemedDbState;
}

export function isMergedBtcRedeemedDbState(
  dbState: MergedDbState
): dbState is MergedBtcRedeemedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isjudeLockProofReceivedDbState(dbState.state) &&
    isjudeLockedDbState(dbState.state) &&
    isEncSigSentDbState(dbState.state) &&
    isBtcRedeemedDbState(dbState.state) &&
    dbState.type === DbStateType.BTC_REDEEMED
  );
}

export interface MergedDonejudeRedeemedDbState extends MergedDbState {
  type: DbStateType.DONE_jude_REDEEMED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    judeLockProofReceivedDbState &
    judeLockedDbState &
    EncSigSentDbState &
    BtcRedeemedDbState &
    DonejudeRedeemedDbState;
}

export function isMergedDonejudeRedeemedDbState(
  dbState: MergedDbState
): dbState is MergedDonejudeRedeemedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isjudeLockProofReceivedDbState(dbState.state) &&
    isjudeLockedDbState(dbState.state) &&
    isEncSigSentDbState(dbState.state) &&
    isBtcRedeemedDbState(dbState.state) &&
    isDonejudeRedeemedDbState(dbState.state) &&
    dbState.type === DbStateType.DONE_jude_REDEEMED
  );
}

export interface MergedCancelTimelockExpiredDbState extends MergedDbState {
  type: DbStateType.CANCEL_TIMELOCK_EXPIRED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    CancelTimelockExpiredDbState;
}

export function isMergedCancelTimelockExpiredDbState(
  dbState: MergedDbState
): dbState is MergedCancelTimelockExpiredDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isCancelTimelockExpiredDbState(dbState.state) &&
    dbState.type === DbStateType.CANCEL_TIMELOCK_EXPIRED
  );
}

export interface MergedBtcCancelledDbState extends MergedDbState {
  type: DbStateType.BTC_CANCELLED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    CancelTimelockExpiredDbState &
    BtcCancelledDbState;
}

export function isMergedBtcCancelledDbState(
  dbState: MergedDbState
): dbState is MergedBtcCancelledDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isCancelTimelockExpiredDbState(dbState.state) &&
    isBtcCancelledDbState(dbState.state) &&
    dbState.type === DbStateType.BTC_CANCELLED
  );
}

export interface MergedDoneBtcRefundedDbState extends MergedDbState {
  type: DbStateType.DONE_BTC_REFUNDED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    CancelTimelockExpiredDbState &
    BtcCancelledDbState &
    DoneBtcRefundedDbState;
}

export function isMergedDoneBtcRefundedDbState(
  dbState: MergedDbState
): dbState is MergedDoneBtcRefundedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isCancelTimelockExpiredDbState(dbState.state) &&
    isBtcCancelledDbState(dbState.state) &&
    isDoneBtcRefundedDbState(dbState.state) &&
    dbState.type === DbStateType.DONE_BTC_REFUNDED
  );
}

export interface MergedDoneBtcPunishedDbState extends MergedDbState {
  type: DbStateType.DONE_BTC_PUNISHED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    CancelTimelockExpiredDbState &
    BtcCancelledDbState &
    DoneBtcPunishedDbState;
}

export function isMergedDoneBtcPunishedDbState(
  dbState: MergedDbState
): dbState is MergedDoneBtcPunishedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isCancelTimelockExpiredDbState(dbState.state) &&
    isBtcCancelledDbState(dbState.state) &&
    isDoneBtcPunishedDbState(dbState.state) &&
    dbState.type === DbStateType.DONE_BTC_PUNISHED
  );
}

export function getSwapTxFees(dbState: MergedDbState): number {
  const tx = dbState.state.Bob.ExecutionSetupDone.state2.tx_lock;

  const sumInput = tx.inner.inputs
    .map((input) => input.witness_utxo.value)
    .reduce((prev, next) => prev + next);

  const sumOutput = tx.inner.global.unsigned_tx.output
    .map((output) => output.value)
    .reduce((prev, next) => prev + next);

  return satsToBtc(sumInput - sumOutput);
}

export function getSwapBtcAmount(dbState: MergedDbState): number {
  return satsToBtc(
    dbState.state.Bob.ExecutionSetupDone.state2.tx_lock.inner.global.unsigned_tx
      .output[0]?.value
  );
}

export function getSwapjudeAmount(dbState: MergedDbState): number {
  return pionerosTojude(dbState.state.Bob.ExecutionSetupDone.state2.jude);
}

export function getSwapExchangeRate(dbState: MergedDbState): number {
  const btcAmount = getSwapBtcAmount(dbState);
  const judeAmount = getSwapjudeAmount(dbState);

  return btcAmount / judeAmount;
}

export function isSwapResumable(dbState: MergedDbState): boolean {
  return true;
  return (
    isMergedExecutionSetupDoneDbState(dbState) ||
    isMergedBtcLockedDbState(dbState) ||
    isMergedjudeLockProofReceivedDbState(dbState) ||
    isMergedjudeLockedDbState(dbState) ||
    isMergedEncSigSentDbState(dbState) ||
    isMergedBtcRedeemedDbState(dbState)
  );
}

export function isSwapCancellable(dbState: MergedDbState): boolean {
  return (
    isBtcLockedDbState(dbState.state) &&
    !isBtcRedeemedDbState(dbState.state) &&
    !isBtcCancelledDbState(dbState.state)
  );
}

export function isSwapRefundable(dbState: MergedDbState): boolean {
  return (
    isBtcLockedDbState(dbState.state) &&
    isBtcCancelledDbState(dbState.state) &&
    !isDoneBtcRefundedDbState(dbState.state) &&
    !isDoneBtcPunishedDbState(dbState.state)
  );
}

export function isHappyPathSwap(dbState: MergedDbState): boolean {
  return (
    isMergedExecutionSetupDoneDbState(dbState) ||
    isMergedBtcLockedDbState(dbState) ||
    isMergedjudeLockProofReceivedDbState(dbState) ||
    isMergedjudeLockedDbState(dbState) ||
    isMergedEncSigSentDbState(dbState) ||
    isMergedBtcRedeemedDbState(dbState) ||
    isMergedDonejudeRedeemedDbState(dbState)
  );
}

export function isUnhappyPathSwap(dbState: MergedDbState): boolean {
  return (
    isMergedCancelTimelockExpiredDbState(dbState) ||
    isMergedBtcCancelledDbState(dbState) ||
    isMergedDoneBtcRefundedDbState(dbState) ||
    isMergedDoneBtcPunishedDbState(dbState)
  );
}

export function getTypeOfPathDbState(dbState: MergedDbState): DbStatePathType {
  if (isHappyPathSwap(dbState)) {
    return DbStatePathType.HAPPY_PATH;
  }
  if (isUnhappyPathSwap(dbState)) {
    return DbStatePathType.UNHAPPY_PATH;
  }
  console.error('Unknown path type. Assumung happy path. DbState:', dbState);
  return DbStatePathType.HAPPY_PATH;
}
