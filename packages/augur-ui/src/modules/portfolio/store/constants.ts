import { REPORTING_STATE, SPORTS_MARKET_TYPES, MY_BETS_VIEW_BY, MY_BETS_MARKET_STATUS, MY_BETS_BET_DATE, MARKET_STATE_TYPES } from "modules/common/constants";import { BET_STATUS, BET_TYPE } from "modules/trading/store/constants";

export const MOCK_GAMES_DATA = [
    {
      description: 'River Plate vs. Boca Juniors',
      reportingState: REPORTING_STATE.PRE_REPORTING,
      categories: ['Sports', 'Soccer'],
      isTemplate: true,
      startTime: 1587511165,
      template: {
        hash: '0101',
      },
      outcomes: {
        '0x01': {
          outcome: 'River Plate, +2',
          odds: '-54',
          wager: '11.00',
          toWin: '9.52',
          amountFilled: '0',
          amountWon: '0',
          status: BET_STATUS.UNSENT,
          betDate: 1587511165,
          betType: BET_TYPE.SPREAD,
        },
        '0x02': {
          outcome: 'River Plate',
          odds: '-102',
          wager: '54.00',
          toWin: '9.52',
          amountFilled: '0',
          amountWon: '5.6',
          status: BET_STATUS.FILLED,
          betDate: 1587511165,
          betType: BET_TYPE.SPREAD,
        },
        '0x03': {
          outcome: 'Event Cancelled',
          odds: '-145',
          wager: '3.00',
          toWin: '9.52',
          amountFilled: '0',
          amountWon: '-2',
          status: BET_STATUS.UNSENT,
          betDate: 1587511465,
          betType: BET_TYPE.MONEYLINE,
        },
      },
    },
    {
      description: 'Dallas Maverick vs. Houston Rockets',
      reportingState: REPORTING_STATE.OPEN_REPORTING,
      categories: ['Sports', 'NBA'],
      isTemplate: true,
      startTime: 1587513165,
      template: {
        hash: '0101',
      },
      outcomes: {
        '0x01': {
          outcome: 'Dallas Maverick',
          odds: '125',
          wager: '11.00',
          toWin: '10.52',
          amountFilled: '0',
          amountWon: '0',
          status: BET_STATUS.UNSENT,
          betDate: 1387512165,
          highRisk: true,
          betType: BET_TYPE.MONEYLINE,
        },
      },
    },
  ];
  
  export const MOCK_FUTURES_DATA = [
    {
      description: 'NBA Championship 2019-20',
      reportingState: REPORTING_STATE.FINALIZED,
      categories: ['Sports', 'NBA'],
      isTemplate: true,
      startTime: 1509511175,
      template: {
        hash: '0101',
      },
      outcomes: {
        '0x01': {
          outcome: 'Chicago Bulls',
          odds: '205',
          wager: '110.00',
          toWin: '9.42',
          amountFilled: '0',
          amountWon: '0',
          status: BET_STATUS.CLOSED,
          betDate: 1588511165,
        },
      },
    },
    {
      description: 'Central Division 2019 - 20',
      reportingState: REPORTING_STATE.PRE_REPORTING,
      categories: ['Sports', 'NBA'],
      isTemplate: true,
      startTime: 1587518165,
      template: {
        hash: '0101',
      },
      outcomes: {
        '0x01': {
          outcome: 'Indiana Pacers',
          odds: '-115',
          wager: '101.00',
          toWin: '9.52',
          amountFilled: '0',
          amountWon: '0',
          status: BET_STATUS.UNSENT,
          betDate: 1687519165,
          highRisk: true,
        },
      },
    },
  ];
  
  export const MOCK_OUTCOMES_DATA = MOCK_GAMES_DATA.concat(
    MOCK_FUTURES_DATA
  ).reduce(
    (p, game) => [
      ...p,
      ...Object.values(game.outcomes).map(outcome => {
        return {
          ...game,
          outcomes: null,
          ...outcome,
        };
      }),
    ],
    []
  );
  
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
    SET_BET_DATE: 'BET_DATE'
  };


export const DEFAULT_MY_BETS_STATE = 
{
  selectedMarketCardType: SPORTS_MARKET_TYPES[0].id,
  viewBy: MY_BETS_VIEW_BY[0].value,
  marketStatus: MY_BETS_MARKET_STATUS[0].value,
  betDate: MY_BETS_BET_DATE[0].value,
  rows: MOCK_GAMES_DATA,
  selectedMarketStateType: MARKET_STATE_TYPES[0].id,
}

export const STUBBED_MY_BETS_ACTIONS = {
  setViewBy: viewBy => {},
  setMarketStatus: marketStatus => {},
  setBetDate: betDate => {},
  setSelectedMarketCardType: selectedMarketCardType => {},
  setSelectedMarketStateType: selectedMarketStateType => {},
}