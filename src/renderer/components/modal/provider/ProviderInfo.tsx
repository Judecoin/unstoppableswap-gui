import { makeStyles, Box, Typography, Chip } from '@material-ui/core';
import { satsToBtc } from '../../../../utils/currencyUtils';
import { ExtendedProvider } from '../../../../models/storeModel';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: theme.spacing(1),
  },
  content: {
    flex: 1,
    '& *': {
      lineBreak: 'anywhere',
    },
  },
  chipsOuter: {
    display: 'flex',
    marginTop: theme.spacing(1),
    gap: theme.spacing(0.5),
  },
}));

export default function ProviderInfo({
  provider,
}: {
  provider: ExtendedProvider;
}) {
  const classes = useStyles();
  const uptime = Math.round(
    (provider.uptimeSeconds /
      (provider.downtimeSeconds + provider.uptimeSeconds)) *
      100
  );

  return (
    <Box className={classes.content}>
      <Typography className={classes.title} color="textSecondary" gutterBottom>
        Swap Provider
      </Typography>
      <Typography variant="h5" component="h2">
        {provider.multiAddr}
      </Typography>
      <Typography className={classes.pos} color="textSecondary">
        {provider.peerId.substring(0, 12)}...
      </Typography>
      <Typography variant="caption" component="p">
        Exchange rate: {satsToBtc(provider.price)} BTC/jude
        <br />
        Minimum swap amount: {satsToBtc(provider.minSwapAmount)} BTC
        <br />
        Maximum swap amount: {satsToBtc(provider.maxSwapAmount)} BTC
      </Typography>
      <Box className={classes.chipsOuter}>
        <Chip label={provider.testnet ? 'Testnet' : 'Mainnet'} />
        <Chip label={`${uptime} % uptime`} />
        <Chip
          label={`Went online ${provider.age} ${
            provider.age === 1 ? 'day' : 'days'
          } ago`}
        />
      </Box>
    </Box>
  );
}
