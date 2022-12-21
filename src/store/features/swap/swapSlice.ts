import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BinaryDownloadStatus } from '../../../swap/downloader';
import { extractAmountFromUnitString } from '../../../swap/utils/parse-utils';
import {
  isSwapStateBtcLockInMempool,
  isSwapStateWaitingForBtcDeposit,
  isSwapStatejudeLockInMempool,
  Provider,
  Swap,
  SwapStateBtcLockInMempool,
  SwapStateDownloadingBinary,
  SwapStateInitiated,
  SwapStateProcessExited,
  SwapStateReceivedQuote,
  SwapStateStarted,
  SwapStateType,
  SwapStateWaitingForBtcDeposit,
  SwapStatejudeLockInMempool,
  SwapStatejudeRedeemInMempool,
} from '../../../models/storeModel';
import {
  SwapLog,
  SwapLogAliceLockedjude,
  SwapLogBtcTxStatusChanged,
  SwapLogPublishedBtcTx,
  SwapLogReceivedBtc,
  SwapLogReceivedQuote,
  SwapLogReceivedjudeLockTxConfirmation,
  SwapLogRedeemedjude,
  SwapLogStartedSwap,
  SwapLogWaitingForBtcDeposit,
} from '../../../models/swapModel';

const initialState: Swap = {
  state: null,
  processRunning: false,
  logs: [],
  stdOut: '',
  provider: null,
};

export const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    addLog: (swap, action: PayloadAction<SwapLog>) => {
      swap.logs.push(action.payload);
    },
    appendStdOut: (swap, action: PayloadAction<string>) => {
      swap.stdOut += action.payload;
    },
    resetSwap: () => initialState,
    downloadProgressUpdate: (
      swap,
      action: PayloadAction<BinaryDownloadStatus>
    ) => {
      const nextState: SwapStateDownloadingBinary = {
        type: SwapStateType.DOWNLOADING_BINARY,
        binaryInfo: action.payload.binaryInfo,
        totalDownloadedBytes: action.payload.totalDownloadedBytes,
        contentLengthBytes: action.payload.contentLengthBytes,
      };

      swap.processRunning = false;
      swap.state = nextState;
    },
    initiateSwap: (
      swap,
      action: PayloadAction<{
        provider: Provider;
      }>
    ) => {
      const nextState: SwapStateInitiated = {
        type: SwapStateType.INITIATED,
      };

      swap.processRunning = true;
      swap.state = nextState;
      swap.logs = [];
      swap.provider = action.payload.provider;
    },
    receivedQuoteLog: (swap, action: PayloadAction<SwapLogReceivedQuote>) => {
      const price = extractAmountFromUnitString(action.payload.fields.price);
      const minimumSwapAmount = extractAmountFromUnitString(
        action.payload.fields.minimum_amount
      );
      const maximumSwapAmount = extractAmountFromUnitString(
        action.payload.fields.maximum_amount
      );

      const nextState: SwapStateReceivedQuote = {
        type: SwapStateType.RECEIVED_QUOTE,
        price,
        minimumSwapAmount,
        maximumSwapAmount,
      };

      swap.state = nextState;
    },
    waitingForBtcDepositLog: (
      swap,
      action: PayloadAction<SwapLogWaitingForBtcDeposit>
    ) => {
      const maxGiveable = extractAmountFromUnitString(
        action.payload.fields.max_giveable
      );
      const depositAddress = action.payload.fields.deposit_address;

      const nextState: SwapStateWaitingForBtcDeposit = {
        type: SwapStateType.WAITING_FOR_BTC_DEPOSIT,
        depositAddress,
        maxGiveable,
      };

      swap.state = nextState;
    },
    receivedBtcLog: ({ state }, action: PayloadAction<SwapLogReceivedBtc>) => {
      const maxGiveable = extractAmountFromUnitString(
        action.payload.fields.max_giveable
      );

      if (state && isSwapStateWaitingForBtcDeposit(state)) {
        state.maxGiveable = maxGiveable;
      }
    },
    startingNewSwapLog: (swap, action: PayloadAction<SwapLogStartedSwap>) => {
      const nextState: SwapStateStarted = {
        type: SwapStateType.STARTED,
        id: action.payload.fields.swap_id,
      };

      swap.state = nextState;
    },
    publishedBtcTransactionLog: (
      swap,
      action: PayloadAction<SwapLogPublishedBtcTx>
    ) => {
      if (action.payload.fields.kind === 'lock') {
        const nextState: SwapStateBtcLockInMempool = {
          type: SwapStateType.BTC_LOCK_TX_IN_MEMPOOL,
          bobBtcLockTxId: action.payload.fields.txid,
          bobBtcLockTxConfirmations: 0,
        };

        swap.state = nextState;
      }
    },
    btcTransactionStatusChangedLog: (
      { state },
      action: PayloadAction<SwapLogBtcTxStatusChanged>
    ) => {
      if (isSwapStateBtcLockInMempool(state)) {
        if (state.bobBtcLockTxId === action.payload.fields.txid) {
          const newStatusText = action.payload.fields.new_status;

          if (newStatusText.startsWith('confirmed with')) {
            const confirmations = Number.parseInt(
              newStatusText.split(' ')[2],
              10
            );

            state.bobBtcLockTxConfirmations = confirmations;
          }
        }
      }
    },
    aliceLockedjudeLog: (swap, action: PayloadAction<SwapLogAliceLockedjude>) => {
      const nextState: SwapStatejudeLockInMempool = {
        type: SwapStateType.jude_LOCK_TX_IN_MEMPOOL,
        alicejudeLockTxId: action.payload.fields.txid,
        alicejudeLockTxConfirmations: 0,
      };

      swap.state = nextState;
    },
    judeLockStatusChangedLog: (
      { state },
      action: PayloadAction<SwapLogReceivedjudeLockTxConfirmation>
    ) => {
      if (isSwapStatejudeLockInMempool(state)) {
        if (state.alicejudeLockTxId === action.payload.fields.txid) {
          state.alicejudeLockTxConfirmations = Number.parseInt(
            action.payload.fields.seen_confirmations,
            10
          );
        }
      }
    },
    transferredjudeToWalletLog: (
      swap,
      action: PayloadAction<SwapLogRedeemedjude>
    ) => {
      const nextState: SwapStatejudeRedeemInMempool = {
        type: SwapStateType.jude_REDEEM_IN_MEMPOOL,
        bobjudeRedeemTxId: action.payload.fields.txid,
      };

      swap.state = nextState;
    },
    processExited: (
      swap,
      action: PayloadAction<{
        exitCode: number | null;
        exitSignal: NodeJS.Signals | null;
      }>
    ) => {
      const nextState: SwapStateProcessExited = {
        type: SwapStateType.PROCESS_EXITED,
        exitSignal: action.payload.exitSignal,
        exitCode: action.payload.exitCode,
      };

      swap.state = nextState;
      swap.processRunning = false;
    },
  },
});

export const {
  downloadProgressUpdate,
  receivedQuoteLog,
  startingNewSwapLog,
  waitingForBtcDepositLog,
  initiateSwap,
  processExited,
  publishedBtcTransactionLog,
  btcTransactionStatusChangedLog,
  aliceLockedjudeLog,
  judeLockStatusChangedLog,
  transferredjudeToWalletLog,
  receivedBtcLog,
  addLog,
  resetSwap,
  appendStdOut,
} = swapSlice.actions;

export default swapSlice.reducer;
