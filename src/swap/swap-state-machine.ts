// eslint-disable-next-line import/no-cycle
import { Provider } from '../renderer/store';
import { extractAmountFromUnitString } from './utils/parse-utils';
import { BinaryDownloadStatus, BinaryInfo } from './downloader';

export function reduceSwapProcessExit(
  prevState: SwapState,
  exitCode: number | null,
  exitSignal?: NodeJS.Signals | null
): SwapState | null {
  const nextState: SwapStateProcessExited = {
    ...prevState,
    prevState,
    state: 'process excited',
    exitCode,
    exitSignal,
    running: false,
  };

  return nextState;
}

export function reduceBinaryDownloadStatusUpdate({
  totalDownloadedBytes,
  contentLengthBytes,
  binaryInfo,
}: BinaryDownloadStatus): SwapStatePreparingBinary {
  const nextState: SwapStatePreparingBinary = {
    state: 'preparing binary',
    totalDownloadedBytes,
    contentLengthBytes,
    binaryInfo,
    running: false,
  };
  return nextState;
}

function reduceReceivedQuoteLog(
  prevState: SwapState,
  log: SwapLogReceivedQuote
): SwapState {
  const price = extractAmountFromUnitString(log.fields.price);
  const minimumSwapAmount = extractAmountFromUnitString(
    log.fields.minimum_amount
  );
  const maximumSwapAmount = extractAmountFromUnitString(
    log.fields.maximum_amount
  );

  if (prevState.state === 'initiated') {
    const nextState: SwapStateReceivedQuote = {
      ...(prevState as SwapStateInitiated),
      state: 'received quote',
      price,
      minimumSwapAmount,
      maximumSwapAmount,
    };
    return nextState;
  }
  return prevState;
}

function reduceWaitingForDepositLog(
  prevState: SwapState,
  log: SwapLogWaitingForBtcDeposit
): SwapState {
  const maxGiveable = extractAmountFromUnitString(log.fields.max_giveable);
  const depositAddress = log.fields.deposit_address;

  const nextState: SwapStateWaitingForBtcDeposit = {
    ...(prevState as SwapStateReceivedQuote),
    state: 'waiting for btc deposit',
    maxGiveable,
    depositAddress,
  };
  return nextState;
}

function reduceReceivedBitcoinLog(
  prevState: SwapState,
  log: SwapLogReceivedBitcoin
): SwapState {
  const maxGiveable = extractAmountFromUnitString(log.fields.max_giveable);

  if (prevState.state === 'waiting for btc deposit') {
    const nextState: SwapStateWaitingForBtcDeposit = {
      ...(prevState as SwapStateWaitingForBtcDeposit),
      maxGiveable,
    };
    return nextState;
  }
  return prevState;
}

function reduceSwapStartedLog(
  prevState: SwapState,
  log: SwapLogStartedSwap
): SwapState {
  const btcAmount = extractAmountFromUnitString(log.fields.amount);
  const bobBtcLockTxFees = extractAmountFromUnitString(log.fields.fees);
  const id = log.fields.swap_id;

  const nextState: SwapStateStarted = {
    ...(prevState as SwapStateWaitingForBtcDeposit),
    state: 'started',
    btcAmount,
    bobBtcLockTxFees,
    id,
  };
  return nextState;
}

function reducePublishedBtcTx(
  prevState: SwapState,
  log: SwapLogPublishedBtcTx
): SwapState {
  const bobBtcLockTxId = log.fields.txid;

  if (log.fields.kind === 'lock') {
    const nextState: SwapStateBtcLockInMempool = {
      ...(prevState as SwapStateStarted),
      state: 'btc lock tx is in mempool',
      bobBtcLockTxId,
      bobBtcLockTxConfirmations: 0,
    };
    return nextState;
  }
  return prevState;
}

