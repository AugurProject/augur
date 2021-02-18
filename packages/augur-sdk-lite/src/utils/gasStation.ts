import { NETWORK_IDS } from "../constants";
import axios from 'axios';

interface GasStation {
  // all fields but lastUpdate are serialized integers
  fastest: string;
  fast: string;
  standard: string;
  safeLow: string;
  lowest: string;
  lastUpdate: string; // ISO datestamp
  average?: string; // UI expects this but gnosis gas station does not return it
}

type MakeGasStationType = (rateLimitSeconds: number) => (networkId: string) => Promise<GasStation>;

const makeGetGasStation: MakeGasStationType = (rateLimitSeconds: number) => {
  const rateLimitMS = rateLimitSeconds * 1000;
  let lastcall = Number(0);
  let cached: GasStation = null;

  return async (networkId: string) => {
    if (networkId !== NETWORK_IDS.Mainnet) {
      return {
        fastest: '5000000000',
        fast: '4000000000',
        standard: '1000000000',
        safeLow: '1000000000',
        lowest: '1000000000',
        lastUpdate: (new Date()).toISOString(),
      }
    }

    const now = Number(new Date());
    if (!cached || (lastcall + rateLimitMS < now)) {
      lastcall = now;
      cached = await axios.get('https://safe-relay.gnosis.io/api/v1/gas-station/')
        .then((r) => r.data);
    }

    return cached
  }
};

const RATE_LIMIT_SECONDS = 60 * 5;
const getGasStation = makeGetGasStation(RATE_LIMIT_SECONDS);
