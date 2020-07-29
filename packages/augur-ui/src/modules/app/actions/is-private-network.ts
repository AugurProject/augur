import { NETWORK_IDS } from 'modules/common/constants';

export const isPrivateNetwork = (networkId: string) =>
  [
    NETWORK_IDS.Private1,
    NETWORK_IDS.Private2,
    NETWORK_IDS.Private3,
    NETWORK_IDS.Private4,
  ].includes(networkId);
