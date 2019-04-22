/* eslint-disable jsx-a11y/no-static-element-interaction */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import classNames from "classnames";

import { FindReact } from "utils/find-react";
import MarketHeader from "modules/market/containers/market-header";
import MarketOrdersPositionsTable from "modules/market/containers/market-orders-positions-table";
import MarketOutcomesList from "modules/market/containers/market-outcomes-list";
import MarketOutcomeOrders from "modules/market-charts/containers/market-outcome--orders";
import MarketTradingForm from "modules/market/containers/market-trading-form";
import MarketChartsPane from "modules/market-charts/components/market-charts-pane/market-charts-pane";
import parseMarketTitle from "modules/markets/helpers/parse-market-title";
import MarketTradeHistory from "modules/market/containers/market-trade-history";
import {
  CATEGORICAL,
  BUY,
  MODAL_TRADING_OVERLAY,
  MARKET_REVIEWS
} from "modules/common-elements/constants";
import ModuleTabs from "modules/market/components/common/module-tabs/module-tabs";
import ModulePane from "modules/market/components/common/module-tabs/module-pane";
import MarketOutcomeSelector from "modules/market/components/market-view/market-outcome-selector";
import MarketOutcomesChart from "src/modules/market-charts/containers/market-outcomes-chart";
import { getMarketAgeInDays } from "utils/format-date";
import Styles from "modules/market/components/market-view/market-view.styles";
import { precisionClampFunction } from "modules/markets/helpers/clamp-fixed-precision";
import { BigNumber } from "bignumber.js";
import { LeftChevron } from "modules/common-elements/icons";

