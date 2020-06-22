// import newMarket from 'modules/markets/reducers/new-market';
import { SDKConfiguration } from '@augurproject/artifacts';

export function createReducer() {
  return {};
}

// TODO: couldn't use concreat type form `createReducer` so hardcoding structure here
// keeping with reducers for easier maintenance.
export interface AppStateInterface {
  config: SDKConfiguration;
}
