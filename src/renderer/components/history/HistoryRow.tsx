import { Button, TableCell, TableRow } from '@material-ui/core';
import React from 'react';
import { MergedDbState } from '../../../models/databaseModel';
import { pionerosTojude } from '../../../swap/utils/unit-utils';

type HistoryRowProps = {
  dbState: MergedDbState;
};

export default function HistoryRow({ dbState }: HistoryRowProps) {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {dbState.swapId}
      </TableCell>
      <TableCell>
        {pionerosTojude(dbState.state.Bob.ExecutionSetupDone.state2.jude)} jude
      </TableCell>
      <TableCell>{dbState.type}</TableCell>
      <TableCell>
        <Button>Action</Button>
      </TableCell>
    </TableRow>
  );
}
