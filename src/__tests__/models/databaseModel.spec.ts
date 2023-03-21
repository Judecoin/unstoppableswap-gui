import { merge } from 'lodash';
import {
  DbState,
  DbStateType,
  getTypeOfDbState,
  isBtcCancelledDbState,
  isBtcLockedDbState,
  isBtcRedeemedDbState,
  isCancelTimelockExpiredDbState,
  isDoneBtcPunishedDbState,
  isDonejudeRedeemedDbState,
  isEncSigSentDbState,
  isExecutionSetupDoneDbState,
  isMergedBtcCancelledDbState,
  isMergedBtcLockedDbState,
  isMergedBtcRedeemedDbState,
  isMergedCancelTimelockExpiredDbState,
  isMergedDoneBtcPunishedDbState,
  isMergedDonejudeRedeemedDbState,
  isMergedEncSigSentDbState,
  isMergedExecutionSetupDoneDbState,
  isMergedjudeLockedDbState,
  isMergedjudeLockProofReceivedDbState,
  isjudeLockedDbState,
  isjudeLockProofReceivedDbState,
  MergedBtcCancelledDbState,
  MergedBtcLockedDbState,
  MergedBtcRedeemedDbState,
  MergedCancelTimelockExpiredDbState,
  MergedDbState,
  MergedDoneBtcPunishedDbState,
  MergedDonejudeRedeemedDbState,
  MergedEncSigSentDbState,
  MergedExecutionSetupDoneDbState,
  MergedjudeLockedDbState,
  MergedjudeLockProofReceivedDbState,
} from '../../models/databaseModel';
import { Provider } from '../../models/storeModel';

import encSigSentState from './example_states/enc_sig_sent.json';
import executionSetupDoneState from './example_states/execution_setup_done.json';
import btcLockedState from './example_states/btc_locked.json';
import judeLockProofReceivedState from './example_states/jude_lock_proof_received.json';
import judeLockedState from './example_states/jude_locked.json';
import btcRedeemedState from './example_states/btc_redeemed.json';
import donejudeRedeemedState from './example_states/done_jude_redeemed.json';
import cancelTimelockExpiredState from './example_states/cancel_timelock_expired.json';
import btcCancelledState from './example_states/btc_cancelled.json';
import doneBtcPunished from './example_states/done_btc_punished.json';

/*
TODO!
Add btc refunded case
 */

const allSingleStates = [
  executionSetupDoneState,
  btcLockedState,
  judeLockProofReceivedState,
  judeLockedState,
  encSigSentState,
  btcRedeemedState,
  donejudeRedeemedState,
  btcCancelledState,
  doneBtcPunished,
  cancelTimelockExpiredState,
];

const exampleSwapId = '15de9d95-a1f8-45e8-98a7-5327b940fc41';
const exampleProvider: Provider = {
  multiAddr: '/dnsaddr/jude.example',
  peerId: '32394294389438924',
  testnet: false,
};

const mergedExecutionSetupDoneState: MergedExecutionSetupDoneDbState = {
  swapId: exampleSwapId,
  type: DbStateType.EXECUTION_SETUP_DONE,
  state: merge({}, executionSetupDoneState),
  provider: exampleProvider,
};

const mergedBtcLockedState: MergedBtcLockedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.BTC_LOCKED,
  state: merge({}, executionSetupDoneState, btcLockedState),
  provider: exampleProvider,
};

const mergedjudeLockProofReceivedState: MergedjudeLockProofReceivedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.jude_LOCK_PROOF_RECEIVED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    judeLockProofReceivedState
  ),
  provider: exampleProvider,
};

const mergedjudeLockedState: MergedjudeLockedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.jude_LOCKED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    judeLockProofReceivedState,
    judeLockedState
  ),
  provider: exampleProvider,
};

const mergedEncSigSentState: MergedEncSigSentDbState = {
  swapId: exampleSwapId,
  type: DbStateType.ENC_SIG_SENT,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    judeLockProofReceivedState,
    judeLockedState,
    encSigSentState
  ),
  provider: exampleProvider,
};

const mergedBtcRedeemedState: MergedBtcRedeemedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.BTC_REDEEMED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    judeLockProofReceivedState,
    judeLockedState,
    encSigSentState,
    btcRedeemedState
  ),
  provider: exampleProvider,
};

const mergedjudeRedeemedState: MergedDonejudeRedeemedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.DONE_jude_REDEEMED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    judeLockProofReceivedState,
    judeLockedState,
    encSigSentState,
    btcRedeemedState,
    donejudeRedeemedState
  ),
  provider: exampleProvider,
};

const mergedTimelockExpiredState: MergedCancelTimelockExpiredDbState = {
  swapId: exampleSwapId,
  type: DbStateType.CANCEL_TIMELOCK_EXPIRED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    cancelTimelockExpiredState
  ),
  provider: exampleProvider,
};

const mergedBtcCancelled: MergedBtcCancelledDbState = {
  swapId: exampleSwapId,
  type: DbStateType.BTC_CANCELLED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    cancelTimelockExpiredState,
    btcCancelledState
  ),
  provider: exampleProvider,
};

