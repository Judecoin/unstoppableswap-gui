import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BalanceState {
  balanceValue: number | null;
  exitCode: number | null;
  processRunning: boolean;
  stdOut: string;
}

const initialState: BalanceState = {
  balanceValue: null,
  processRunning: false,
  exitCode: null,
  stdOut: '',
};

export const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    balanceAppendStdOut: (balance, action: PayloadAction<string>) => {
      balance.stdOut += action.payload;

      const balanceValueStr = action.payload
        .split(/(\r?\n)/g)
        .find((s) => s.match(/Bitcoin balance is (.*) BTC/));

      if (balanceValueStr) {
        const balanceValue = balanceValueStr
          .split(' ')
          .map(Number.parseFloat)
          .find((f) => !Number.isNaN(f));
        if (balanceValue !== undefined) {
          balance.balanceValue = balanceValue;
        } else {
          console.error(`Failed to parse balance StdOut: ${balance.stdOut}`);
        }
      }
    },
    balanceInitiate: (balance) => {
      balance.processRunning = true;
      balance.stdOut = '';
    },
    balanceProcessExited: (
      balance,
      action: PayloadAction<{
        exitCode: number | null;
        exitSignal: NodeJS.Signals | null;
      }>
    ) => {
      balance.processRunning = false;
      balance.exitCode = action.payload.exitCode;
    },
  },
});

export const { balanceAppendStdOut, balanceInitiate, balanceProcessExited } =
  balanceSlice.actions;

export default balanceSlice.reducer;
