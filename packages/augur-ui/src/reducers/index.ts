// import newMarket from 'modules/markets/reducers/new-market';
import initialized3box from 'modules/global-chat/reducers/initialized-3box'
import {
  Initialized3box
} from 'modules/types';
import { SDKConfiguration } from '@augurproject/artifacts';

export function createReducer() {
  return {
    initialized3box
  };
}

// TODO: couldn't use concreat type form `createReducer` so hardcoding structure here
// keeping with reducers for easier maintenance.
export interface AppStateInterface {
  config: SDKConfiguration;
  initialized3box: Initialized3box;
}
