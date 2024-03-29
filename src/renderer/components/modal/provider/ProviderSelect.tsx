import {
  makeStyles,
  ButtonBase,
  Card,
  CardContent,
  Box,
} from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useState } from 'react';
import ProviderInfo from './ProviderInfo';
import ProviderSelectDialog from './ProviderSelectDialog';
import ProviderSubmitDialog from './ProviderSubmitDialog';
import { useAppSelector } from '../../../../store/hooks';

const useStyles = makeStyles({
  inner: {
    textAlign: 'left',
    width: '100%',
    height: '100%',
  },
  providerCard: {
    width: '100%',
  },
  providerCardContent: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default function ProviderSelect() {
  const classes = useStyles();
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const selectedProvider = useAppSelector(
    (state) => state.providers.selectedProvider
  );

  if (!selectedProvider) return <>No provider selected</>;

  const handleSelectDialogClose = () => {
    setSelectDialogOpen(false);
  };

  const handleSelectDialogOpen = () => {
    setSelectDialogOpen(true);
  };

  const handleSubmitDialogClose = () => {
    setSubmitDialogOpen(false);
  };

  const handleSubmitDialogOpen = () => {
    setSubmitDialogOpen(true);
    setSelectDialogOpen(false);
  };

  return (
    <Box>
      <ProviderSelectDialog
        open={selectDialogOpen}
        onClose={handleSelectDialogClose}
        onSubmitDialogOpen={handleSubmitDialogOpen}
      />
      <ProviderSubmitDialog
        open={submitDialogOpen}
        onClose={handleSubmitDialogClose}
      />

      <ButtonBase className={classes.inner} onClick={handleSelectDialogOpen}>
        <Card variant="outlined" className={classes.providerCard}>
          <CardContent className={classes.providerCardContent}>
            <ProviderInfo provider={selectedProvider} />
            <ArrowForwardIosIcon />
          </CardContent>
        </Card>
      </ButtonBase>
    </Box>
  );
}
