import React, { useEffect } from 'react';
import {
  DEFAULT_GRAPH_DATA_STATE,
  STUBBED_GRAPH_DATA_ACTIONS,
} from './constants';
import { ApolloProvider } from 'react-apollo';
import * as GraphClient from '../apollo/client';
import { useGraphData } from './graph-data-hooks';
import { processGraphMarkets } from './process-data';
import { NETWORK_BLOCK_REFRESH_TIME, PARA_CONFIG } from './constants';
import { getMarketsData } from '../apollo/client';
import { useUserStore } from './user';

export const GraphDataContext = React.createContext({
  ...DEFAULT_GRAPH_DATA_STATE,
  actions: STUBBED_GRAPH_DATA_ACTIONS,
});

export const GraphDataStore = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_GRAPH_DATA_STATE }),
  actions: STUBBED_GRAPH_DATA_ACTIONS,
};
// default to GraphClient.client if no client is passed...
export const GraphDataProvider = ({ children, client = GraphClient.client }) => {
  const state = useGraphData();
  const { loginAccount } = useUserStore();
  const library = loginAccount?.library ? loginAccount.library : null;
  const { 
    ammExchanges,
    cashes,
    markets,
    blocknumber,
    actions: { updateGraphHeartbeat },
  } = state;

  if (!GraphDataStore.actionsSet) {
    GraphDataStore.actions = state.actions;
    GraphDataStore.actionsSet = true;
  }
  const readableState = { ...state };
  delete readableState.actions;
  GraphDataStore.get = () => readableState;
  // useEffect is here to keep data fresh, fetch on mount then use network 
  // interval map to determine update cadence.
  useEffect(() => {
    let isMounted = true;
    // get data immediately, then setup interval
    getMarketsData(async (graphData, block, errors) => {
      isMounted && !!errors
        ? updateGraphHeartbeat(
            { ammExchanges, cashes, markets },
            blocknumber,
            errors
          )
        : updateGraphHeartbeat(
            await processGraphMarkets(graphData, library),
            block,
            errors
          );
    });
    const intervalId = setInterval(() => {
      getMarketsData(async (graphData, block, errors) => {
        isMounted && !!errors
          ? updateGraphHeartbeat(
              { ammExchanges, cashes, markets },
              blocknumber,
              errors
            )
          : updateGraphHeartbeat(
              await processGraphMarkets(graphData, library),
              block,
              errors
            );
      });
    }, NETWORK_BLOCK_REFRESH_TIME[PARA_CONFIG.networkId] || NETWORK_BLOCK_REFRESH_TIME[1]);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [library]);

  return (
    <ApolloProvider client={client}>
      <GraphDataContext.Provider value={state}>
        {children}
      </GraphDataContext.Provider>
    </ApolloProvider>
  );
};

export const useGraphDataStore = () => React.useContext(GraphDataContext);

const output = {
  GraphDataProvider,
  useGraphDataStore,
  GraphDataStore
};

export default output;