import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { NETWORK_IDS } from 'modules/common/constants';

export const checkIfMainnet = () => getNetworkId() === NETWORK_IDS.Mainnet;
