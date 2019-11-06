/* eslint-disable jsx-a11y/no-static-element-interaction */

import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import classNames from 'classnames';
import Media from 'react-media';

import { FindReact } from 'utils/find-react';
import MarketHeader from 'modules/market/containers/market-header';
import MarketOrdersPositionsTable from 'modules/market/containers/market-orders-positions-table';
import MarketOutcomesList from 'modules/market/containers/market-outcomes-list';
import TradingForm from 'modules/market/containers/trading-form';
import OrderBook from 'modules/market-charts/containers/order-book';
import MarketChartsPane from 'modules/market-charts/containers/market-charts-pane';
import parseMarketTitle from 'modules/markets/helpers/parse-market-title';
import MarketTradeHistory from 'modules/market/containers/market-trade-history';
import MarketComments from 'modules/market/containers/market-comments';
import {
  CATEGORICAL,
  BUY,
  MODAL_TRADING_OVERLAY,
  TRADING_TUTORIAL,
  YES_NO_YES_OUTCOME_NAME,
  PUBLICFILLORDER,
  LONG,
  YES_NO_YES_ID,
  TRADING_TUTORIAL,
  TRADING_TUTORIAL_STEPS,
  TRADING_TUTORIAL_COPY,
} from 'modules/common/constants';
import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import MarketOutcomesChart from 'modules/market-charts/containers/market-outcomes-chart';
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
}

