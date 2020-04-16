import { formatDate } from 'utils/format-date';

const now = new Date();

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
            wager: '10.00',
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
