/* eslint-disable jsx-a11y/no-static-element-interaction */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import classNames from "classnames";
import Media from "react-media";

import { FindReact } from "utils/find-react";
import MarketHeader from "modules/market/containers/market-header";
import MarketOrdersPositionsTable from "modules/market/containers/market-orders-positions-table";
import MarketOutcomesList from "modules/market/containers/market-outcomes-list";
import TradingForm from "modules/market/containers/trading-form";
import OrderBook from "modules/market-charts/containers/order-book";
import MarketChartsPane from "modules/market-charts/containers/market-charts-pane";
import parseMarketTitle from "modules/markets/helpers/parse-market-title";
import MarketTradeHistory from "modules/market/containers/market-trade-history";
import {
  CATEGORICAL,
  BUY,
  MODAL_TRADING_OVERLAY,
  MARKET_REVIEWS,
} from "modules/common/constants";
import ModuleTabs from "modules/market/components/common/module-tabs/module-tabs";
import ModulePane from "modules/market/components/common/module-tabs/module-pane";
import MarketOutcomeSelector from "modules/market/components/market-view/market-outcome-selector";
import MarketOutcomesChart from "modules/market-charts/containers/market-outcomes-chart";
import Styles from "modules/market/components/market-view/market-view.styles.less";
import { LeftChevron } from "modules/common/icons";
import { TEMP_TABLET } from "modules/common/constants";
import { MarketInfoOutcome } from "@augurproject/sdk/build/state/getter/Markets";
import { MarketData } from "modules/types";

interface MarketViewProps {
  market: MarketData,
  marketId: string,
  marketReviewSeen: boolean,
  marketReviewModal: Function,
  currentTimestamp: number,
  isConnected: boolean,
  loadFullMarket: Function,
  loadMarketTradingHistory: Function,
  description: string,
  marketType: string,
  outcomes: Array<MarketInfoOutcome>,
  updateModal: Function,
  history: object,
};

interface DefaultOrderProperties {
  orderPrice: string,
  orderQuantity: string,
  selectedNav: string,
}

interface DefaultOrderPropertiesMap {
  [outcomeId: number]: DefaultOrderProperties,
}
interface MarketViewState {
  extendOrderBook: boolean,
  extendTradeHistory: boolean,
  selectedOrderProperties: DefaultOrderProperties,
  selectedOutcomeId: string,
  fixedPrecision: number,
  selectedOutcomeProperties: DefaultOrderPropertiesMap,
}
export default class MarketView extends Component<MarketViewProps, MarketViewState> {
  static defaultProps = {
    marketType: undefined,
    outcomes: [],
    currentTimestamp: 0,
  };

  DEFAULT_ORDER_PROPERTIES = { orderPrice: "", orderQuantity: "", selectedNav: BUY};
  node: any;

  constructor(props) {
    super(props);

    this.state = {
      extendOrderBook: false,
      extendTradeHistory: false,
      selectedOrderProperties: this.DEFAULT_ORDER_PROPERTIES,
      selectedOutcomeId: "2",
      fixedPrecision: 4,
      selectedOutcomeProperties: {
        1: {
          ...this.DEFAULT_ORDER_PROPERTIES
        }
      }
    };

    this.updateSelectedOutcome = this.updateSelectedOutcome.bind(this);
    this.updateSelectedOrderProperties = this.updateSelectedOrderProperties.bind(
      this
    );
    this.showModal = this.showModal.bind(this);
    this.toggleOrderBook = this.toggleOrderBook.bind(this);
    this.toggleTradeHistory = this.toggleTradeHistory.bind(this);
    this.updateSelectedOutcomeSwitch = this.updateSelectedOutcomeSwitch.bind(this);
  }

  componentWillMount() {
    const {
      isConnected,
      loadFullMarket,
      marketId,
      loadMarketTradingHistory
    } = this.props;
    if (isConnected && !!marketId) {
      loadFullMarket(marketId);
      loadMarketTradingHistory(marketId);
    }
  }

