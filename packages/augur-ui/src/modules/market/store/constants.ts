import { BUY, TUTORIAL_QUANTITY, TUTORIAL_PRICE, LONG, TRADING_TUTORIAL, PUBLICFILLORDER, CATEGORICAL, TRADING_TUTORIAL_OUTCOMES, TUTORIAL_TRADING_HISTORY, TUTORIAL_ORDER_BOOK, TUTORIAL_OUTCOME } from "modules/common/constants";
import { createBigNumber } from "utils/create-big-number";
import { formatDai, formatShares } from "utils/format-number";
import { IndividualOutcomeOrderBook } from "modules/types";
import { EMPTY_STATE } from "modules/create-market/constants";
import { convertUnixToFormattedDate } from "utils/format-date";
import { TXEventName } from '@augurproject/sdk-lite';
import { formatOrderBook } from "modules/create-market/helpers/format-order-book";

export const DEFAULT_MARKET_STATE = {
  market: {},
  isTradingTutorial: false,
  isPreview: null,
  defaultMarket: null,
};

export const MOCK_MARKET_STATE = {
  market: {},
  isTradingTutorial: false,
  isPreview: null,
  defaultMarket: null,
};

export const STUBBED_MARKET_ACTIONS = {

};

export const DEFAULT_ORDER_PROPERTIES = {
  orderPrice: '',
  orderQuantity: '',
  selectedNav: BUY,
};
export const EMPTY_FORMATTED_BOOK: IndividualOutcomeOrderBook = {
  spread: null,
  bids: [],
  asks: [],
};

const TUTORIAL_BN_QTY = createBigNumber(TUTORIAL_QUANTITY);
const TUTORIAL_BN_PRC = createBigNumber(TUTORIAL_PRICE);
const TUTORIAL_QTY_DAI = formatDai(TUTORIAL_QUANTITY);
const TUTORIAL_QTY_SHARES = formatShares(TUTORIAL_QUANTITY);
const TUTORIAL_PRC_DAI = formatDai(TUTORIAL_PRICE);
export const TUTORIAL_POSITION = {
  type: LONG,
  quantity: TUTORIAL_QTY_SHARES,
  id: TRADING_TUTORIAL,
  totalValue: TUTORIAL_QTY_DAI,
  totalReturns: TUTORIAL_QTY_DAI,
  unrealizedNet: TUTORIAL_QTY_DAI,
  realizedNet: TUTORIAL_QTY_DAI,
  purchasePrice: TUTORIAL_PRC_DAI,
};
export const MARKET_INFO = "Market Info";
export const TUTORIAL_FILL = {
  amount: TUTORIAL_BN_QTY,
  logIndex: 1,
  originalQuantity: TUTORIAL_BN_QTY,
  id: 'trading-tutorial-pending-order',
  type: BUY,
  price: TUTORIAL_BN_PRC,
};
export const TUTORIAL_OPEN_ORDER = {
  pending: true,
  id: 'trading-tutorial-pending-order',
  type: BUY,
  avgPrice: TUTORIAL_PRC_DAI,
  unmatchedShares: TUTORIAL_QTY_SHARES,
  tokensEscrowed: formatShares(0),
  sharesEscrowed: formatShares(0),
  creationTime: 0,
};

export const TUTORIAL_FILL_TRADE = {
  amount: TUTORIAL_BN_QTY,
  logIndex: 1,
  type: BUY,
  price: TUTORIAL_BN_PRC,
  transactionHash: '0xerjejfsdk',
};

export const TUTORIAL_FILL_ALERT = {
  name: PUBLICFILLORDER,
  toast: true,
  id: TRADING_TUTORIAL,
  uniqueId: TRADING_TUTORIAL,
  status: TXEventName.Success,
  params: {
    market: TRADING_TUTORIAL,
    amountFilled: TUTORIAL_QUANTITY,
    orderCreator: '0x1',
    price: TUTORIAL_PRICE,
    amount: TUTORIAL_QUANTITY,
    orderType: BUY,
  },
};

export const TRADING_TUTORIAL_MARKET = {
  ...EMPTY_STATE,
  id: TRADING_TUTORIAL,
  description:
    'Which NFL team will win: Los Angeles Rams vs New England Patriots Scheduled start time: October 27, 2019 1:00 PM ET',
  numOutcomes: 4,
  defaultSelectedOutcomeId: 1,
  marketType: CATEGORICAL,
  endTimeFormatted: convertUnixToFormattedDate(1668452763),
  creationTimeFormatted: convertUnixToFormattedDate(1573585563),
  outcomesFormatted: TRADING_TUTORIAL_OUTCOMES,
  groupedTradeHistory: TUTORIAL_TRADING_HISTORY,
  orderBook: TUTORIAL_ORDER_BOOK,
};

export const FORMATTED_TUTORIAL_BOOK = formatOrderBook(TUTORIAL_ORDER_BOOK[TUTORIAL_OUTCOME].filter(order => !order.disappear));
