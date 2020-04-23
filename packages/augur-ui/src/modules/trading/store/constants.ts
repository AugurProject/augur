import { formatDate } from 'utils/format-date';
import { REPORTING_STATE } from 'modules/common/constants';

const now = new Date();

export const BET_TYPE = {
  SPREAD: 'Spread',
  MONEYLINE: 'Moneyline',
};

export const BET_STATUS = {
  UNSENT: 'UNSENT',
  UNFILLED: 'UNFILLED',
  PENDING: 'PENDING',
  FILLED: 'FILLED',
  PARTIALLY_FILLED: 'PARTIALLY_FILLED',
  CLOSED: 'CLOSED',
  FAILED: 'FAILED',
};

export const BETSLIP_SELECTED = {
  BETSLIP: 'betslip',
  MY_BETS: 'myBets',
  UNMATCHED: 'unmatched',
  MATCHED: 'matched',
};

export const EMPTY_BETSLIST = {
  count: 0,
  items: {},
};

export const DEFAULT_BETSLIP_STATE = {
  selected: {
    header: BETSLIP_SELECTED.BETSLIP,
    subHeader: BETSLIP_SELECTED.MATCHED,
  },
  step: 0,
  betslip: EMPTY_BETSLIST,
  unmatched: EMPTY_BETSLIST,
  matched: EMPTY_BETSLIST,
};

export const MOCK_BETSLIP_STATE = {
  selected: {
    header: BETSLIP_SELECTED.BETSLIP,
    subHeader: BETSLIP_SELECTED.MATCHED,
  },
  step: 0,
  betslip: {
    count: 3,
    items: {
      '0x01': {
        description: 'CHICAGO BULLS vs BROOKLYN NETS, SPREAD',
        orders: [
          {
            outcome: 'Chicogo Bulls, +5',
            odds: '-105',
            wager: '22.00',
            toWin: '9.52',
            amountFilled: '0',
            amountWon: '0',
            status: BET_STATUS.UNSENT,
            dateUpdated: null,
          },
          {
            outcome: 'Brooklyn Nets, -5',
            odds: '+115',
            wager: '10.00',
            toWin: '19.52',
            amountFilled: '0',
            amountWon: '0',
            status: BET_STATUS.UNSENT,
            dateUpdated: null,
          },
        ],
      },
      '0x02': {
        description: 'DALLAS MAVERICKS vs HOUSTON ROCKETS, SPREAD',
        orders: [
          {
            outcome: 'Houston Rockets, -8.5',
            odds: '-110',
            wager: '10.00',
            toWin: '9.09',
            amountFilled: '0',
            amountWon: '0',
            status: BET_STATUS.UNSENT,
            dateUpdated: null,
          },
        ],
      },
    },
  },
  unmatched: {
    count: 1,
    items: {
      '0x02': {
        description: 'DALLAS MAVERICKS vs HOUSTON ROCKETS, SPREAD',
        orders: [
          {
            outcome: 'Houston Rockets, -8.5',
            odds: '-110',
            wager: '10.00',
            toWin: '9.09',
            amountFilled: '0',
            amountWon: '0',
            status: BET_STATUS.UNFILLED,
            dateUpdated: formatDate(now),
          },
        ],
      },
    },
  },
  matched: {
    count: 4,
    items: {
      '0x01': {
        description: 'CHICAGO BULLS vs BROOKLYN NETS, SPREAD',
        orders: [
          {
            outcome: 'Chicogo Bulls, +5',
            odds: '-105',
            wager: '20.00',
            toWin: '19.04',
            amountFilled: '20.00',
            amountWon: '0',
            status: BET_STATUS.FILLED,
            dateUpdated: formatDate(now),
          },
          {
            outcome: 'Brooklyn Nets, -5',
            odds: '+115',
            wager: '100.00',
            toWin: '95.20',
            amountFilled: '25.00',
            amountWon: '0',
            status: BET_STATUS.PARTIALLY_FILLED,
            dateUpdated: formatDate(now),
          },
        ],
      },
      '0x02': {
        description: 'DALLAS MAVERICKS vs HOUSTON ROCKETS, SPREAD',
        orders: [
          {
            outcome: 'Houston Rockets, -8.5',
            odds: '-110',
            wager: '30.00',
            toWin: '27.27',
            amountFilled: '30.00',
            amountWon: '0',
            status: BET_STATUS.PENDING,
            dateUpdated: formatDate(now),
          },
        ],
      },
      '0x03': {
        description: 'NEW YORK KNICKS vs UTAH JAZZ, SPREAD',
        orders: [
          {
            outcome: 'Utah Jazz, +10.5',
            odds: '-110',
            wager: '50.00',
            toWin: '45.45',
            amountFilled: '0',
            amountWon: '0',
            status: BET_STATUS.FAILED,
            dateUpdated: formatDate(now),
          },
        ],
      },
    },
  },
};

export const BETSLIP_ACTIONS = {
  ADD_BET: 'ADD_BET',
  ADD_MATCHED: 'ADD_MATCHED',
  ADD_UNMATCHED: 'ADD_UNMATCHED',
  ADD_MULTIPLE_MATCHED: 'ADD_MULTIPLE_MATCHED',
  ADD_MULTIPLE_UNMATCHED: 'ADD_MULTIPLE_UNMATCHED',
  CASH_OUT: 'CASH_OUT',
  RETRY: 'RETRY',
  MODIFY_BET: 'MODIFY_BET',
  UPDATE_UNMATCHED: 'UPDATE_UNMATCHED',
  UPDATE_MATCHED: 'UPDATE_MATCHED',
  SEND_BET: 'SEND',
  SEND_ALL_BETS: 'SEND_ALL',
  TRASH: 'TRASH',
  CANCEL_BET: 'CANCEL_BET',
  CANCEL_UNMATCHED: 'CANCEL_UNMATCHED',
  CANCEL_ALL_BETS: 'CANCEL_ALL',
  CANCEL_ALL_UNMATCHED: 'CANCEL_ALL_UNMATCHED',
  TOGGLE_STEP: 'TOGGLE_STEP',
  TOGGLE_HEADER: 'TOGGLE_HEADER',
  TOGGLE_SUBHEADER: 'TOGGLE_SUBHEADER',
};

export const STUBBED_BETSLIP_ACTIONS = {
  toggleHeader: selected => {},
  toggleSubHeader: selected => {},
  toggleStep: () => {},
  addBet: (marketId, description, odds, outcome, wager) => {},
  sendBet: (marketId, orderId, description, order) => {},
  modifyBet: (marketId, orderId, order) => {},
  cancelBet: (marketId, orderId) => {},
  sendAllBets: () => {},
  cancelAllBets: () => {},
  retry: (marketId, orderId) => {},
  cashOut: (marketId, orderId) => {},
  updateMatched: (marketId, orderId, updates) => {},
  trash: (marketId, orderId) => {},
  cancelAllUnmatched: () => {},
  updateUnmatched: (marketId, orderId, updates) => {},
};

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
        betDate: 1587512165,
        highRisk: true,
        betType: BET_TYPE.MONEYLINE,
      },
    },
  },
];

export const MOCK_FUTURES_DATA = [
  {
    description: 'NBA Championship 2019-20',
    reportingState: REPORTING_STATE.PRE_REPORTING,
    categories: ['Sports', 'NBA'],
    isTemplate: true,
    startTime: 1587511175,
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
        betDate: 1587511165,
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
        betDate: 1587519165,
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
