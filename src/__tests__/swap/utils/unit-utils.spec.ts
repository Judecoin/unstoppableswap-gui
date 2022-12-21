import {
  btcToSats,
  pionerosTojude,
  satsToBtc,
} from '../../../swap/utils/unit-utils';

test('should convert sats to btc', () => {
  expect(satsToBtc(1350000000)).toBe(13.5);
});

test('should convert btc to sats', () => {
  expect(btcToSats(13.5)).toBe(1350000000);
});

test('should convert piconeros to jude', () => {
  expect(pionerosTojude(1)).toBe(0.000000000001);
});
