import { NETWORK_IDS } from 'modules/common/constants';

export const isPrivateNetwork = networkId =>
  [
    NETWORK_IDS.Private1,
    NETWORK_IDS.Private2,
    NETWORK_IDS.Private3,
    NETWORK_IDS.Private4,
    NETWORK_IDS.PrivateGeth,
  ].includes(networkId);