const mergedBtcPunished: MergedDoneBtcPunishedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.DONE_BTC_PUNISHED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    cancelTimelockExpiredState,
    btcCancelledState,
    doneBtcPunished
  ),
  provider: exampleProvider,
};

const allMergedStates = [
  mergedExecutionSetupDoneState,
  mergedBtcLockedState,
  mergedjudeLockProofReceivedState,
  mergedjudeLockedState,
  mergedEncSigSentState,
  mergedBtcRedeemedState,
  mergedjudeRedeemedState,
  mergedTimelockExpiredState,
  mergedBtcCancelled,
  mergedBtcPunished,
];

/*
TODO!
Add test case for btc refunded

const mergedBtcRefunded: MergedDoneBtcRefundedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.DONE_BTC_REFUNDED,
  state: merge({}, executionSetupDoneState, btcLockedState, btcCancelledState, ),
}; */

test('should correctly get type of state', () => {
  expect(getTypeOfDbState(executionSetupDoneState)).toBe(
    DbStateType.EXECUTION_SETUP_DONE
  );
  expect(getTypeOfDbState(btcLockedState)).toBe(DbStateType.BTC_LOCKED);
  expect(getTypeOfDbState(judeLockProofReceivedState)).toBe(
    DbStateType.jude_LOCK_PROOF_RECEIVED
  );
  expect(getTypeOfDbState(judeLockedState)).toBe(DbStateType.jude_LOCKED);
  expect(getTypeOfDbState(encSigSentState)).toBe(DbStateType.ENC_SIG_SENT);
  expect(getTypeOfDbState(btcRedeemedState)).toBe(DbStateType.BTC_REDEEMED);
  expect(getTypeOfDbState(donejudeRedeemedState)).toBe(
    DbStateType.DONE_jude_REDEEMED
  );
  expect(getTypeOfDbState(cancelTimelockExpiredState)).toBe(
    DbStateType.CANCEL_TIMELOCK_EXPIRED
  );
  expect(getTypeOfDbState(btcCancelledState)).toBe(DbStateType.BTC_CANCELLED);
  expect(getTypeOfDbState(doneBtcPunished)).toBe(DbStateType.DONE_BTC_PUNISHED);

  expect.assertions(allSingleStates.length);
});

describe('should correctly assess type guards for single states', () => {
  const statesAndTypeGuards: [
    state: DbState,
    typeGuardFunc: (state: DbState) => boolean
  ][] = [
    [executionSetupDoneState, isExecutionSetupDoneDbState],
    [btcLockedState, isBtcLockedDbState],
    [judeLockProofReceivedState, isjudeLockProofReceivedDbState],
    [judeLockedState, isjudeLockedDbState],
    [encSigSentState, isEncSigSentDbState],
    [btcRedeemedState, isBtcRedeemedDbState],
    [donejudeRedeemedState, isDonejudeRedeemedDbState],
    [cancelTimelockExpiredState, isCancelTimelockExpiredDbState],
    [btcCancelledState, isBtcCancelledDbState],
    [doneBtcPunished, isDoneBtcPunishedDbState],
  ];

  test.each(statesAndTypeGuards)(`%o`, (state, typeGuardFunc) => {
    allSingleStates.forEach((s) => {
      expect(typeGuardFunc(s)).toBe(s === state);
    });

    expect.assertions(allSingleStates.length);
  });

  test('correct amount of single states', () => {
    expect(statesAndTypeGuards.length).toBe(allSingleStates.length);
    expect(allSingleStates.length).toBe(allMergedStates.length);
  });
});

describe('should correctly assess type guards for encapsulated states', () => {
  const mergedStatesAndTypeGuards: [
    state: MergedDbState,
    typeGuardFunc: (state: MergedDbState) => boolean
  ][] = [
    [mergedExecutionSetupDoneState, isMergedExecutionSetupDoneDbState],
    [mergedBtcLockedState, isMergedBtcLockedDbState],
    [mergedjudeLockProofReceivedState, isMergedjudeLockProofReceivedDbState],
    [mergedjudeLockedState, isMergedjudeLockedDbState],
    [mergedEncSigSentState, isMergedEncSigSentDbState],
    [mergedBtcRedeemedState, isMergedBtcRedeemedDbState],
    [mergedjudeRedeemedState, isMergedDonejudeRedeemedDbState],
    [mergedTimelockExpiredState, isMergedCancelTimelockExpiredDbState],
    [mergedBtcCancelled, isMergedBtcCancelledDbState],
    [mergedBtcPunished, isMergedDoneBtcPunishedDbState],
  ];

  test.each(mergedStatesAndTypeGuards)(`%o`, (state, typeGuardFunc) => {
    allMergedStates.forEach((s) => {
      expect(typeGuardFunc(s)).toBe(s === state);
    });

    expect.assertions(allMergedStates.length);
  });

  test('correct amount of merged states', () => {
    expect(mergedStatesAndTypeGuards.length).toBe(allMergedStates.length);
    expect(allMergedStates.length).toBe(allSingleStates.length);
  });
});
