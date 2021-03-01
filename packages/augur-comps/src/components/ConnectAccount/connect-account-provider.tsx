import React from 'react';
import {
  createWeb3ReactRoot,
  Web3ReactProvider,
} from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK_COMPS');

function getLibrary(provider) {
  const library = new Web3Provider(provider, 'any');
  library.pollingInterval = 15000;
  return library;
}

export const ConnectAccountProvider = ({ children }) => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      {children}
    </Web3ProviderNetwork>
  </Web3ReactProvider>
);

export default ConnectAccountProvider;