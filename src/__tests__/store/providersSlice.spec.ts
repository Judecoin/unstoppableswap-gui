import { AnyAction } from '@reduxjs/toolkit';
import reducer, { setProviders } from '../../store/features/providersSlice';
import { ExtendedProvider } from '../../models/storeModel';

const exampleTestnetProvider: ExtendedProvider = {
  multiAddr: '/dnsaddr/t.jude.example',
  peerId: '12394294389438924',
  testnet: true,
  age: 5,
  downtimeSeconds: 100,
  uptimeSeconds: 1000,
  maxSwapAmount: 1,
  minSwapAmount: 0.1,
  price: 0.1,
  relevancy: 1,
};

const exampleMainnetProvider: ExtendedProvider = {
  multiAddr: '/dnsaddr/jude.example',
  peerId: '32394294389438924',
  testnet: false,
  age: 5,
  downtimeSeconds: 100,
  uptimeSeconds: 1000,
  maxSwapAmount: 1,
  minSwapAmount: 0.1,
  price: 0.1,
  relevancy: 1,
};

const initialState = {
  providers: [],
  selectedProvider: null,
};

test('should return the initial state', () => {
  expect(reducer(undefined, {} as AnyAction)).toEqual(initialState);
});

describe('testnet', () => {
  beforeAll(() => {
    process.env.TESTNET = 'true';
  });

  test('should set and filter the provider list', () => {
    expect(
      reducer(
        initialState,
        setProviders([exampleMainnetProvider, exampleTestnetProvider])
      )
    ).toEqual({
      providers: [exampleTestnetProvider],
      selectedProvider: exampleTestnetProvider,
    });
  });
});

describe('mainnet', () => {
  beforeAll(() => {
    process.env.TESTNET = 'false';
  });

  test('should set and filter the provider list', () => {
    expect(
      reducer(
        initialState,
        setProviders([exampleMainnetProvider, exampleTestnetProvider])
      )
    ).toEqual({
      providers: [exampleMainnetProvider],
      selectedProvider: exampleMainnetProvider,
    });
  });
});
