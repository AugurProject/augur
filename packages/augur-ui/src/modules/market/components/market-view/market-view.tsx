/* eslint-disable jsx-a11y/no-static-element-interaction */

import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import classNames from 'classnames';
import Media from 'react-media';

import { FindReact } from 'utils/find-react';
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
  TRADING_TUTORIAL,
  TRADING_TUTORIAL_STEPS,
  TRADING_TUTORIAL_COPY,
  MODAL_TUTORIAL_OUTRO,
  MODAL_TUTORIAL_INTRO,
  TUTORIAL_QUANTITY,
  TUTORIAL_PRICE,
  TRADING_TUTORIAL_OUTCOMES,
} from 'modules/common/constants';
import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import PriceHistory from 'modules/market-charts/containers/price-history';
import Styles from 'modules/market/components/market-view/market-view.styles.less';
import { LeftChevron } from 'modules/common/icons';
import { TEMP_TABLET } from 'modules/common/constants';
import {
  MarketData,
  OutcomeFormatted,
  DefaultOrderProperties,
} from 'modules/types';
import { getDefaultOutcomeSelected } from 'utils/convert-marketInfo-marketData';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { SquareDropdown } from 'modules/common/selection';
import { TutorialPopUp } from '../common/tutorial-pop-up';
import { formatShares, formatDai } from 'utils/format-number';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { createBigNumber } from 'utils/create-big-number';
import { TXEventName } from '@augurproject/sdk/src';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';

interface MarketViewProps {
  isMarketLoading: boolean;
  closeMarketLoadingModal: Function;
  market: MarketData;
  marketId: string;
  marketReviewSeen: boolean;
  marketReviewModal: Function;
  currentTimestamp: number;
  isConnected: boolean;
  loadFullMarket: Function;
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
  removeAlert: Function;
  outcomeId?: number;
}

interface DefaultOrderPropertiesMap {
  [outcomeId: number]: DefaultOrderProperties;
}
interface MarketViewState {
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

  constructor(props: MarketViewProps) {
    super(props);

    const cat5 = this.findType();

    this.state = {
      introShowing: false,
      tutorialStep: TRADING_TUTORIAL_STEPS.INTRO_MODAL,
      extendOrderBook: false,
      extendTradeHistory: false,
      extendOutcomesList: cat5 ? true : false,
      extendOrders: false,
      selectedOrderProperties: this.DEFAULT_ORDER_PROPERTIES,
      selectedOutcomeId: props.outcomeId !== null ? props.outcomeId : (props.market
        ? props.market.defaultSelectedOutcomeId
        : undefined),
      fixedPrecision: 4,
      tutorialError: '',
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
      loadFullMarket,
      marketId,
      loadMarketTradingHistory,
      tradingTutorial,
    } = this.props;

    this.tradingTutorialWidthCheck();

    if (isConnected && !!marketId && !tradingTutorial) {
      loadFullMarket(marketId);
      loadMarketTradingHistory(marketId);
    }
  }

  componentDidMount() {
    this.node && this.node.scrollIntoView();
    window.scrollTo(0, 1);

    const { isMarketLoading, showMarketLoadingModal } = this.props;

    if (isMarketLoading) {
      showMarketLoadingModal();
    }
  }

  componentDidUpdate(prevProps: MarketViewProps) {
    const {
      isConnected,
      marketId,
      isMarketLoading,
      closeMarketLoadingModal,
      tradingTutorial,
      updateModal,
      selectedOutcomeId
    } = prevProps;

    if (this.props.outcomeId !== prevProps.outcomeId && this.props.outcomeId !== null) {
      this.setState({selectedOutcomeId: this.props.outcomeId})
    }

    if (tradingTutorial) {
      if (
        !isMarketLoading &&
        !this.state.introShowing &&
        this.state.tutorialStep === TRADING_TUTORIAL_STEPS.INTRO_MODAL
      ) {
        updateModal({
          type: MODAL_TUTORIAL_INTRO,
          next: this.next,
        });
        this.setState({ introShowing: true });
      }
      return;
    }

    if (
      isConnected !== this.props.isConnected &&
      (this.props.isConnected &&
        !!this.props.marketId &&
        (this.props.marketId !== marketId || this.props.marketType === undefined))
    ) {
      this.props.loadFullMarket(this.props.marketId);
      this.props.loadMarketTradingHistory(marketId);
    }
    if (isMarketLoading !== this.props.isMarketLoading) {
      closeMarketLoadingModal();
    }
  }