export default class MarketView extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    maxPrice: PropTypes.instanceOf(BigNumber).isRequired,
    minPrice: PropTypes.instanceOf(BigNumber).isRequired,
    marketId: PropTypes.string.isRequired,
    marketReviewSeen: PropTypes.bool.isRequired,
    marketReviewModal: PropTypes.func.isRequired,
    currentTimestamp: PropTypes.number,
    isConnected: PropTypes.bool.isRequired,
    loadFullMarket: PropTypes.func.isRequired,
    loadMarketTradingHistory: PropTypes.func.isRequired,
    description: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    marketType: PropTypes.string,
    isMobile: PropTypes.bool,
    outcomes: PropTypes.array,
    isLogged: PropTypes.bool,
    updateModal: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  static defaultProps = {
    marketType: undefined,
    isMobile: false,
    outcomes: [],
    isLogged: false,
    currentTimestamp: 0
  };

  constructor(props) {
    super(props);

    this.DEFAULT_ORDER_PROPERTIES = {
      orderPrice: "",
      orderQuantity: "",
      selectedNav: BUY
    };

    this.sharedChartMargins = {
      top: 0,
      bottom: 30
    };

    this.state = {
      extendOrderBook: false,
      extendTradeHistory: false,
      selectedOrderProperties: this.DEFAULT_ORDER_PROPERTIES,
      selectedOutcome: props.marketType === CATEGORICAL ? "0" : "1",
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
    this.clearSelectedOutcome = this.clearSelectedOutcome.bind(this);
    this.updatePrecision = this.updatePrecision.bind(this);
    this.showSelectOutcome = this.showSelectOutcome.bind(this);
    this.toggleTradingForm = this.toggleTradingForm.bind(this);
    this.showModal = this.showModal.bind(this);
    this.updateOutcomeReturn = this.updateOutcomeReturn.bind(this);
    this.toggleOrderBook = this.toggleOrderBook.bind(this);
    this.toggleTradeHistory = this.toggleTradeHistory.bind(this);
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
        let markets = JSON.parse(localStorageRef.getItem(MARKET_REVIEWS)) || [];
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

  updateOutcomeReturn(selectedOutcome) {
    this.updateSelectedOutcome(selectedOutcome, true);
  }

  updateSelectedOutcome(selectedOutcome, showTradingForm) {
    const { marketType, isMobile } = this.props;
    if (selectedOutcome !== this.state.selectedOutcome) {
      this.setState(
        {
          selectedOutcome:
            selectedOutcome === this.state.selectedOutcome &&
            marketType === CATEGORICAL
              ? null
              : selectedOutcome,
          selectedOrderProperties: {
            ...this.DEFAULT_ORDER_PROPERTIES
          }
        },
        () => {
          if (showTradingForm) {
            this.toggleTradingForm();
          }
        }
      );

      const { selectedOutcomeProperties } = this.state;
      if (!selectedOutcomeProperties[selectedOutcome]) {
        selectedOutcomeProperties[selectedOutcome] = {
          ...this.DEFAULT_ORDER_PROPERTIES
        };
        this.setState({ selectedOutcomeProperties });
      } else {
        // this.setState({
        //   selectedOrderProperties: selectedOutcomeProperties[selectedOutcome]
        // });
      }
    } else if (showTradingForm) {
      this.toggleTradingForm();
    }

    if (isMobile) {
      FindReact(document.getElementById("tabs_mobileView")).handleClick(
        null,
        1
      );
    }
  }

  updateSelectedOrderProperties(selectedOrderProperties) {
    this.setState({
      selectedOrderProperties
    });
  }

  updatePrecision(isIncreasing) {
    let { fixedPrecision } = this.state;

    if (isIncreasing) {
      fixedPrecision += 1;
    } else {
      fixedPrecision -= 1;
    }

    this.setState({ fixedPrecision: precisionClampFunction(fixedPrecision) });
  }

  clearSelectedOutcome() {
    this.setState({ selectedOutcome: null });
  }

  showSelectOutcome(returnToTradingForm) {
    this.showModal(false, returnToTradingForm);
  }

  toggleTradingForm() {
    this.showModal(true, false);
  }

  showModal(tradingForm, returnToTradingForm) {
    const {
      isLogged,
      marketId,
      isMobile,
      outcomes,
      market,
      updateModal
    } = this.props;
    const s = this.state;

    updateModal({
      type: MODAL_TRADING_OVERLAY,
      tradingForm,
      market,
      isLogged,
      selectedOrderProperties: s.selectedOrderProperties,
      selectedOutcome: s.selectedOutcome,
      isMobile,
      toggleForm: this.toggleForm,
      updateSelectedOutcome: returnToTradingForm
        ? this.updateOutcomeReturn
        : this.updateSelectedOutcome,
      updateSelectedOrderProperties: this.updateSelectedOrderProperties,
      outcomes,
      marketId,
      showSelectOutcome: this.showSelectOutcome
    });
  }

  render() {
    const {
      currentTimestamp,
      description,
      marketId,
      maxPrice,
      minPrice,
      location,
      isMobile,
      outcomes,
      market,
      marketType,
      history
    } = this.props;
    const s = this.state;

    const selectedOutcomeName =
      // marketType === CATEGORICAL &&
      marketType &&
      s.selectedOutcome &&
      outcomes.find(
        outcomeValue => outcomeValue.id === s.selectedOutcome.toString()
      ).name;

    const daysPassed =
      market &&
      market.creationTime &&
      getMarketAgeInDays(market.creationTime.timestamp, currentTimestamp);

    if (isMobile) {
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
                <MarketHeader
                  marketId={marketId}
                  selectedOutcome={s.selectedOutcome}
                  updateSelectedOutcome={this.updateSelectedOutcome}
                  clearSelectedOutcome={this.clearSelectedOutcome}
                  location={location}
                  isMobile={isMobile}
                />
                <MarketOutcomesList
                  marketId={marketId}
                  outcomes={outcomes}
                  selectedOutcome={s.selectedOutcome}
                  updateSelectedOutcome={this.updateSelectedOutcome}
                  isMobile={isMobile}
                />
                <div className={Styles.MarketView__priceHistoryChart}>
                  <p>Price History</p>
                  <MarketOutcomesChart
                    marketId={marketId}
                    selectedOutcome={s.selectedOutcome}
                    pricePrecision={4}
                    daysPassed={daysPassed}
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
              <div className={Styles["MarketView__paneContainer--mobile"]}>
                <h1>{description}</h1>
                {marketType === CATEGORICAL && (
                  <MarketOutcomeSelector
                    outcome={s.selectedOutcome}
                    outcomeName={selectedOutcomeName}
                    selectOutcome={this.showSelectOutcome}
                  />
                )}
                {marketType !== CATEGORICAL && (
                  <div className={Styles.OutcomeNameDisplay}>
                    {selectedOutcomeName}
                  </div>
                )}
                <ModuleTabs selected={0} fillForMobile>
                  <ModulePane label="Order Book">
                    <div className={Styles.MarketView__orders}>
                      <MarketOutcomeOrders
                        isMobile={isMobile}
                        sharedChartMargins={this.sharedChartMargins}
                        fixedPrecision={4}
                        pricePrecision={4}
                        hoveredPrice={null}
                        updateHoveredPrice={null}
                        updatePrecision={null}
                        updateSelectedOrderProperties={
                          this.updateSelectedOrderProperties
                        }
                        marketId={marketId}
                        selectedOutcome={s.selectedOutcome}
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
                            outcome={s.selectedOutcome}
                            isMobile={isMobile}
                            toggle={this.toggleTradeHistory}
                            extend={s.extendTradeHistory}
                            hide={s.extendOrderBook}
                          />
                        )}
                      </div>
                    </div>
                  </ModulePane>
                </ModuleTabs>

                <MarketTradingForm
                  market={market}
                  selectedOrderProperties={s.selectedOrderProperties}
                  selectedOutcome={s.selectedOutcome}
                  toggleForm={this.toggleForm}
                  updateSelectedOutcome={this.updateSelectedOutcome}
                  updateSelectedOrderProperties={
                    this.updateSelectedOrderProperties
                  }
                  toggleMobileView
                  showSelectOutcome={this.showSelectOutcome}
                />

                <MarketChartsPane
                  marketId={marketId}
                  selectedOutcome={s.selectedOutcome}
                  currentTimestamp={currentTimestamp}
                  maxPrice={maxPrice}
                  minPrice={minPrice}
                  updateSelectedOrderProperties={
                    this.updateSelectedOrderProperties
                  }
                  isMobile={isMobile}
                  daysPassed={daysPassed}
                />
              </div>
            </ModulePane>
            <ModulePane label="Orders">
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
        </section>
      );
    }

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
        <div className={Styles.Market__upper}>
          <MarketHeader
            marketId={marketId}
            selectedOutcome={s.selectedOutcome}
            updateSelectedOutcome={this.updateSelectedOutcome}
            clearSelectedOutcome={this.clearSelectedOutcome}
            location={location}
          />
        </div>
        <section className={Styles.MarketView__body}>
          <div className={Styles.MarketView__firstColumn}>
            <div className={Styles.MarketView__firstRow}>
              <div className={Styles.MarketView__innerFirstColumn}>
                <div className={Styles.MarketView__component}>
                  <MarketTradingForm
                    market={market}
                    selectedOrderProperties={s.selectedOrderProperties}
                    selectedOutcome={s.selectedOutcome}
                    toggleForm={this.toggleForm}
                    updateSelectedOutcome={this.updateSelectedOutcome}
                    updateSelectedOrderProperties={
                      this.updateSelectedOrderProperties
                    }
                    toggleMobileView={this.toggleTradingForm}
                    showSelectOutcome={this.showSelectOutcome}
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
                    outcomes={outcomes}
                    selectedOutcome={s.selectedOutcome}
                    updateSelectedOutcome={this.updateSelectedOutcome}
                    isMobile={isMobile}
                  />
                </div>
                <div className={Styles.MarketView__component}>
                  <MarketChartsPane
                    marketId={marketId}
                    selectedOutcome={s.selectedOutcome}
                    currentTimestamp={currentTimestamp}
                    maxPrice={maxPrice}
                    minPrice={minPrice}
                    updateSelectedOrderProperties={
                      this.updateSelectedOrderProperties
                    }
                    daysPassed={daysPassed}
                  />
                </div>
              </div>
            </div>
            <div className={Styles.MarketView__secondRow}>
              <div
                className={classNames(
                  Styles.MarketView__component,
                  Styles.MarketView__orderPositionsTable
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
              <MarketOutcomeOrders
                isMobile={isMobile}
                fixedPrecision={4}
                pricePrecision={4}
                hoveredPrice={null}
                updateHoveredPrice={null}
                updatePrecision={null}
                updateSelectedOrderProperties={
                  this.updateSelectedOrderProperties
                }
                marketId={marketId}
                selectedOutcome={s.selectedOutcome}
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
                    outcome={s.selectedOutcome}
                    isMobile={isMobile}
                    toggle={this.toggleTradeHistory}
                    extend={s.extendTradeHistory}
                    hide={s.extendOrderBook}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </section>
    );
  }
}
