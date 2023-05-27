import { merge } from 'lodash';
import {
  MergedExecutionSetupDoneDbState,
  DbStateType,
  MergedBtcLockedDbState,
  MergedjudeLockProofReceivedDbState,
  MergedjudeLockedDbState,
  MergedEncSigSentDbState,
  MergedBtcRedeemedDbState,
  MergedDonejudeRedeemedDbState,
  MergedCancelTimelockExpiredDbState,
  MergedBtcCancelledDbState,
  MergedDoneBtcRefundedDbState,
  MergedDoneBtcPunishedDbState,
} from '../../models/databaseModel';
import { Provider } from '../../models/storeModel';

import executionSetupDoneState from '../mock_db_states/db_state_execution_setup_done.json';
import btcLockedState from '../mock_db_states/db_state_btc_locked.json';
import judeLockProofReceivedState from '../mock_db_states/db_state_jude_lock_proof_received.json';
import judeLockedState from '../mock_db_states/db_state_jude_locked.json';
import encSigSentState from '../mock_db_states/db_state_enc_sig_sent.json';
import btcRedeemedState from '../mock_db_states/db_state_btc_redeemed.json';
import donejudeRedeemedState from '../mock_db_states/db_state_done_jude_redeemed.json';
import cancelTimelockExpiredState from '../mock_db_states/db_state_cancel_timelock_expired.json';
import btcCancelledState from '../mock_db_states/db_state_btc_cancelled.json';
import doneBtcRefunded from '../mock_db_states/db_state_done_btc_refunded.json';
import doneBtcPunished from '../mock_db_states/db_state_done_btc_punished.json';

export const exampleSwapId = '15de9d95-a1f8-45e8-98a7-5327b940fc41';
export const exampleProvider: Provider = {
  multiAddr: '/dnsaddr/jude.example',
  peerId: '32394294389438924',
  testnet: false,
};

export const mergedExecutionSetupDoneState: MergedExecutionSetupDoneDbState = {
  swapId: exampleSwapId,
  type: DbStateType.EXECUTION_SETUP_DONE,
  state: merge({}, executionSetupDoneState),
  provider: exampleProvider,
};

export const mergedBtcLockedState: MergedBtcLockedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.BTC_LOCKED,
  state: merge({}, executionSetupDoneState, btcLockedState),
  provider: exampleProvider,
};

export const mergedjudeLockProofReceivedState: MergedjudeLockProofReceivedDbState =
  {
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

export const mergedjudeLockedState: MergedjudeLockedDbState = {
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

export const mergedEncSigSentState: MergedEncSigSentDbState = {
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

export const mergedBtcRedeemedState: MergedBtcRedeemedDbState = {
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

export const mergedjudeRedeemedState: MergedDonejudeRedeemedDbState = {
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

export const mergedTimelockExpiredState: MergedCancelTimelockExpiredDbState = {
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

export const mergedBtcCancelled: MergedBtcCancelledDbState = {
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

export const mergedBtcRefunded: MergedDoneBtcRefundedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.DONE_BTC_REFUNDED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    cancelTimelockExpiredState,
    btcCancelledState,
    doneBtcRefunded
  ),
  provider: exampleProvider,
};

export const mergedBtcPunished: MergedDoneBtcPunishedDbState = {
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
