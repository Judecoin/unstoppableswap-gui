import {
  DbState,
  DbStatePathType,
  DbStateType,
  getTypeOfDbState,
  getTypeOfPathDbState,
  isBtcCancelledDbState,
  isBtcLockedDbState,
  isBtcRedeemedDbState,
  isCancelTimelockExpiredDbState,
  isDoneBtcPunishedDbState,
  isDoneBtcRefundedDbState,
  isDonejudeRedeemedDbState,
  isEncSigSentDbState,
  isExecutionSetupDoneDbState,
  isMergedBtcCancelledDbState,
  isMergedBtcLockedDbState,
  isMergedBtcRedeemedDbState,
  isMergedCancelTimelockExpiredDbState,
  isMergedDoneBtcPunishedDbState,
  isMergedDoneBtcRefundedDbState,
  isMergedDonejudeRedeemedDbState,
  isMergedEncSigSentDbState,
  isMergedExecutionSetupDoneDbState,
  isMergedjudeLockedDbState,
  isMergedjudeLockProofReceivedDbState,
  isjudeLockedDbState,
  isjudeLockProofReceivedDbState,
  MergedDbState,
} from '../../models/databaseModel';
import {
  mergedBtcCancelled,
  mergedBtcLockedState,
  mergedBtcPunished,
  mergedBtcRedeemedState,
  mergedBtcRefunded,
  mergedEncSigSentState,
  mergedExecutionSetupDoneState,
  mergedTimelockExpiredState,
  mergedjudeLockedState,
  mergedjudeLockProofReceivedState,
  mergedjudeRedeemedState,
} from '../__utils__/mock_db_states';
import encSigSentState from '../mock_db_states/db_state_enc_sig_sent.json';
import executionSetupDoneState from '../mock_db_states/db_state_execution_setup_done.json';
import btcLockedState from '../mock_db_states/db_state_btc_locked.json';
import judeLockProofReceivedState from '../mock_db_states/db_state_jude_lock_proof_received.json';
import judeLockedState from '../mock_db_states/db_state_jude_locked.json';
import btcRedeemedState from '../mock_db_states/db_state_btc_redeemed.json';
import donejudeRedeemedState from '../mock_db_states/db_state_done_jude_redeemed.json';
import cancelTimelockExpiredState from '../mock_db_states/db_state_cancel_timelock_expired.json';
import btcCancelledState from '../mock_db_states/db_state_btc_cancelled.json';
import doneBtcRefunded from '../mock_db_states/db_state_done_btc_refunded.json';
import doneBtcPunished from '../mock_db_states/db_state_done_btc_punished.json';

const singleStatesTypesAndTypeGuards: [
  state: DbState,
  type: DbStateType,
  typeGuardFunc: (state: DbState) => boolean
][] = [
  [
    executionSetupDoneState,
    DbStateType.EXECUTION_SETUP_DONE,
    isExecutionSetupDoneDbState,
  ],
  [btcLockedState, DbStateType.BTC_LOCKED, isBtcLockedDbState],
  [
    judeLockProofReceivedState,
    DbStateType.jude_LOCK_PROOF_RECEIVED,
    isjudeLockProofReceivedDbState,
  ],
  [judeLockedState, DbStateType.jude_LOCKED, isjudeLockedDbState],
  [encSigSentState, DbStateType.ENC_SIG_SENT, isEncSigSentDbState],
  [btcRedeemedState, DbStateType.BTC_REDEEMED, isBtcRedeemedDbState],
  [
    donejudeRedeemedState,
    DbStateType.DONE_jude_REDEEMED,
    isDonejudeRedeemedDbState,
  ],
  [
    cancelTimelockExpiredState,
    DbStateType.CANCEL_TIMELOCK_EXPIRED,
    isCancelTimelockExpiredDbState,
  ],
  [btcCancelledState, DbStateType.BTC_CANCELLED, isBtcCancelledDbState],
  [doneBtcRefunded, DbStateType.DONE_BTC_REFUNDED, isDoneBtcRefundedDbState],
  [doneBtcPunished, DbStateType.DONE_BTC_PUNISHED, isDoneBtcPunishedDbState],
];

const mergedStatesAndTypeGuards: [
  state: MergedDbState,
  path: DbStatePathType,
  typeGuardFunc: (state: MergedDbState) => boolean
][] = [
  [
    mergedExecutionSetupDoneState,
    DbStatePathType.HAPPY_PATH,
    isMergedExecutionSetupDoneDbState,
  ],
  [mergedBtcLockedState, DbStatePathType.HAPPY_PATH, isMergedBtcLockedDbState],
  [
    mergedjudeLockProofReceivedState,
    DbStatePathType.HAPPY_PATH,
    isMergedjudeLockProofReceivedDbState,
  ],
  [mergedjudeLockedState, DbStatePathType.HAPPY_PATH, isMergedjudeLockedDbState],
  [
    mergedEncSigSentState,
    DbStatePathType.HAPPY_PATH,
    isMergedEncSigSentDbState,
  ],
  [
    mergedBtcRedeemedState,
    DbStatePathType.HAPPY_PATH,
    isMergedBtcRedeemedDbState,
  ],
  [
    mergedjudeRedeemedState,
    DbStatePathType.HAPPY_PATH,
    isMergedDonejudeRedeemedDbState,
  ],
  [
    mergedTimelockExpiredState,
    DbStatePathType.UNHAPPY_PATH,
    isMergedCancelTimelockExpiredDbState,
  ],
  [
    mergedBtcCancelled,
    DbStatePathType.UNHAPPY_PATH,
    isMergedBtcCancelledDbState,
  ],
  [
    mergedBtcRefunded,
    DbStatePathType.UNHAPPY_PATH,
    isMergedDoneBtcRefundedDbState,
  ],
  [
    mergedBtcPunished,
    DbStatePathType.UNHAPPY_PATH,
    isMergedDoneBtcPunishedDbState,
  ],
];

describe('should correctly assess type guards and type of db state for single states', () => {
  test.each(singleStatesTypesAndTypeGuards)(
    `%o`,
    (state, type, typeGuardFunc) => {
      singleStatesTypesAndTypeGuards.forEach(([s]) => {
        expect(typeGuardFunc(s)).toBe(s === state);
      });
      singleStatesTypesAndTypeGuards.forEach(([s]) => {
        expect(getTypeOfDbState(s) === type).toBe(s === state);
      });

      expect.assertions(singleStatesTypesAndTypeGuards.length * 2);
    }
  );
});

describe('should correctly assess type guards for merged states', () => {
  test.each(mergedStatesAndTypeGuards)(
    `%o`,
    (state, pathType, typeGuardFunc) => {
      mergedStatesAndTypeGuards.forEach(([s]) => {
        expect(typeGuardFunc(s)).toBe(s === state);
      });

      expect(getTypeOfPathDbState(state)).toBe(pathType);

      expect.assertions(mergedStatesAndTypeGuards.length + 1);
    }
  );
});

test('same amount of merged and single stats', () => {
  expect(singleStatesTypesAndTypeGuards.length).toBe(
    mergedStatesAndTypeGuards.length
  );
});