function reduceBtcTxStatusChanged(
  prevState: SwapState,
  log: SwapLogBtcTxStatusChanged
): SwapState {
  if (prevState.state === 'btc lock tx is in mempool') {
    const status = log.fields.new_status;
    const prevBtcLockTxInMempoolState = prevState as SwapStateBtcLockInMempool;

    if (log.fields.txid === prevBtcLockTxInMempoolState.bobBtcLockTxId) {
      if (log.fields.new_status.startsWith('confirmed with')) {
        const bobBtcLockTxConfirmations = Number.parseInt(
          status.split(' ')[2],
          10
        );

        const nextState: SwapStateBtcLockInMempool = {
          ...prevBtcLockTxInMempoolState,
          bobBtcLockTxConfirmations,
        };
        return nextState;
      }
    }
  }

  return prevState;
}

function reduceAliceLockedJude(
  prevState: SwapState,
  log: SwapLogAliceLockedJude
): SwapState {
  const nextState: SwapStateJudeLockInMempool = {
    ...(prevState as SwapStateBtcLockInMempool),
    state: 'jude lock tx is in mempool',
    aliceJudeLockTxId: log.fields.txid,
    aliceJudeLockTxConfirmations: 0,
  };
  return nextState;
}

function reduceJudeLockTxStatusChange(
  prevState: SwapState,
  log: SwapLogReceivedJudeLockTxConfirmation
): SwapState {
  if (prevState.state === 'jude lock tx is in mempool') {
    const aliceJudeLockTxConfirmations = Number.parseInt(
      log.fields.seen_confirmations,
      10
    );

    const nextState: SwapStateJudeLockInMempool = {
      ...(prevState as SwapStateJudeLockInMempool),
      aliceJudeLockTxConfirmations,
    };
    return nextState;
  }
  return prevState;
}

function reduceRedeemedJude(
  prevState: SwapState,
  log: SwapLogRedeemedJude
): SwapState {
  const bobJudeRedeemTxId = log.fields.txid;

  const nextState: SwapStateJudeRedeemInMempool = {
    ...(prevState as SwapStateJudeLockInMempool),
    state: 'jude redeem tx is in mempool',
    bobJudeRedeemTxId,
  };
  return nextState;
}

export function reduceSwapLog(prevState: SwapState, log: SwapLog): SwapState {
  switch (log.fields.message) {
    case 'Received quote':
      return reduceReceivedQuoteLog(prevState, log as SwapLogReceivedQuote);
    case 'Waiting for Bitcoin deposit':
      return reduceWaitingForDepositLog(
        prevState,
        log as SwapLogWaitingForBtcDeposit
      );
    case 'Received Bitcoin':
      return reduceReceivedBitcoinLog(prevState, log as SwapLogReceivedBitcoin);
    case 'Starting new swap':
      return reduceSwapStartedLog(prevState, log as SwapLogStartedSwap);
    case 'Published Bitcoin transaction':
      return reducePublishedBtcTx(prevState, log as SwapLogPublishedBtcTx);
    case 'Bitcoin transaction status changed':
      return reduceBtcTxStatusChanged(
        prevState,
        log as SwapLogBtcTxStatusChanged
      );
    case 'Alice locked Jude':
      return reduceAliceLockedJude(
        prevState,
        log as SwapLogAliceLockedJude
      );
    case 'Received new confirmation for Jude lock tx':
      return reduceJudeLockTxStatusChange(
        prevState,
        log as SwapLogReceivedJudeLockTxConfirmation
      );
    case 'Successfully transferred Jude to wallet':
      return reduceRedeemedJude(prevState, log as SwapLogRedeemedJude);
    default:
      console.error(`Swap log was not reduced Log: ${JSON.stringify(log)}`);
      return prevState;
  }
}

