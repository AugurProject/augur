/* eslint-disable jsx-a11y/no-static-element-interaction */

import React, { Component } from 'react';
import classNames from 'classnames';
import Media from 'react-media';

import MarketHeader from 'modules/market/containers/market-header';
import MarketOrdersPositionsTable from 'modules/market/containers/market-orders-positions-table';
import MarketOutcomesList from 'modules/market/containers/market-outcomes-list';
import TradingForm from 'modules/trading/components/trading-form';
import OrderBook from 'modules/market-charts/containers/order-book';
import MarketChartsPane from 'modules/market-charts/containers/market-charts-pane';
import parseMarketTitle from 'modules/markets/helpers/parse-market-title';
import MarketTradeHistory from 'modules/market/containers/market-trade-history';
import MarketComments from 'modules/market/containers/market-comments';
import {
  CATEGORICAL,
  BUY,
  PUBLICFILLORDER,
  LONG,
  SCALAR,
  TRADING_TUTORIAL,
  TRADING_TUTORIAL_STEPS,
  TRADING_TUTORIAL_COPY,
  MODAL_TUTORIAL_OUTRO,
  MODAL_TUTORIAL_INTRO,
  MODAL_SCALAR_MARKET,
  TUTORIAL_QUANTITY,
  TUTORIAL_PRICE,
  TRADING_TUTORIAL_OUTCOMES,
  TUTORIAL_OUTCOME,
} from 'modules/common/constants';
import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import PriceHistory from 'modules/market-charts/containers/price-history';
import Styles from 'modules/market/components/market-view/market-view.styles.less';
import { LeftChevron } from 'modules/common/icons';
import { SMALL_MOBILE } from 'modules/common/constants';
import {
  MarketData,
  OutcomeFormatted,
  DefaultOrderProperties,
  IndividualOutcomeOrderBook,
  TestTradingOrder,
  OutcomeTestTradingOrder,
} from 'modules/types';
import { getDefaultOutcomeSelected } from 'utils/convert-marketInfo-marketData';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { TutorialPopUp } from '../common/tutorial-pop-up';
import { formatShares, formatDai } from 'utils/format-number';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { createBigNumber } from 'utils/create-big-number';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';
import { formatOrderBook } from 'modules/create-market/helpers/format-order-book';
import type { Getters } from '@augurproject/sdk';
import { HotLoadMarketInfo, TXEventName } from '@augurproject/sdk-lite';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { MARKET_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import { hotloadMarket } from 'modules/markets/actions/load-markets';

interface MarketViewProps {
  isMarketLoading: boolean;
  closeMarketLoadingModalOnly: Function;
  market: MarketData;
  marketId: string;
  marketReviewSeen: boolean;
  scalarModalSeen: boolean;
  marketReviewModal: Function;
  currentTimestamp: number;
  isConnected: boolean;
  loadMarketsInfo: Function;
  loadMarketTradingHistory: Function;
  description: string;
  marketType: string;
  outcomes: OutcomeFormatted[];
  updateModal: Function;
  history: History;
  showMarketLoadingModal: Function;
  preview?: boolean;
  sortedOutcomes: OutcomeFormatted[];
  tradingTutorial?: boolean;
  addAlert: Function;
  hotloadMarket: Function;
  canHotload: boolean;
  modalShowing?: string;
  removeAlert: Function;
  outcomeId?: number;
  account: string;
  orderBook?: Getters.Markets.OutcomeOrderBook | OutcomeTestTradingOrder;
  loadMarketOrderBook: Function;
  clearOrderBook: Function;
  zeroXstatus: string;
  hasZeroXError: boolean;
  marketNotFound: boolean;
  showMarketNotFound: Function;
}

export interface DefaultOrderPropertiesMap {
  [outcomeId: number]: DefaultOrderProperties;
}
interface MarketViewState {
  pane: string | null;
  extendOutcomesList: boolean;
  extendOrders: boolean;
  extendOrderBook: boolean;
  extendTradeHistory: boolean;
  selectedOrderProperties: DefaultOrderProperties;
  selectedOutcomeId?: number;
  fixedPrecision: number;
  selectedOutcomeProperties: DefaultOrderPropertiesMap;
  tutorialStep: number;
  introShowing: boolean;
  tutorialError: string;
  hasShownScalarModal: boolean;
  hotPromise: Promise<HotLoadMarketInfo>;
}

export default class MarketView extends Component<
  MarketViewProps,
  MarketViewState
> {
  static defaultProps = {
    marketType: undefined,
    outcomes: [],
    currentTimestamp: 0,
  };

  DEFAULT_ORDER_PROPERTIES = {
    orderPrice: '',
    orderQuantity: '',
    selectedNav: BUY,
  };
  node: any;
  EmptyOrderBook: IndividualOutcomeOrderBook = {
    spread: null,
    bids: [],
    asks: [],
  };
  constructor(props: MarketViewProps) {
    super(props);

    const cat5 = this.findType();

    this.state = {
      pane: null,
      introShowing: false,
      tutorialStep: TRADING_TUTORIAL_STEPS.INTRO_MODAL,
      hasShownScalarModal: false,
      extendOrderBook: false,
      extendTradeHistory: false,
      extendOutcomesList: cat5 ? true : false,
      extendOrders: false,
      selectedOrderProperties: this.DEFAULT_ORDER_PROPERTIES,
      selectedOutcomeId:
        props.outcomeId !== null
          ? props.outcomeId
          : props.market
          ? props.market.defaultSelectedOutcomeId
          : undefined,
      fixedPrecision: 4,
      tutorialError: '',
      hotPromise: null,
      selectedOutcomeProperties: {
        1: {
          ...this.DEFAULT_ORDER_PROPERTIES,
        },
      },
    };

    this.updateSelectedOutcome = this.updateSelectedOutcome.bind(this);
    this.updateSelectedOrderProperties = this.updateSelectedOrderProperties.bind(
      this
    );
    this.toggleOrderBook = this.toggleOrderBook.bind(this);
    this.toggleTradeHistory = this.toggleTradeHistory.bind(this);
    this.updateSelectedOutcomeSwitch = this.updateSelectedOutcomeSwitch.bind(
      this
    );
    this.showMarketDisclaimer = this.showMarketDisclaimer.bind(this);
    this.toggleMiddleColumn = this.toggleMiddleColumn.bind(this);
    this.tradingTutorialWidthCheck = this.tradingTutorialWidthCheck.bind(this);

    const {
      isConnected,
      loadMarketsInfo,
      marketId,
      loadMarketTradingHistory,
      tradingTutorial,
      loadMarketOrderBook,
      preview,
    } = this.props;

    this.tradingTutorialWidthCheck();

    if (isConnected && !!marketId && !tradingTutorial && !preview) {
      loadMarketsInfo(marketId);
      loadMarketOrderBook(marketId);
      loadMarketTradingHistory(marketId);
    }
  }

  componentDidMount() {
    if (!this.props.preview && !this.props.hasZeroXError) {
      this.node && this.node.scrollIntoView();
      window.scrollTo(0, 1);
    }

    const { isMarketLoading, showMarketLoadingModal, marketNotFound, showMarketNotFound, history } = this.props;

    if (marketNotFound) {
      showMarketNotFound(history);
    } else if (isMarketLoading) {
      showMarketLoadingModal();
    }
  }

  componentDidUpdate(prevProps: MarketViewProps) {
    const {
      isConnected,
      marketId,
      tradingTutorial,
      updateModal,
      closeMarketLoadingModalOnly,
      preview,
    } = prevProps;
    if (
      this.props.outcomeId !== prevProps.outcomeId &&
      this.props.outcomeId !== null
    ) {
      this.setState({ selectedOutcomeId: this.props.outcomeId });
    }

    if (tradingTutorial) {
      if (
        !this.state.introShowing &&
        this.state.tutorialStep === TRADING_TUTORIAL_STEPS.INTRO_MODAL
      ) {
        updateModal({
          type: MODAL_TUTORIAL_INTRO,
          next: this.next,
        });
        this.setState({
          introShowing: true,
          selectedOrderProperties: {
            ...(tradingTutorial !== prevProps.tradingTutorial
              ? this.DEFAULT_ORDER_PROPERTIES
              : this.state.selectedOrderProperties),
          },
        });
      }
      return;
    }

    if ((isConnected !== this.props.isConnected) && !!marketId && !tradingTutorial && !preview) {
      this.props.loadMarketOrderBook(marketId);
      this.props.loadMarketsInfo(this.props.marketId);
      this.props.loadMarketTradingHistory(marketId);
    }
    if (!this.props.isMarketLoading) {
      if (closeMarketLoadingModalOnly) closeMarketLoadingModalOnly(this.props.modalShowing);
    }

    if (
      !tradingTutorial &&
      !this.props.scalarModalSeen &&
      this.props.marketType === SCALAR &&
      !this.state.hasShownScalarModal
    ) {
      this.props.updateModal({
        type: MODAL_SCALAR_MARKET,
        cb: () => this.setState({ hasShownScalarModal: true }),
      });
    }

    const { marketNotFound, showMarketNotFound, history } = this.props;

    if (marketNotFound !== prevProps.marketNotFound && marketNotFound) {
      showMarketNotFound(history);
    }
  }

  componentWillUnmount() {
    const { clearOrderBook } = this.props;
    if (clearOrderBook) this.props.clearOrderBook();
  }

  tradingTutorialWidthCheck() {
    if (this.props.tradingTutorial && window.innerWidth < 1150) {
      // tablet-max
      // Don't show tradingTutorial on mobile,
      // redirect to markets when we enter tablet breakpoints
      this.props.history.push({ pathname: makePath(MARKETS) });
    }
  }

  // don't show the market disclaimer when user shows up. TODO: Design to figure out when to show
  showMarketDisclaimer() {
    const { marketReviewSeen, marketReviewModal } = this.props;
    if (!marketReviewSeen && marketReviewModal) {
      marketReviewModal();
    }
  }

  findType() {
    const { marketType, market } = this.props;

    if (market) {
      const { numOutcomes } = market;

      if (marketType === CATEGORICAL && numOutcomes > 4) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  toggleOrderBook() {
    if (!this.state.extendOrderBook && this.state.extendTradeHistory) {
      this.setState({ extendOrderBook: false, extendTradeHistory: false });
    } else {
      this.setState({
        extendOrderBook: !this.state.extendOrderBook,
        extendTradeHistory: false,
      });
    }
  }

  toggleTradeHistory() {
    if (!this.state.extendTradeHistory && this.state.extendOrderBook) {
      this.setState({ extendTradeHistory: false, extendOrderBook: false });
    } else {
      this.setState({
        extendTradeHistory: !this.state.extendTradeHistory,
        extendOrderBook: false,
      });
    }
  }

  updateSelectedOutcomeSwitch(selectedOutcomeId, keepOrder) {
    this.updateSelectedOutcome(selectedOutcomeId, keepOrder);
  }

  updateSelectedOutcome(selectedOutcomeId, keepOrder) {
    if (selectedOutcomeId !== this.state.selectedOutcomeId) {
      if (keepOrder) {
        return this.setState({selectedOutcomeId});
      }
      this.setState({
        selectedOutcomeId,
        selectedOrderProperties: {
          ...this.DEFAULT_ORDER_PROPERTIES,
        },
      });

      const { selectedOutcomeProperties } = this.state;
      if (!selectedOutcomeProperties[selectedOutcomeId]) {
        selectedOutcomeProperties[selectedOutcomeId] = {
          ...this.DEFAULT_ORDER_PROPERTIES,
        };
        this.setState({ selectedOutcomeProperties });
      }
    }
  }

  updateSelectedOrderProperties(selectedOrderProperties) {
    this.checkTutorialErrors(selectedOrderProperties);
    if (this.state.pane === 'Market Info') {
      document
        .querySelector('.trading-form-styles_TradingForm')
        .scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    this.setState({
      selectedOrderProperties,
    });
  }

  checkTutorialErrors(selectedOrderProperties) {
    if (this.state.tutorialStep === TRADING_TUTORIAL_STEPS.QUANTITY) {
      const invalidQuantity =
        parseFloat(selectedOrderProperties.orderQuantity) !== TUTORIAL_QUANTITY;
      this.setState({
        tutorialError:
          parseFloat(selectedOrderProperties.orderQuantity) !==
          TUTORIAL_QUANTITY
            ? 'Please enter a quantity of 100 for this order to be filled on the test market'
            : '',
      });

      return invalidQuantity;
    }

    if (this.state.tutorialStep === TRADING_TUTORIAL_STEPS.LIMIT_PRICE) {
      const invalidPrice =
        parseFloat(selectedOrderProperties.orderPrice) !== TUTORIAL_PRICE;
      this.setState({
        tutorialError: invalidPrice
          ? 'Enter a limit price of $.40 for this order to be filled on the test market'
          : '',
      });

      return invalidPrice;
    }

    return false;
  }

  toggleMiddleColumn(show: string) {
    this.setState({ [show]: !this.state[show] });
  }

  back = () => {
    this.setState({ tutorialStep: this.state.tutorialStep - 1 });
  };

  next = () => {
    const { market, updateModal, addAlert, removeAlert } = this.props;
    const {
      tutorialStep,
      selectedOrderProperties,
      selectedOutcomeId,
    } = this.state;
    if (!this.checkTutorialErrors(selectedOrderProperties)) {
      this.setState({ tutorialStep: tutorialStep + 1 });
    }

    if (tutorialStep === TRADING_TUTORIAL_STEPS.OPEN_ORDERS) {
      let outcomeId =
        selectedOutcomeId === null || selectedOutcomeId === undefined
          ? market.defaultSelectedOutcomeId
          : selectedOutcomeId;
      addAlert({
        name: PUBLICFILLORDER,
        toast: true,
        id: TRADING_TUTORIAL,
        uniqueId: TRADING_TUTORIAL,
        status: TXEventName.Success,
        params: {
          market: TRADING_TUTORIAL,
          amountFilled: TUTORIAL_QUANTITY,
          outcome: TRADING_TUTORIAL_OUTCOMES[outcomeId].description,
          orderCreator: '0x1',
          price: TUTORIAL_PRICE,
          amount: TUTORIAL_QUANTITY,
          orderType: BUY,
          marketInfo: {
            tickSize: market.tickSize,
            description: market.description,
            minPrice: market.minPrice,
            maxPrice: market.maxPrice,
            marketType: market.marketType,
          },
        },
      });
    } else if (tutorialStep === TRADING_TUTORIAL_STEPS.MY_FILLS) {
      removeAlert(TRADING_TUTORIAL, PUBLICFILLORDER);
    } else if (tutorialStep === TRADING_TUTORIAL_STEPS.POSITIONS) {
      updateModal({
        type: MODAL_TUTORIAL_OUTRO,
        back: () => {
          this.setState({
            tutorialStep: TRADING_TUTORIAL_STEPS.MARKET_DETAILS,
          });
        },
      });
    }
  };

  render() {
    const {
      isMarketLoading,
      currentTimestamp,
      description,
      marketId,
      market,
      history,
      preview,
      tradingTutorial,
      hotloadMarket,
      canHotload,
      orderBook,
      zeroXstatus,
      showMarketNotFound,
    } = this.props;
    const {
      selectedOutcomeId,
      extendOrderBook,
      extendTradeHistory,
      selectedOrderProperties,
      extendOutcomesList,
      extendOrders,
      tutorialStep,
      tutorialError,
      pane,
      hotPromise,
    } = this.state;
    if (isMarketLoading) {
      if (canHotload && !tradingTutorial && marketId && !hotPromise) {
        const newHotPromise = hotloadMarket(marketId).then(market => {
          if (!market) showMarketNotFound(history);
        });
        this.setState({ hotPromise: newHotPromise });
      }
      return (
        <div
          ref={node => {
            this.node = node;
          }}
          className={Styles.MarketView}
        />
      );
    }

    let outcomeOrderBook = this.EmptyOrderBook;
    const orderbookLoading = !orderBook;
    let outcomeId =
      selectedOutcomeId === null || selectedOutcomeId === undefined
        ? market.defaultSelectedOutcomeId
        : selectedOutcomeId;
    if (orderBook && orderBook[outcomeId]) {
      outcomeOrderBook = orderBook[outcomeId];
    }

    if (preview && !tradingTutorial) {
      outcomeId = getDefaultOutcomeSelected(market.marketType);
      outcomeOrderBook = formatOrderBook(orderBook[outcomeId]);
    }

    const networkId = tradingTutorial ? null : getNetworkId();
    const cat5 = this.findType();
    let orders = null;
    if (tradingTutorial) {
      outcomeOrderBook = formatOrderBook(orderBook[outcomeId]);
    }
    if (
      tradingTutorial &&
      tutorialStep === TRADING_TUTORIAL_STEPS.OPEN_ORDERS
    ) {
      orders = [
        {
          pending: true,
          id: 'trading-tutorial-pending-order',
          type: BUY,
          avgPrice: formatDai(TUTORIAL_PRICE),
          outcomeName: TRADING_TUTORIAL_OUTCOMES[outcomeId].description,
          unmatchedShares: formatShares(TUTORIAL_QUANTITY),
          tokensEscrowed: formatShares(0),
          sharesEscrowed: formatShares(0),
          creationTime: 0,
        },
      ];
    }

    let fills = null;
    if (tradingTutorial && tutorialStep === TRADING_TUTORIAL_STEPS.MY_FILLS) {
      fills = [
        {
          amount: createBigNumber(TUTORIAL_QUANTITY),
          logIndex: 1,
          marketDescription: market.description,
          marketId: market.id,
          originalQuantity: createBigNumber(TUTORIAL_QUANTITY),
          id: 'trading-tutorial-pending-order',
          type: BUY,
          price: createBigNumber(TUTORIAL_PRICE),
          outcome: TRADING_TUTORIAL_OUTCOMES[outcomeId].description,
          timestamp: convertUnixToFormattedDate(currentTimestamp),
          trades: [
            {
              amount: createBigNumber(TUTORIAL_QUANTITY),
              logIndex: 1,
              marketDescription: market.description,
              marketId: market.id,
              type: BUY,
              price: createBigNumber(TUTORIAL_PRICE),
              outcome: TRADING_TUTORIAL_OUTCOMES[outcomeId].description,
              timestamp: convertUnixToFormattedDate(currentTimestamp),
              transactionHash: '0xerjejfsdk',
            },
          ],
        },
      ];
    }

    let positions = null;
    if (tradingTutorial && tutorialStep === TRADING_TUTORIAL_STEPS.POSITIONS) {
      positions = [
        {
          type: LONG,
          outcomeName: TRADING_TUTORIAL_OUTCOMES[outcomeId].description,
          quantity: formatShares(TUTORIAL_QUANTITY),
          id: TRADING_TUTORIAL,
          outcomeId: outcomeId,
          totalValue: formatDai(TUTORIAL_QUANTITY),
          totalReturns: formatDai(TUTORIAL_QUANTITY),
          unrealizedNet: formatDai(TUTORIAL_QUANTITY),
          realizedNet: formatDai(TUTORIAL_QUANTITY),
          purchasePrice: formatDai(TUTORIAL_PRICE),
        },
      ];
    }

    let selected = 0;
    if (tradingTutorial && tutorialStep === TRADING_TUTORIAL_STEPS.MY_FILLS) {
      selected = 1;
    }
    if (tradingTutorial && tutorialStep === TRADING_TUTORIAL_STEPS.POSITIONS) {
      selected = 2;
    }

    const totalSteps = Object.keys(TRADING_TUTORIAL_STEPS).length / 2 - 2;

    if (
      tradingTutorial &&
      (tutorialStep === TRADING_TUTORIAL_STEPS.POSITIONS ||
        tutorialStep === TRADING_TUTORIAL_STEPS.MY_FILLS)
    ) {
      const orders = orderBook[TUTORIAL_OUTCOME] as TestTradingOrder[];
      const newOrderBook = orders.filter(order => !order.disappear);
      outcomeOrderBook = formatOrderBook(newOrderBook);
    }
    return (
      <div
        ref={node => {
          this.node = node;
        }}
        className={classNames(Styles.MarketView, {
          [Styles.Inactive]: preview,
        })}
      >
        {tradingTutorial && <span />}
        <HelmetTag
          {...MARKET_VIEW_HEAD_TAGS}
          title={parseMarketTitle(description)}
          ogTitle={parseMarketTitle(description)}
          twitterTitle={parseMarketTitle(description)}
        />
        <Media
          query={SMALL_MOBILE}
          onChange={matches => {
            if (matches && pane !== 'Market Info')
              this.setState({ pane: 'Market Info' });
          }}
        >
          {matches =>
            matches ? (
              <>
                <ModuleTabs
                  selected={0}
                  fillWidth
                  noBorder
                  id="mobileView"
                  scrollOver={matches && !preview}
                  leftButton={
                    <button
                      className={Styles.BackButton}
                      onClick={() => history.goBack()}
                    >
                      {LeftChevron}
                    </button>
                  }
                >
                  <ModulePane
                    label="Market Info"
                    onClickCallback={() =>
                      this.setState({ pane: 'Market Info' })
                    }
                  >
                    <div className={Styles.PaneContainer}>
                      <MarketHeader
                        marketId={marketId}
                        market={preview && market}
                        preview={preview}
                      />
                      <MarketOutcomesList
                        marketId={marketId}
                        market={market}
                        preview={preview}
                        selectedOutcomeId={outcomeId}
                        updateSelectedOutcome={this.updateSelectedOutcomeSwitch}
                        orderBook={orderBook}
                        updateSelectedOrderProperties={
                          this.updateSelectedOrderProperties
                        }
                      />
                      <ModuleTabs selected={0} fillForMobile>
                        <ModulePane status={zeroXstatus} label="Order Book">
                          <div className={Styles.Orders}>
                            <OrderBook
                              updateSelectedOrderProperties={
                                this.updateSelectedOrderProperties
                              }
                              marketId={marketId}
                              selectedOutcomeId={outcomeId}
                              toggle={this.toggleOrderBook}
                              extend={extendOrderBook}
                              hide={extendTradeHistory}
                              market={market}
                              initialLiquidity={preview}
                              orderBook={outcomeOrderBook}
                              showButtons
                              orderbookLoading={orderbookLoading}
                            />
                          </div>
                        </ModulePane>
                        <ModulePane label="Trade History">
                          <div className={Styles.History}>
                            {(marketId || preview) && (
                              <MarketTradeHistory
                                isArchived={market.isArchived}
                                marketId={marketId}
                                outcome={outcomeId}
                                toggle={this.toggleTradeHistory}
                                extend={extendTradeHistory}
                                hide={extendOrderBook}
                                marketType={market.marketType}
                              />
                            )}
                          </div>
                        </ModulePane>
                      </ModuleTabs>

                      <TradingForm
                        market={market}
                        initialLiquidity={preview && !tradingTutorial}
                        tradingTutorial={tradingTutorial}
                        selectedOrderProperties={selectedOrderProperties}
                        selectedOutcomeId={outcomeId}
                        updateSelectedOutcome={this.updateSelectedOutcome}
                        updateSelectedOrderProperties={
                          this.updateSelectedOrderProperties
                        }
                      />
                    </div>
                  </ModulePane>
                  <ModulePane
                    label="Charts"
                    onClickCallback={() => {
                      this.setState({ pane: 'Charts' });
                      this.node.children[0].children[1].scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      });
                    }}
                  >
                    <div className={Styles.PaneContainer}>
                      <h1>{description}</h1>
                      <div className={Styles.PriceHistory}>
                        <h3>Price History</h3>
                        {!preview && (
                          <PriceHistory
                            marketId={marketId}
                            market={preview && market}
                            selectedOutcomeId={outcomeId}
                          />
                        )}
                      </div>
                      <MarketChartsPane
                        marketId={!tradingTutorial && marketId}
                        market={preview && market}
                        isArchived={market.isArchived}
                        selectedOutcomeId={outcomeId}
                        currentTimestamp={currentTimestamp}
                        updateSelectedOrderProperties={
                          this.updateSelectedOrderProperties
                        }
                        preview={preview}
                        orderBook={outcomeOrderBook}
                      />
                    </div>
                  </ModulePane>
                  <ModulePane
                    label="Orders/Position"
                    onClickCallback={() =>
                      this.setState({ pane: 'Orders/Position' })
                    }
                  >
                    <div className={Styles.PaneContainer}>
                      <h1>{description}</h1>
                      <MarketOrdersPositionsTable
                        updateSelectedOrderProperties={
                          this.updateSelectedOrderProperties
                        }
                        marketId={marketId}
                        market={preview && market}
                        preview={preview}
                        tradingTutorial={tradingTutorial}
                        orders={orders}
                        fills={fills}
                      />
                    </div>
                  </ModulePane>
                </ModuleTabs>
                <MarketComments marketId={marketId} networkId={networkId} />
              </>
            ) : (
              <>
                <div
                  className={classNames(Styles.container, {
                    [Styles.Tutorial]: tradingTutorial,
                  })}
                >
                  <div
                    className={classNames(Styles.Header, {
                      [Styles.HeaderTutorial]:
                        tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.MARKET_DETAILS,
                    })}
                  >
                    <MarketHeader
                      marketId={marketId}
                      market={preview && market}
                      preview={preview}
                      next={this.next}
                      showTutorialData={
                        tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.MARKET_DATA
                      }
                      step={tutorialStep}
                      totalSteps={totalSteps}
                      text={TRADING_TUTORIAL_COPY[tutorialStep]}
                      showTutorialDetails={
                        tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.MARKET_DETAILS
                      }
                    />
                    {tradingTutorial &&
                      tutorialStep ===
                        TRADING_TUTORIAL_STEPS.MARKET_DETAILS && (
                        <TutorialPopUp
                          top
                          step={tutorialStep}
                          totalSteps={totalSteps}
                          text={TRADING_TUTORIAL_COPY[tutorialStep]}
                          next={this.next}
                        />
                      )}
                  </div>
                  <div
                    className={classNames(Styles.TradingForm, {
                      [Styles.TradingFormTutorial]:
                        tradingTutorial &&
                        ((tutorialStep >=
                          TRADING_TUTORIAL_STEPS.BUYING_SHARES &&
                          tutorialStep <= TRADING_TUTORIAL_STEPS.ORDER_VALUE) ||
                          tutorialStep === TRADING_TUTORIAL_STEPS.PLACE_ORDER),
                      [Styles.PlaceOrderTutorial]:
                        tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.PLACE_ORDER,
                      [Styles.SelectOutcomeTutorial]:
                        tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.SELECT_OUTCOME,
                      [Styles.BuyingSharesTutorial]:
                        tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.BUYING_SHARES,
                      [Styles.QuantityTutorial]:
                        tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.QUANTITY,
                      [Styles.LimitPriceTutorial]:
                        tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.LIMIT_PRICE,
                      [Styles.OrderValueTutorial]:
                        tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.ORDER_VALUE,
                    })}
                  >
                    <TradingForm
                      market={market}
                      initialLiquidity={preview && !tradingTutorial}
                      tradingTutorial={tradingTutorial}
                      selectedOrderProperties={selectedOrderProperties}
                      selectedOutcomeId={outcomeId}
                      updateSelectedOutcome={this.updateSelectedOutcome}
                      updateSelectedOrderProperties={
                        this.updateSelectedOrderProperties
                      }
                      tutorialNext={this.next}
                    />
                    {tradingTutorial &&
                      ((tutorialStep >= TRADING_TUTORIAL_STEPS.BUYING_SHARES &&
                        tutorialStep <= TRADING_TUTORIAL_STEPS.ORDER_VALUE) ||
                        tutorialStep ===
                          TRADING_TUTORIAL_STEPS.PLACE_ORDER) && (
                        <TutorialPopUp
                          left={
                            tutorialStep !== TRADING_TUTORIAL_STEPS.PLACE_ORDER
                          }
                          leftBottom={
                            tutorialStep === TRADING_TUTORIAL_STEPS.PLACE_ORDER
                          }
                          next={() => {
                            if (
                              tutorialStep ===
                              TRADING_TUTORIAL_STEPS.PLACE_ORDER
                            ) {
                              this.updateSelectedOrderProperties({
                                orderQuantity: '',
                                orderPrice: '',
                              });
                            }
                            this.next();
                          }}
                          step={tutorialStep}
                          totalSteps={totalSteps}
                          text={TRADING_TUTORIAL_COPY[tutorialStep]}
                          error={tutorialError !== '' ? tutorialError : null}
                        />
                      )}
                  </div>
                  <MarketOutcomesList
                    marketId={marketId}
                    market={market}
                    preview={preview}
                    selectedOutcomeId={outcomeId}
                    updateSelectedOutcome={this.updateSelectedOutcome}
                    hideOutcomes={cat5 ? !extendOutcomesList : false}
                    orderBook={orderBook}
                    updateSelectedOrderProperties={
                      this.updateSelectedOrderProperties
                    }
                  />
                  <div
                    className={classNames(Styles.ChartsPane, {
                      [Styles.Hide]: cat5 ? extendOutcomesList : extendOrders,
                    })}
                  >
                    <MarketChartsPane
                      marketId={!tradingTutorial && marketId}
                      isArchived={market.isArchived}
                      selectedOutcomeId={outcomeId}
                      updateSelectedOrderProperties={
                        this.updateSelectedOrderProperties
                      }
                      tradingTutorial={tradingTutorial}
                      toggle={
                        cat5
                          ? () => this.toggleMiddleColumn('extendOutcomesList')
                          : null
                      }
                      market={preview && market}
                      preview={preview}
                      orderBook={outcomeOrderBook}
                      canHotload={canHotload}
                      extendOutcomesList={extendOutcomesList}
                    />
                  </div>
                  <div
                    className={classNames(Styles.OrdersPane, {
                      [Styles.OpenOrdersTutorial]:
                        tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.OPEN_ORDERS,
                      [Styles.FillsTutorial]:
                        tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.MY_FILLS,
                      [Styles.PositionsTutorial]:
                        tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.POSITIONS,
                    })}
                  >
                    <MarketOrdersPositionsTable
                      updateSelectedOrderProperties={
                        this.updateSelectedOrderProperties
                      }
                      marketId={marketId}
                      toggle={
                        cat5
                          ? null
                          : () => this.toggleMiddleColumn('extendOrders')
                      }
                      market={preview && market}
                      preview={preview}
                      tradingTutorial={tradingTutorial}
                      orders={orders}
                      fills={fills}
                      positions={positions}
                      selected={selected}
                    />
                    {tradingTutorial &&
                      (tutorialStep === TRADING_TUTORIAL_STEPS.OPEN_ORDERS ||
                        tutorialStep === TRADING_TUTORIAL_STEPS.MY_FILLS ||
                        tutorialStep === TRADING_TUTORIAL_STEPS.POSITIONS) && (
                        <TutorialPopUp
                          bottom
                          next={this.next}
                          step={tutorialStep}
                          totalSteps={totalSteps}
                          text={TRADING_TUTORIAL_COPY[tutorialStep]}
                        />
                      )}
                  </div>
                  <div className={Styles.OrderBookAndHistory}>
                    <div
                      className={classNames(Styles.OrderBook, {
                        [Styles.hide]: extendTradeHistory,
                        [Styles.show]: extendOrderBook,
                        [Styles.OrderBookTutorial]:
                          tradingTutorial &&
                          tutorialStep === TRADING_TUTORIAL_STEPS.ORDER_BOOK,
                      })}
                    >
                      <OrderBook
                        updateSelectedOrderProperties={
                          this.updateSelectedOrderProperties
                        }
                        marketId={marketId}
                        selectedOutcomeId={outcomeId}
                        toggle={this.toggleOrderBook}
                        extend={extendOrderBook}
                        hide={extendTradeHistory}
                        market={market}
                        initialLiquidity={preview}
                        orderBook={outcomeOrderBook}
                        orderbookLoading={orderbookLoading}
                      />
                      {tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.ORDER_BOOK && (
                          <TutorialPopUp
                            right
                            next={this.next}
                            step={tutorialStep}
                            totalSteps={totalSteps}
                            text={TRADING_TUTORIAL_COPY[tutorialStep]}
                          />
                        )}
                    </div>
                    <div
                      className={classNames(Styles.History, {
                        [Styles.hide]: extendOrderBook,
                        [Styles.show]: extendTradeHistory,
                      })}
                    >
                      {(marketId || preview) && (
                        <MarketTradeHistory
                          marketId={marketId}
                          outcome={outcomeId}
                          isArchived={market.isArchived}
                          toggle={this.toggleTradeHistory}
                          extend={extendTradeHistory}
                          marketType={market.marketType}
                          hide={extendOrderBook}
                          tradingTutorial={tradingTutorial}
                          groupedTradeHistory={market.groupedTradeHistory}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {!tradingTutorial && (
                  <MarketComments marketId={marketId} networkId={networkId} />
                )}
              </>
            )
          }
        </Media>
      </div>
    );
  }
}
