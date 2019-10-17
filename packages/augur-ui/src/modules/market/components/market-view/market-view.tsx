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
} from 'modules/common/constants';
import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import MarketOutcomesChart from 'modules/market-charts/containers/market-outcomes-chart';
import Styles from 'modules/market/components/market-view/market-view.styles.less';
import { LeftChevron } from 'modules/common/icons';
import { TEMP_TABLET } from 'modules/common/constants';
import { MarketData, OutcomeFormatted, DefaultOrderProperties } from 'modules/types';
import { getDefaultOutcomeSelected } from 'utils/convert-marketInfo-marketData';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { SquareDropdown } from 'modules/common/selection';

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
    } = this.props;
    if (isConnected && !!marketId) {
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
    else {
      this.showMarketDisclaimer();
    }
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const {
      isConnected,
      marketId,
      isMarketLoading,
      closeMarketLoadingModal,
    } = this.props;
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
      sortedOutcomes
    } = this.props;
    const {
      selectedOutcomeId,
      extendOrderBook,
      extendTradeHistory,
      selectedOrderProperties,
      extendOutcomesList,
      extendOrders,
    } = this.state;
    if (isMarketLoading) {
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

    return (
      <div
        ref={node => {
          this.node = node;
        }}
        className={classNames(Styles.MarketView, {
          [Styles.Inactive]: preview,
        })}
      >
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
                        initialLiquidity={preview}
                        selectedOrderProperties={selectedOrderProperties}
                        selectedOutcomeId={outcomeId}
                        updateSelectedOutcome={this.updateSelectedOutcome}
                        updateSelectedOrderProperties={
                          this.updateSelectedOrderProperties
                        }
                      />

                      <MarketChartsPane
                        marketId={marketId}
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
                      <MarketHeader
                        marketId={marketId}
                        market={preview && market}
                        preview={preview}
                      />
                      <div className={Styles.MarketView__firstColumn}>
                        <div className={Styles.MarketView__firstRow}>
                          <div className={Styles.MarketView__component}>
                            <TradingForm
                              market={market}
                              initialLiquidity={preview}
                              selectedOrderProperties={selectedOrderProperties}
                              selectedOutcomeId={outcomeId}
                              updateSelectedOutcome={this.updateSelectedOutcome}
                              updateSelectedOrderProperties={
                                this.updateSelectedOrderProperties
                              }
                            />
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
                                marketId={marketId}
                                selectedOutcomeId={outcomeId}
                                updateSelectedOrderProperties={
                                  this.updateSelectedOrderProperties
                                }
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
                            <div className={Styles.MarketView__component}>
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
                              />
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