type StateName =
  | 'preparing binary'
  | 'initiated'
  | 'received quote' // Started, SwapStateStarted
  | 'waiting for btc deposit'
  | 'started'
  | 'btc lock tx is in mempool' // SwapSetupCompleted
  | 'btc is locked' // BtcLocked
  | 'jude lock tx is in mempool' // JudeLockProofReceived
  | 'jude is locked' // JudeLocked
  | 'encrypted signature is sent' // EncSigSent
  | 'btc is redeemed' // BtcRedeemed
  | 'cancel timelock is expired' // CancelTimelockExpired
  | 'btc is cancelled' // BtcCancelled
  | 'btc is refunded' // BtcRefunded
  | 'jude redeem tx is in mempool' // JudeRedeemed
  | 'btc is punished' // BtcPunished
  | 'safely aborted' // SafelyAborted
  | 'process excited';

export interface SwapState {
  state: StateName;
  running: boolean;
}

export interface SwapStatePreparingBinary extends SwapState {
  binaryInfo: BinaryInfo;
  totalDownloadedBytes: number;
  contentLengthBytes: number;
}

export interface SwapStateInitiated extends SwapState {
  provider: Provider;
  refundAddress: string;
  redeemAddress: string;
}

export interface SwapStateReceivedQuote extends SwapStateInitiated {
  price: number;
  minimumSwapAmount: number;
  maximumSwapAmount: number;
}

export interface SwapStateWaitingForBtcDeposit extends SwapStateReceivedQuote {
  depositAddress: string;
  maxGiveable: number;
}

export interface SwapStateStarted extends SwapStateReceivedQuote {
  id: string;
  btcAmount: number;
  bobBtcLockTxFees: number;
}

export interface SwapStateBtcLockInMempool extends SwapStateStarted {
  bobBtcLockTxId: string;
  bobBtcLockTxConfirmations: number;
}

export interface SwapStateJudeLockInMempool extends SwapStateBtcLockInMempool {
  aliceJudeLockTxId: string;
  aliceJudeLockTxConfirmations: number;
}

export interface SwapStateJudeRedeemInMempool extends SwapStateJudeLockInMempool {
  bobJudeRedeemTxId: string;
}

export interface SwapStateProcessExited extends SwapState {
  prevState: SwapState;
  exitCode: number | null;
  exitSignal: NodeJS.Signals | null | undefined;
}

export interface SwapLog {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN';
  fields: {
    message: string;
    [index: string]: unknown;
  };
}

interface SwapLogReceivedQuote extends SwapLog {
  fields: {
    message: 'Received quote';
    price: string;
    minimum_amount: string;
    maximum_amount: string;
  };
}

interface SwapLogWaitingForBtcDeposit extends SwapLog {
  fields: {
    message: 'Waiting for Bitcoin deposit';
    deposit_address: string;
    max_giveable: string;
    minimum_amount: string;
    maximum_amount: string;
  };
}

interface SwapLogReceivedBitcoin extends SwapLog {
  fields: {
    message: 'Received Bitcoin';
    max_giveable: string;
    new_balance: string;
  };
}

interface SwapLogStartedSwap extends SwapLog {
  fields: {
    message: 'Starting new swap';
    amount: string;
    fees: string;
    swap_id: string;
  };
}

interface SwapLogPublishedBtcTx extends SwapLog {
  fields: {
    message: 'Published Bitcoin transaction';
    txid: string;
    kind: 'lock' | 'cancel' | 'withdraw';
  };
}

interface SwapLogBtcTxStatusChanged extends SwapLog {
  fields: {
    message: 'Bitcoin transaction status changed';
    txid: string;
    new_status: string;
  };
}

interface SwapLogAliceLockedJude extends SwapLog {
  fields: {
    message: 'Alice locked Jude';
    txid: string;
  };
}

interface SwapLogReceivedJudeLockTxConfirmation extends SwapLog {
  fields: {
    message: 'Received new confirmation for Jude lock tx';
    txid: string;
    seen_confirmations: string;
    needed_confirmations: string;
  };
}

interface SwapLogRedeemedJude extends SwapLog {
  fields: {
    message: 'Successfully transferred Jude to wallet';
    jude_receive_address: string;
    txid: string;
  };
}
