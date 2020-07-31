import {
  NetworkId,
} from './constants';


export interface GasStation {
  // all fields are serialized integers
  fast: string;
  standard: string;
  safeLow: string;
  average: string;
}

type MakeGasStationType = (rateLimitSeconds: number) => (networkId: NetworkId) => Promise<GasStation>;

const makeGetGasStation: MakeGasStationType = (rateLimitSeconds: number) => {
  const rateLimitMS = rateLimitSeconds * 1000;
  let lastcall = Number(0);
  let cached: GasStation = null;

  return async (networkId: NetworkId) => {
    if (networkId !== NetworkId.Mainnet) {
      return {
        fast: '4000000000',
        standard: '1000000000',
        safeLow: '1000000000',
        average: '2000000000',
      }
    }

    const now = Number(new Date());
    if (lastcall + rateLimitMS < now) {
      lastcall = now;
      cached = await fetch(
        'https://safe-relay.gnosis.io/api/v1/gas-station/',
        { method: 'GET' },
      ).then((r) => r.json());
    }

    return cached
  }
};

const RATE_LIMIT_SECONDS = 5;
export const getGasStation = makeGetGasStation(RATE_LIMIT_SECONDS);