const TUTORIAL_QUANTITY = 100;
const TUTORIAL_PRICE = 0.4;

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
      tutorialStep: TRADING_TUTORIAL_STEPS.MARKET_DETAILS,
      extendOrderBook: false,
      extendTradeHistory: false,
      extendOutcomesList: cat5 ? true : false,
      extendOrders: false,
      selectedOrderProperties: this.DEFAULT_ORDER_PROPERTIES,
      selectedOutcomeId: props.market
        ? props.market.defaultSelectedOutcomeId
        : undefined,
      fixedPrecision: 4,
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
    this.showModal = this.showModal.bind(this);
    this.toggleOrderBook = this.toggleOrderBook.bind(this);
    this.toggleTradeHistory = this.toggleTradeHistory.bind(this);
    this.updateSelectedOutcomeSwitch = this.updateSelectedOutcomeSwitch.bind(
      this
    );
    this.showMarketDisclaimer = this.showMarketDisclaimer.bind(this);
    this.toggleMiddleColumn = this.toggleMiddleColumn.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      isConnected,
      loadFullMarket,
      marketId,
      loadMarketTradingHistory,
      tradingTutorial,
    } = this.props;
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
    } else {
      this.showMarketDisclaimer();
    }
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const {
      isConnected,
      marketId,
      isMarketLoading,
      closeMarketLoadingModal,
      tradingTutorial,
    } = this.props;

    if (tradingTutorial) {
      return;
    }

    if (
      isConnected !== nextProps.isConnected &&
      (nextProps.isConnected &&
        !!nextProps.marketId &&
        (nextProps.marketId !== marketId || nextProps.marketType === undefined))
    ) {
      nextProps.loadFullMarket(nextProps.marketId);
      nextProps.loadMarketTradingHistory(marketId);
    }
    if (isMarketLoading !== nextProps.isMarketLoading) {
      closeMarketLoadingModal();
      this.showMarketDisclaimer();
    }
  }

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
    this.setState({
      selectedOrderProperties,
    });
  }

  showModal() {
    const { marketId, outcomes, market, updateModal } = this.props;
    const { selectedOrderProperties, selectedOutcomeId } = this.state;

    updateModal({
      type: MODAL_TRADING_OVERLAY,
      market,
      selectedOrderProperties,
      selectedOutcomeId,
      updateSelectedOutcome: this.updateSelectedOutcomeSwitch,
      updateSelectedOrderProperties: this.updateSelectedOrderProperties,
      outcomes,
      marketId,
    });
  }

  toggleMiddleColumn(show: string) {
    this.setState({ [show]: !this.state[show] });
  }

  back = () => {
    this.setState({ tutorialStep: this.state.tutorialStep - 1 });
  };

  next = () => {
    this.setState({ tutorialStep: this.state.tutorialStep + 1 });

    if (this.state.tutorialStep === TRADING_TUTORIAL_STEPS.OPEN_ORDERS) {
      const { market, currentTimestamp } = this.props;
      this.props.addAlert({
        name: PUBLICFILLORDER,
        toast: true,
        id: 'trading_alert' + currentTimestamp,
        status: TXEventName.Success,
        params: {
          market: TRADING_TUTORIAL,
          amountFilled: TUTORIAL_QUANTITY,
          outcome: YES_NO_YES_OUTCOME_NAME,
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
    if (preview) {
      outcomeId = getDefaultOutcomeSelected(market.marketType);
    }
    const outcome = outcomes.find(
      outcomeValue => outcomeValue.id === outcomeId
    );
    const selectedOutcomeName: string = outcome ? outcome.description : '';

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
          outcomeName: YES_NO_YES_OUTCOME_NAME,
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
          outcome: YES_NO_YES_OUTCOME_NAME,
          timestamp: convertUnixToFormattedDate(currentTimestamp),
          trades: [
            {
              amount: createBigNumber(TUTORIAL_QUANTITY),
              logIndex: 1,
              marketDescription: market.description,
              marketId: market.id,
              type: BUY,
              price: createBigNumber(TUTORIAL_PRICE),
              outcome: YES_NO_YES_OUTCOME_NAME,
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
          outcomeName: YES_NO_YES_OUTCOME_NAME,
          quantity: formatShares(TUTORIAL_QUANTITY),
          id: TRADING_TUTORIAL,
          outcomeId: YES_NO_YES_ID,
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
                        <MarketOutcomesChart
                          marketId={marketId}
                          market={preview && market}
                          selectedOutcomeId={outcomeId}
                        />
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
                                />
                              )}
                            </div>
                          </div>
                        </ModulePane>
                      </ModuleTabs>

                      <TradingForm
                        market={market}
                        initialLiquidity={preview && !initialLiquidity}
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
                        marketId={tradingTutorial && marketId}
                        market={preview && market}
                        preview={preview}
                        tradingTutorial={tradingTutorial}
                        orders={orders}
                        fills={fillls}
                      />
                    </div>
                  </ModulePane>
                </ModuleTabs>
                <MarketComments marketId={marketId} networkId={networkId} />
              </>
            ) : (
              <>
                <div className={Styles.MarketView__parent}>
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
                        back={this.back}
                      />
                      {tradingTutorial &&
                        tutorialStep ===
                          TRADING_TUTORIAL_STEPS.MARKET_DETAILS && (
                          <TutorialPopUp
                            top
                            step={tutorialStep}
                            totalSteps={
                              Object.keys(TRADING_TUTORIAL_STEPS).length / 2
                            }
                            text={TRADING_TUTORIAL_COPY[tutorialStep]}
                            next={this.next}
                            back={this.back}
                          />
                        )}
                    </div>

                    <div className={Styles.MarketView__firstColumn}>
                      <div className={Styles.MarketView__firstRow}>
                        <div
                          className={classNames(Styles.MarketView__component, {
                            [Styles.TradingFormTutorial]:
                              tradingTutorial &&
                              tutorialStep ===
                                TRADING_TUTORIAL_STEPS.BUYING_SHARES,
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
                          />
                          {tradingTutorial &&
                            tutorialStep ===
                              TRADING_TUTORIAL_STEPS.BUYING_SHARES && (
                              <TutorialPopUp
                                left
                                next={this.next}
                                back={this.back}
                                step={tutorialStep}
                                totalSteps={
                                  Object.keys(TRADING_TUTORIAL_STEPS).length / 2
                                }
                                text={TRADING_TUTORIAL_COPY[tutorialStep]}
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
                                  back={this.back}
                                  step={tutorialStep}
                                  totalSteps={
                                    Object.keys(TRADING_TUTORIAL_STEPS).length /
                                    2
                                  }
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
                        market={market}
                        initialLiquidity={preview}
                      />
                      {tradingTutorial &&
                        tutorialStep === TRADING_TUTORIAL_STEPS.ORDER_BOOK && (
                          <TutorialPopUp
                            right
                            next={this.next}
                            back={this.back}
                            step={tutorialStep}
                            totalSteps={
                              Object.keys(TRADING_TUTORIAL_STEPS).length / 2
                            }
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
                            hide={extendOrderBook}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <MarketComments marketId={marketId} networkId={networkId} />
              </>
            )
          }
        </Media>
      </div>
    );
  }
}