  componentDidMount() {
    this.node.scrollIntoView();

    if (!this.props.marketReviewSeen) {
      this.props.marketReviewModal();
      const localStorageRef =
        typeof window !== "undefined" && window.localStorage;
      if (localStorageRef && localStorageRef.setItem) {
        const value = localStorageRef.getItem(MARKET_REVIEWS);
        let markets = value ? JSON.parse(value) : [];
        markets = markets.concat(this.props.marketId);
        localStorageRef.setItem(MARKET_REVIEWS, JSON.stringify(markets));
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { isConnected, marketId } = this.props;
    if (
      isConnected !== nextProps.isConnected &&
      (nextProps.isConnected &&
        !!nextProps.marketId &&
        (nextProps.marketId !== marketId || nextProps.marketType === undefined))
    ) {
      nextProps.loadFullMarket(nextProps.marketId);
      nextProps.loadMarketTradingHistory(marketId);
    }
  }

  toggleOrderBook() {
    if (!this.state.extendOrderBook && this.state.extendTradeHistory) {
      this.setState({ extendOrderBook: false, extendTradeHistory: false });
    } else {
      this.setState({
        extendOrderBook: !this.state.extendOrderBook,
        extendTradeHistory: false
      });
    }
  }

  toggleTradeHistory() {
    if (!this.state.extendTradeHistory && this.state.extendOrderBook) {
      this.setState({ extendTradeHistory: false, extendOrderBook: false });
    } else {
      this.setState({
        extendTradeHistory: !this.state.extendTradeHistory,
        extendOrderBook: false
      });
    }
  }

  updateSelectedOutcomeSwitch(selectedOutcomeId) {
    this.updateSelectedOutcome(selectedOutcomeId);

    FindReact(document.getElementById("tabs_mobileView")).handleClick(
      null,
      1
    );
  }

  updateSelectedOutcome(selectedOutcomeId) {
    if (selectedOutcomeId !== this.state.selectedOutcomeId) {
      this.setState(
        {
          selectedOutcomeId,
          selectedOrderProperties: {
            ...this.DEFAULT_ORDER_PROPERTIES
          }
        }
      );

      const { selectedOutcomeProperties } = this.state;
      if (!selectedOutcomeProperties[selectedOutcomeId]) {
        selectedOutcomeProperties[selectedOutcomeId] = {
          ...this.DEFAULT_ORDER_PROPERTIES
        };
        this.setState({ selectedOutcomeProperties });
      }
    }
  }

  updateSelectedOrderProperties(selectedOrderProperties) {
    this.setState({
      selectedOrderProperties
    });
  }

  showModal() {
    const {
      marketId,
      outcomes,
      market,
      updateModal
    } = this.props;
    const s = this.state;

    updateModal({
      type: MODAL_TRADING_OVERLAY,
      market,
      selectedOrderProperties: s.selectedOrderProperties,
      selectedOutcomeId: s.selectedOutcomeId,
      toggleForm: this.toggleForm,
      updateSelectedOutcome: this.updateSelectedOutcomeSwitch,
      updateSelectedOrderProperties: this.updateSelectedOrderProperties,
      outcomes,
      marketId
    });
  }

  render() {
    const {
      currentTimestamp,
      description,
      marketId,
      outcomes,
      market,
      marketType,
      history
    } = this.props;
    const s = this.state;

    const outcome = outcomes.find( outcomeValue => outcomeValue.id.toString() === s.selectedOutcomeId)
    const selectedOutcomeName: string = outcome ? outcome.description : "";

    return (
      <section
        ref={node => {
          this.node = node;
        }}
        className={Styles.MarketView}
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
                    <div className={Styles["MarketView__paneContainer--mobile"]}>
                      <MarketHeader marketId={marketId} />
                      <MarketOutcomesList
                        marketId={marketId}
                        selectedOutcomeId={s.selectedOutcomeId}
                        updateSelectedOutcome={this.updateSelectedOutcomeSwitch}
                      />
                      <div className={Styles.MarketView__priceHistoryChart}>
                        <p>Price History</p>
                        <MarketOutcomesChart
                          marketId={marketId}
                          selectedOutcomeId={s.selectedOutcomeId}
                        />
                      </div>
                    </div>
                  </ModulePane>
                  <ModulePane
                    label="Trade"
                    onClickCallback={() => {
                      this.node.children[0].children[1].scrollTo({
                        top: 0,
                        behavior: "smooth"
                      });
                    }}
                  >
                    <div className={Styles.OutcomeSelectionArea}>
                      {marketType === CATEGORICAL && (
                        <MarketOutcomeSelector
                          outcome={s.selectedOutcomeId}
                          outcomeName={selectedOutcomeName}
                          selectOutcome={this.updateSelectedOutcome}
                        />
                      )}
                      {marketType !== CATEGORICAL && (
                        <div className={Styles.OutcomeNameDisplay}>
                          {selectedOutcomeName}
                        </div>
                      )}
                    </div>
                    <div
                      className={classNames(
                        Styles["MarketView__paneContainer--mobile"],
                        Styles.TradesMobile
                      )}
                    >
                      <h1>{description}</h1>
                      <ModuleTabs selected={0} fillForMobile>
                        <ModulePane label="Order Book">
                          <div className={Styles.MarketView__orders}>
                            <OrderBook
                              updateSelectedOrderProperties={
                                this.updateSelectedOrderProperties
                              }
                              marketId={marketId}
                              selectedOutcomeId={s.selectedOutcomeId}
                              toggle={this.toggleOrderBook}
                              extend={s.extendOrderBook}
                              hide={s.extendTradeHistory}
                            />
                          </div>
                        </ModulePane>
                        <ModulePane label="Trade History">
                          <div className={Styles.MarketView__history}>
                            <div className={Styles.MarketView__component__history}>
                              {marketId && (
                                <MarketTradeHistory
                                  marketId={marketId}
                                  outcome={s.selectedOutcomeId}
                                  toggle={this.toggleTradeHistory}
                                  extend={s.extendTradeHistory}
                                  hide={s.extendOrderBook}
                                />
                              )}
                            </div>
                          </div>
                        </ModulePane>
                      </ModuleTabs>

                      <TradingForm
                        market={market}
                        selectedOrderProperties={s.selectedOrderProperties}
                        selectedOutcomeId={s.selectedOutcomeId}
                        toggleForm={this.toggleForm}
                        updateSelectedOutcome={this.updateSelectedOutcome}
                        updateSelectedOrderProperties={
                          this.updateSelectedOrderProperties
                        }
                      />

                      <MarketChartsPane
                        marketId={marketId}
                        selectedOutcomeId={s.selectedOutcomeId}
                        currentTimestamp={currentTimestamp}
                        updateSelectedOrderProperties={
                          this.updateSelectedOrderProperties
                        }
                      />
                    </div>
                  </ModulePane>
                  <ModulePane label="Orders/Positions">
                    <div
                      className={classNames(
                        Styles["MarketView__paneContainer--mobile"],
                        Styles.MarketView__orderPositionsTable
                      )}
                    >
                      <h1>{description}</h1>
                      <MarketOrdersPositionsTable marketId={marketId} />
                    </div>
                  </ModulePane>
                </ModuleTabs>
               </>
            ) : (
              <>
                <div className={Styles.Market__upper}>
                  <MarketHeader marketId={marketId} />
                </div>
                <section className={Styles.MarketView__body}>
                  <div className={Styles.MarketView__firstColumn}>
                    <div className={Styles.MarketView__firstRow}>
                      <div className={Styles.MarketView__innerFirstColumn}>
                        <div className={Styles.MarketView__component}>
                          <TradingForm
                            market={market}
                            selectedOrderProperties={s.selectedOrderProperties}
                            selectedOutcomeId={s.selectedOutcomeId}
                            toggleForm={this.toggleForm}
                            updateSelectedOutcome={this.updateSelectedOutcome}
                            updateSelectedOrderProperties={
                              this.updateSelectedOrderProperties
                            }
                          />
                        </div>
                      </div>
                      <div className={Styles.MarketView__innerSecondColumn}>
                        <div
                          className={classNames(
                            Styles.MarketView__component,
                            Styles.MarketView__outcomesList
                          )}
                        >
                          <MarketOutcomesList
                            marketId={marketId}
                            selectedOutcomeId={s.selectedOutcomeId}
                            updateSelectedOutcome={this.updateSelectedOutcome}
                          />
                        </div>
                        <div className={Styles.MarketView__component}>
                          <MarketChartsPane
                            marketId={marketId}
                            selectedOutcomeId={s.selectedOutcomeId}
                            updateSelectedOrderProperties={
                              this.updateSelectedOrderProperties
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className={Styles.MarketView__secondRow}>
                      <div
                        className={classNames(
                          Styles.MarketView__component
                        )}
                      >
                        <MarketOrdersPositionsTable marketId={marketId} />
                      </div>
                    </div>
                  </div>
                  <div className={Styles.MarketView__secondColumn}>
                    <div
                      className={classNames(
                        Styles.MarketView__component,
                        Styles.MarketView__orders,
                        {
                          [Styles.MarketView__hide]: s.extendTradeHistory,
                          [Styles.MarketView__show]: s.extendOrderBook
                        }
                      )}
                    >
                      <OrderBook
                        updateSelectedOrderProperties={
                          this.updateSelectedOrderProperties
                        }
                        marketId={marketId}
                        selectedOutcomeId={s.selectedOutcomeId}
                        toggle={this.toggleOrderBook}
                        extend={s.extendOrderBook}
                        hide={s.extendTradeHistory}
                      />
                    </div>
                    <div
                      className={classNames(
                        Styles.MarketView__component,
                        Styles.MarketView__history,
                        {
                          [Styles.MarketView__hide]: s.extendOrderBook,
                          [Styles.MarketView__show]: s.extendTradeHistory
                        }
                      )}
                    >
                      <div className={Styles.MarketView__component__history}>
                        {marketId && (
                          <MarketTradeHistory
                            marketId={marketId}
                            outcome={s.selectedOutcomeId}
                            toggle={this.toggleTradeHistory}
                            extend={s.extendTradeHistory}
                            hide={s.extendOrderBook}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )
          }
        </Media>
       </section>
     );
  }
}
