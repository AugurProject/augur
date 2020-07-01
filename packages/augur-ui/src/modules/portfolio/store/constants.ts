import {
  REPORTING_STATE,
  SPORTS_MARKET_TYPES,
  MY_BETS_VIEW_BY,
  MY_BETS_MARKET_STATUS,
  MY_BETS_BET_DATE,
  MARKET_STATE_TYPES,
} from 'modules/common/constants';
import { BET_STATUS, BET_TYPE } from 'modules/trading/store/constants';

export const VIEW_BY = 'viewBy';
export const ROWS = 'rows';
export const SELECTED_MARKET_CARD_TYPE = 'selectedMarketCardType';
export const SELECTED_MARKET_STATE_TYPE = 'selectedMarketStateType';
export const MARKET_STATUS = 'marketStatus';
export const BET_DATE = 'betDate';

export const MY_BETS_ACTIONS = {
  SET_VIEW_BY: 'SET_VIEW_BY',
  SET_SELECTED_MARKET_CARD_TYPE: 'SET_SELECTED_MARKET_CARD_TYPE',
  SET_SELECTED_MARKET_STATE_TYPE: 'SET_MARKET_STATE_TYPE',
  SET_MARKET_STATUS: 'SET_MARKET_STATUS',
  SET_BET_DATE: 'BET_DATE',
};

export const DEFAULT_MY_BETS_STATE = {
  selectedMarketCardType: SPORTS_MARKET_TYPES[0].id,
  viewBy: MY_BETS_VIEW_BY[0].value,
  marketStatus: MY_BETS_MARKET_STATUS[0].value,
  betDate: MY_BETS_BET_DATE[0].value,
  rows: [],
  selectedMarketStateType: MARKET_STATE_TYPES[0].id,
};

export const STUBBED_MY_BETS_ACTIONS = {
  setViewBy: viewBy => {},
  setMarketStatus: marketStatus => {},
  setBetDate: betDate => {},
  setSelectedMarketCardType: selectedMarketCardType => {},
  setSelectedMarketStateType: selectedMarketStateType => {},
};