  tradingTutorialWidthCheck() {
    if (this.props.tradingTutorial && window.innerWidth <= 1280) {
      // TEMP_TABLET
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

  updateSelectedOutcomeSwitch(selectedOutcomeId) {
    this.updateSelectedOutcome(selectedOutcomeId);

    FindReact(document.getElementById('tabs_mobileView')).handleClick(null, 1);
  }

  updateSelectedOutcome(selectedOutcomeId) {
    if (selectedOutcomeId !== this.state.selectedOutcomeId) {
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

    this.setState({
      selectedOrderProperties,
    });
  }

  checkTutorialErrors(selectedOrderProperties) {
    if (this.state.tutorialStep === TRADING_TUTORIAL_STEPS.QUANTITY) {
      const invalidQuantity = parseFloat(selectedOrderProperties.orderQuantity) !== TUTORIAL_QUANTITY;
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
      const invalidPrice = parseFloat(selectedOrderProperties.orderPrice) !== TUTORIAL_PRICE;
      this.setState({
        tutorialError:
         invalidPrice
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
    if (this.state.tutorialStep === TRADING_TUTORIAL_STEPS.ORDER_BOOK) {
      // Scroll to bottom since next tutorial card will be below the fold.
      document.querySelector('#mainContent').scrollTo(0, document.body.scrollHeight);
    }

    if (!this.checkTutorialErrors(this.state.selectedOrderProperties)) {
      this.setState({ tutorialStep: this.state.tutorialStep + 1 });
    }
    const { market, updateModal, removeAlert } = this.props;

    if (this.state.tutorialStep === TRADING_TUTORIAL_STEPS.OPEN_ORDERS) {
      const { selectedOutcomeId } = this.state;
      let outcomeId =
      selectedOutcomeId === null || selectedOutcomeId === undefined
        ? market.defaultSelectedOutcomeId
        : selectedOutcomeId;
      this.props.addAlert({
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
    } else if (this.state.tutorialStep === TRADING_TUTORIAL_STEPS.MY_FILLS) {
      removeAlert(TRADING_TUTORIAL, PUBLICFILLORDER);
    } else if (this.state.tutorialStep === TRADING_TUTORIAL_STEPS.POSITIONS) {
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
      outcomes,
      market,
      history,
      preview,
      sortedOutcomes,
      tradingTutorial,
      hotloadMarket,
      canHotload,
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
    } = this.state;
    if (isMarketLoading) {
      if (canHotload && !tradingTutorial) hotloadMarket(marketId);
      return (
        <div
          ref={node => {
            this.node = node;
          }}
          className={Styles.MarketView}
        />
      );
    }

    let outcomeId =
      selectedOutcomeId === null || selectedOutcomeId === undefined
        ? market.defaultSelectedOutcomeId
        : selectedOutcomeId;
    if (preview && !tradingTutorial) {
      outcomeId = getDefaultOutcomeSelected(market.marketType);
    }
    const outcome = outcomes.find(
      outcomeValue => outcomeValue.id === outcomeId
    );

    const networkId = getNetworkId();

    const cat5 = this.findType();
    const defaultOutcome = outcome ? outcome.id : 2;

    let orders = null;
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

    let orderBookMarket = market;

    if (tradingTutorial && (tutorialStep === TRADING_TUTORIAL_STEPS.POSITIONS || tutorialStep === TRADING_TUTORIAL_STEPS.MY_FILLS)) {
      let orderBook = market.orderBook;
      orderBook[outcomeId] = orderBook[selectedOutcomeId].filter(order => !order.disappear);
      orderBookMarket = {
        ...market,
        orderBook
      }
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
        <Helmet>
          <title>{parseMarketTitle(description)}</title>
        </Helmet>
        <Media query={TEMP_TABLET}>
          {matches =>
            matches ? (
              <>
                <ModuleTabs
                  selected={0}
                  fillWidth
                  noBorder
                  id="mobileView"
                  scrollOver
                  leftButton={
                    <button
                      className={Styles.MarketView__button}
                      onClick={() => history.goBack()}
                    >
                      {LeftChevron}
                    </button>
                  }
                >
                  <ModulePane label="Market Info">
                    <div
                      className={Styles['MarketView__paneContainer--mobile']}
                    >
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
                      />
                      <div className={Styles.MarketView__priceHistoryChart}>
                        <h3>Price History</h3>
                        {!preview && <PriceHistory
                          marketId={marketId}
                          market={preview && market}
                          selectedOutcomeId={outcomeId}
                        />}
                      </div>
                    </div>
                  </ModulePane>
                  <ModulePane
                    label="Trade"
                    onClickCallback={() => {
                      this.node.children[0].children[1].scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      });
                    }}
                  >
                    <div
                      className={classNames(
                        Styles['MarketView__paneContainer--mobile'],
                        Styles.TradesMobile
                      )}
                    >
                      <div className={Styles.OutcomeSelectionArea}>
                        <h1>{description}</h1>
                        <SquareDropdown
                          defaultValue={defaultOutcome}
                          onChange={value => this.updateSelectedOutcome(value)}
                          options={sortedOutcomes
                            .filter(outcome => outcome.isTradeable)
                            .map(outcome => ({
                              label: outcome.description,
                              value: outcome.id,
                            }))}
                          large
                          showColor
                        />
                      </div>
                      <ModuleTabs selected={0} fillForMobile>
                        <ModulePane label="Order Book">
                          <div className={Styles.MarketView__orders}>
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
                            />
                          </div>
                        </ModulePane>
                        <ModulePane label="Trade History">
                          <div className={Styles.MarketView__history}>
                            <div
                              className={Styles.MarketView__component__history}
                            >
                              {(marketId || preview) && (
                                <MarketTradeHistory
                                  marketId={marketId}
                                  outcome={outcomeId}
                                  toggle={this.toggleTradeHistory}
                                  extend={extendTradeHistory}
                                  hide={extendOrderBook}
                                  marketType={market.marketType}
                                />
                              )}
                            </div>
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

                      <MarketChartsPane
                        marketId={!tradingTutorial && marketId}
                        market={preview && market}
                        selectedOutcomeId={outcomeId}
                        currentTimestamp={currentTimestamp}
                        updateSelectedOrderProperties={
                          this.updateSelectedOrderProperties
                        }
                        preview={preview}
                      />
                    </div>
                  </ModulePane>
                  <ModulePane label="Orders/Position">
                    <div
                      className={classNames(
                        Styles['MarketView__paneContainer--mobile']
                      )}
                    >
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
                <div className={classNames(Styles.MarketView__parent, {[Styles.Tutorial]: tradingTutorial})}>
                  <section className={Styles.MarketView__body}>
                    <div
                      className={classNames({
                        [Styles.HeaderTutorial]:
                          tradingTutorial &&
                          tutorialStep ===
                            TRADING_TUTORIAL_STEPS.MARKET_DETAILS,
                      })}
                    >
                      <MarketHeader
                        marketId={marketId}
                        market={preview && market}
                        preview={preview}
                        next={this.next}
                        showTutorialData={tradingTutorial && tutorialStep === TRADING_TUTORIAL_STEPS.MARKET_DATA}
                        step={tutorialStep}
                        totalSteps={totalSteps}
                        text={TRADING_TUTORIAL_COPY[tutorialStep]}
                        showTutorialDetails={tradingTutorial &&
                          tutorialStep ===
                            TRADING_TUTORIAL_STEPS.MARKET_DETAILS}
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

                    <div className={Styles.MarketView__firstColumn}>
                      <div className={Styles.MarketView__firstRow}>
                        <div
                          className={classNames(Styles.MarketView__component, {
                            [Styles.TradingFormTutorial]:
                              tradingTutorial &&
                              ((tutorialStep >=
                                TRADING_TUTORIAL_STEPS.BUYING_SHARES &&
                                tutorialStep <=
                                  TRADING_TUTORIAL_STEPS.ORDER_VALUE) ||
                                tutorialStep ===
                                  TRADING_TUTORIAL_STEPS.PLACE_ORDER),
                            [Styles.PlaceOrderTutorial]:
                              tradingTutorial &&
                              tutorialStep ===
                                TRADING_TUTORIAL_STEPS.PLACE_ORDER,
                            [Styles.SelectOutcomeTutorial]:
                              tradingTutorial &&
                              tutorialStep ===
                                TRADING_TUTORIAL_STEPS.SELECT_OUTCOME,
                            [Styles.BuyingSharesTutorial]:
                              tradingTutorial &&
                              tutorialStep ===
                                TRADING_TUTORIAL_STEPS.BUYING_SHARES,
                            [Styles.QuantityTutorial]:
                              tradingTutorial &&
                              tutorialStep === TRADING_TUTORIAL_STEPS.QUANTITY,
                            [Styles.LimitPriceTutorial]:
                              tradingTutorial &&
                              tutorialStep ===
                                TRADING_TUTORIAL_STEPS.LIMIT_PRICE,
                            [Styles.OrderValueTutorial]:
                              tradingTutorial &&
                              tutorialStep ===
                                TRADING_TUTORIAL_STEPS.ORDER_VALUE,
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
                            ((tutorialStep >=
                              TRADING_TUTORIAL_STEPS.BUYING_SHARES &&
                              tutorialStep <=
                                TRADING_TUTORIAL_STEPS.ORDER_VALUE) ||
                              tutorialStep ===
                                TRADING_TUTORIAL_STEPS.PLACE_ORDER) && (
                              <TutorialPopUp
                                left={
                                  tutorialStep !==
                                  TRADING_TUTORIAL_STEPS.PLACE_ORDER
                                }
                                leftBottom={
                                  tutorialStep ===
                                  TRADING_TUTORIAL_STEPS.PLACE_ORDER
                                }
                                next={() => {
                                  if (tutorialStep === TRADING_TUTORIAL_STEPS.PLACE_ORDER) {
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
                                error={
                                  tutorialError !== '' ? tutorialError : null
                                }
                              />
                            )}
                        </div>
                        <div className={Styles.MarketView__innerSecondColumn}>
                          <div className={Styles.MarketView__component}>
                            <MarketOutcomesList
                              marketId={marketId}
                              market={market}
                              preview={preview}
                              selectedOutcomeId={outcomeId}
                              updateSelectedOutcome={this.updateSelectedOutcome}
                              hideOutcomes={cat5 ? !extendOutcomesList : false}
                            />
                          </div>
                          <div
                            className={classNames(
                              Styles.MarketView__component,
                              {
                                [Styles.Hide]: cat5
                                  ? extendOutcomesList
                                  : extendOrders,
                              }
                            )}
                          >
                            <MarketChartsPane
                              marketId={!tradingTutorial && marketId}
                              selectedOutcomeId={outcomeId}
                              updateSelectedOrderProperties={
                                this.updateSelectedOrderProperties
                              }
                              tradingTutorial={tradingTutorial}
                              toggle={
                                cat5
                                  ? () =>
                                      this.toggleMiddleColumn(
                                        'extendOutcomesList'
                                      )
                                  : null
                              }
                              market={preview && market}
                              preview={preview}
                            />
                          </div>
                          <div
                            className={classNames(
                              Styles.MarketView__component,
                              {
                                [Styles.OpenOrdersTutorial]:
                                  tradingTutorial &&
                                  tutorialStep ===
                                    TRADING_TUTORIAL_STEPS.OPEN_ORDERS,
                                [Styles.FillsTutorial]:
                                  tradingTutorial &&
                                  tutorialStep ===
                                    TRADING_TUTORIAL_STEPS.MY_FILLS,
                                [Styles.PositionsTutorial]:
                                  tradingTutorial &&
                                  tutorialStep ===
                                    TRADING_TUTORIAL_STEPS.POSITIONS,
                              }
                            )}
                          >
                            <MarketOrdersPositionsTable
                              updateSelectedOrderProperties={
                                this.updateSelectedOrderProperties
                              }
                              marketId={marketId}
                              toggle={
                                cat5
                                  ? null
                                  : () =>
                                      this.toggleMiddleColumn('extendOrders')
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
                              (tutorialStep ===
                                TRADING_TUTORIAL_STEPS.OPEN_ORDERS ||
                                tutorialStep ===
                                  TRADING_TUTORIAL_STEPS.MY_FILLS ||
                                tutorialStep ===
                                  TRADING_TUTORIAL_STEPS.POSITIONS) && (
                                <TutorialPopUp
                                  bottom
                                  next={this.next}
                                  step={tutorialStep}
                                  totalSteps={totalSteps}
                                  text={TRADING_TUTORIAL_COPY[tutorialStep]}
                                />
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className={Styles.MarketView__secondColumn}>
                    <div
                      className={classNames(
                        Styles.MarketView__component,
                        Styles.MarketView__orders,
                        {
                          [Styles.MarketView__hide]: extendTradeHistory,
                          [Styles.MarketView__show]: extendOrderBook,
                          [Styles.OrderBookTutorial]:
                            tradingTutorial &&
                            tutorialStep === TRADING_TUTORIAL_STEPS.ORDER_BOOK,
                        }
                      )}
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
                        market={orderBookMarket}
                        initialLiquidity={preview}
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
                      className={classNames(
                        Styles.MarketView__component,
                        Styles.MarketView__history,
                        {
                          [Styles.MarketView__hide]: extendOrderBook,
                          [Styles.MarketView__show]: extendTradeHistory,
                        }
                      )}
                    >
                      <div className={Styles.MarketView__component__history}>
                        {(marketId || preview) && (
                          <MarketTradeHistory
                            marketId={marketId}
                            outcome={outcomeId}
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
                </div>
                {!tradingTutorial && <MarketComments marketId={marketId} networkId={networkId} />}
              </>
            )
          }
        </Media>
      </div>
    );
  }
}
