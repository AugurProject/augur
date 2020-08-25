import classNames from 'classnames';
import { TRADING_TUTORIAL_STEPS, CATEGORICAL } from "modules/common/constants";
import Styles from 'modules/market/components/market-view/market-view.styles.less';

const {
  INTRO_MODAL,
  QUANTITY,
  LIMIT_PRICE,
  OPEN_ORDERS,
  MY_FILLS,
  POSITIONS,
  MARKET_DETAILS,
  BUYING_SHARES,
  ORDER_VALUE,
  PLACE_ORDER,
  SELECT_OUTCOME,
  ORDER_BOOK,
  MARKET_DATA,
} = TRADING_TUTORIAL_STEPS;

export function findType(market) {
  if (market) {
    const { numOutcomes, marketType } = market;

    if (marketType === CATEGORICAL && numOutcomes > 4) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

export const handleStyleCalculation = 
(preview, tradingTutorial, tutorialStep, extendOrderBook, extendTradeHistory, extendOutcomesList, extendOrders, cat5) =>
({
  MarketViewStyle: classNames(Styles.MarketView, {
    [Styles.Inactive]: preview,
  }),
  ContainerStyle: classNames(Styles.container, {
    [Styles.Tutorial]: tradingTutorial,
  }),
  HeaderStyle: classNames(Styles.Header, {
    [Styles.HeaderTutorial]:
      tradingTutorial &&
      tutorialStep === MARKET_DETAILS,
  }),
  TradingFormStyle: classNames(Styles.TradingForm, {
    [Styles.TradingFormTutorial]:
      tradingTutorial &&
      ((tutorialStep >= BUYING_SHARES &&
        tutorialStep <= ORDER_VALUE) ||
        tutorialStep === PLACE_ORDER),
    [Styles.PlaceOrderTutorial]:
      tradingTutorial &&
      tutorialStep === PLACE_ORDER,
    [Styles.SelectOutcomeTutorial]:
      tradingTutorial &&
      tutorialStep === SELECT_OUTCOME,
    [Styles.BuyingSharesTutorial]:
      tradingTutorial &&
      tutorialStep === BUYING_SHARES,
    [Styles.QuantityTutorial]:
      tradingTutorial &&
      tutorialStep === QUANTITY,
    [Styles.LimitPriceTutorial]:
      tradingTutorial &&
      tutorialStep === LIMIT_PRICE,
    [Styles.OrderValueTutorial]:
      tradingTutorial &&
      tutorialStep === ORDER_VALUE,
  }),
  ChartsPaneStyle: classNames(Styles.ChartsPane, {
    [Styles.Hide]: cat5 ? extendOutcomesList : extendOrders,
  }),
  OrdersPaneStyle: classNames(Styles.OrdersPane, {
    [Styles.OpenOrdersTutorial]:
      tradingTutorial &&
      tutorialStep === OPEN_ORDERS,
    [Styles.FillsTutorial]:
      tradingTutorial &&
      tutorialStep === MY_FILLS,
    [Styles.PositionsTutorial]:
      tradingTutorial &&
      tutorialStep === POSITIONS,
  }),
  OrderBookStyle: classNames(Styles.OrderBook, {
    [Styles.hide]: extendTradeHistory,
    [Styles.show]: extendOrderBook,
    [Styles.OrderBookTutorial]:
      tradingTutorial &&
      tutorialStep === ORDER_BOOK,
  }),
  HistoryStyle: classNames(Styles.History, {
    [Styles.hide]: extendOrderBook,
    [Styles.show]: extendTradeHistory,
  }),
});