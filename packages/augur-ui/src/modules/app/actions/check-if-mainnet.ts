import { getNetworkId } from 'modules/contracts/actions/contractCalls';

export const checkIfMainnet = () => getNetworkId() === '1';
