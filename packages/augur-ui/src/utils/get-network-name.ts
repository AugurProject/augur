import { NETWORK_NAMES } from 'modules/common/constants';

export const getNetwork = (networkId: string): string   => {
  const network = NETWORK_NAMES[networkId];
  if (network) {
    return network.toLowerCase();
  }
  return 'localhost';
};
