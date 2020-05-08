/* eslint-disable jsx-a11y/no-static-element-interaction */

import React, { Component, useRef, useState } from 'react';
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
  THEMES,
  ZEROX_STATUSES,
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
import { TXEventName } from '@augurproject/sdk/src';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';
import { formatOrderBook } from 'modules/create-market/helpers/format-order-book';
import { Getters } from '@augurproject/sdk';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { MARKET_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import { StatusErrorMessage } from 'modules/common/labels';
import { useMarketsStore } from 'modules/markets/store/markets';

interface MarketViewProps {
  isMarketLoading: boolean;
  closeMarketLoadingModalOnly: boolean;
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
  zeroXstatus: string;
  hasZeroXError: boolean;
}

export interface DefaultOrderPropertiesMap {
  [outcomeId: number]: DefaultOrderProperties;
}

// export default class MarketView extends Component<
//   MarketViewProps,
//   MarketViewState
// > {
//   static defaultProps = {
//     marketType: undefined,
//     outcomes: [],
//     currentTimestamp: 0,
//   };


//   constructor(props: MarketViewProps) {
//     super(props);

//     const cat5 = this.findType();

//     this.state = {
//      
//     };

//     this.updateSelectedOutcome = this.updateSelectedOutcome.bind(this);
//     this.updateSelectedOrderProperties = this.updateSelectedOrderProperties.bind(
//       this
//     );
//     this.toggleOrderBook = this.toggleOrderBook.bind(this);
//     this.toggleTradeHistory = this.toggleTradeHistory.bind(this);
//     this.updateSelectedOutcomeSwitch = this.updateSelectedOutcomeSwitch.bind(
//       this
//     );
//     this.showMarketDisclaimer = this.showMarketDisclaimer.bind(this);
//     this.toggleMiddleColumn = this.toggleMiddleColumn.bind(this);
//     this.tradingTutorialWidthCheck = this.tradingTutorialWidthCheck.bind(this);

//     const {
//       isConnected,
//       loadMarketsInfo,
//       marketId,
//       loadMarketTradingHistory,
//       tradingTutorial,
//       loadMarketOrderBook,
//       preview,
//       zeroXstatus,
//     } = this.props;

//     this.tradingTutorialWidthCheck();

//     if (
//       isConnected &&
//       !!marketId &&
//       !tradingTutorial &&
//       !preview &&
//       zeroXstatus === ZEROX_STATUSES.SYNCED
//     ) {
//       loadMarketsInfo(marketId);
//       loadMarketOrderBook(marketId);
//       loadMarketTradingHistory(marketId);
//     }
//   }

//   componentDidMount() {
//     if (!this.props.preview && !this.props.hasZeroXError) {
//       this.node && this.node.scrollIntoView();
//       window.scrollTo(0, 1);
//     }

//     const { isMarketLoading, showMarketLoadingModal } = this.props;

//     if (isMarketLoading) {
//       showMarketLoadingModal();
//     }
//   }

//   componentDidUpdate(prevProps: MarketViewProps) {
//     const {
//       isConnected,
//       marketId,
//       tradingTutorial,
//       updateModal,
//       closeMarketLoadingModalOnly,
//       preview,
//       loadMarketOrderBook,
//       loadMarketsInfo,
//       loadMarketTradingHistory,
//       marketType,
//       zeroXstatus,
//     } = prevProps;
//     if (
//       this.props.outcomeId !== prevProps.outcomeId &&
//       this.props.outcomeId !== null
//     ) {
//       this.setState({ selectedOutcomeId: this.props.outcomeId });
//     }

//     if (tradingTutorial) {
//       if (
//         !this.state.introShowing &&
//         this.state.tutorialStep === TRADING_TUTORIAL_STEPS.INTRO_MODAL
//       ) {
//         updateModal({
//           type: MODAL_TUTORIAL_INTRO,
//           next: this.next,
//         });
//         this.setState({
//           introShowing: true,
//           selectedOrderProperties: {
//             ...(tradingTutorial !== prevProps.tradingTutorial
//               ? this.DEFAULT_ORDER_PROPERTIES
//               : this.state.selectedOrderProperties),
//           },
//         });
//       }
//       return;
//     }

//     if (
//       isConnected !== this.props.isConnected &&
//       !!marketId &&
//       !tradingTutorial &&
//       !preview &&
//       zeroXstatus === ZEROX_STATUSES.SYNCED
//     ) {
//       loadMarketOrderBook(marketId);
//       loadMarketsInfo(marketId);
//       loadMarketTradingHistory(marketId);
//     }
//     if (!this.props.isMarketLoading) {
//       if (closeMarketLoadingModalOnly)
//         closeMarketLoadingModalOnly(this.props.modalShowing);
//     }

//     if (
//       !tradingTutorial &&
//       !this.props.scalarModalSeen &&
//       marketType === SCALAR &&
//       !this.state.hasShownScalarModal
//     ) {
//       updateModal({
//         type: MODAL_SCALAR_MARKET,
//         cb: () => this.setState({ hasShownScalarModal: true }),
//       });
//     }
//   }

//   toggleOrderBook() {
//     if (!this.state.extendOrderBook && this.state.extendTradeHistory) {
//       this.setState({ extendOrderBook: false, extendTradeHistory: false });
//     } else {
//       this.setState({
//         extendOrderBook: !this.state.extendOrderBook,
//         extendTradeHistory: false,
//       });
//     }
//   }


// }

const DEFAULT_ORDER_PROPERTIES = {
  orderPrice: '',
  orderQuantity: '',
  selectedNav: BUY,
};

const EmptyOrderBook: IndividualOutcomeOrderBook = {
    spread: null,
    bids: [],
    asks: [],
  };

const MarketView = ({
  isMarketLoading,
  closeMarketLoadingModalOnly,
  market,
  marketId,
  marketReviewSeen,
  scalarModalSeen,
  marketReviewModal,
  currentTimestamp,
  isConnected,
  loadMarketsInfo,
  loadMarketTradingHistory,
  description,
  marketType,
  outcomes,
  updateModal,
  history,
  showMarketLoadingModal,
  preview,
  sortedOutcomes,
  tradingTutorial,
  addAlert,
  hotloadMarket,
  canHotload,
  modalShowing,
  removeAlert,
  outcomeId,
  account,
  orderBook,
  loadMarketOrderBook,
  zeroXstatus,
  hasZeroXError,
}: MarketViewProps) => {
  const node = useRef(null);

  if (isMarketLoading) {
    if (canHotload && !tradingTutorial) hotloadMarket(marketId);
    return (
      <div
        ref={node}
        className={Styles.MarketView}
      />
    );
  }

  const cat5 = findType();

  const [state, setState] = useState({
    pane: null,
    introShowing: false,
    tutorialStep: TRADING_TUTORIAL_STEPS.INTRO_MODAL,
    hasShownScalarModal: false,
    extendOrderBook: false,
    extendTradeHistory: false,
    extendOutcomesList: cat5 ? true : false,
    extendOrders: false,
    selectedOrderProperties: DEFAULT_ORDER_PROPERTIES,
    selectedOutcomeId:
      outcomeId !== null
        ? outcomeId
        : market
        ? market.defaultSelectedOutcomeId
        : undefined,
    fixedPrecision: 4,
    tutorialError: '',
    selectedOutcomeProperties: {
      1: {
        ...DEFAULT_ORDER_PROPERTIES,
      },
    },
  });


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
    selectedOutcomeProperties
  } = state;

  function findType() {
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

  function tradingTutorialWidthCheck() {
    if (tradingTutorial && window.innerWidth < 1150) {
      // tablet-max
      // Don't show tradingTutorial on mobile,
      // redirect to markets when we enter tablet breakpoints
      history.push({ pathname: makePath(MARKETS) });
    }
  }

  // don't show the market disclaimer when user shows up. TODO: Design to figure out when to show
  function showMarketDisclaimer() {
    if (!marketReviewSeen && marketReviewModal) {
      marketReviewModal();
    }
  }


  function toggleTradeHistory() {
    if (!extendTradeHistory && extendOrderBook) {
      this.setState({ extendTradeHistory: false, extendOrderBook: false });
    } else {
      this.setState({
        extendTradeHistory: !extendTradeHistory,
        extendOrderBook: false,
      });
    }
  }

  function updateSelectedOutcome(selectedOutcomeIdPassed, keepOrder) {
    if (selectedOutcomeIdPassed !== selectedOutcomeId) {
      if (keepOrder) {
        return this.setState({ selectedOutcomeId });
      }
      this.setState({
        selectedOutcomeId,
        selectedOrderProperties: {
          ...DEFAULT_ORDER_PROPERTIES,
        },
      });

      if (!selectedOutcomeProperties[selectedOutcomeId]) {
        selectedOutcomeProperties[selectedOutcomeId] = {
          ...DEFAULT_ORDER_PROPERTIES,
        };
        this.setState({ selectedOutcomeProperties });
      }
    }
  }

  function updateSelectedOrderProperties(selectedOrderProperties) {
    checkTutorialErrors(selectedOrderProperties);
    if (pane === 'Market Info') {
      document
        .querySelector('.trading-form-styles_TradingForm')
        .scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    this.setState({
      selectedOrderProperties,
    });
  }

  function checkTutorialErrors(selectedOrderProperties) {
    if (tutorialStep === TRADING_TUTORIAL_STEPS.QUANTITY) {
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

    if (tutorialStep === TRADING_TUTORIAL_STEPS.LIMIT_PRICE) {
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

  function toggleMiddleColumn(show: string) {
    this.setState({ [show]: !state[show] });
  }

  function back(){
    this.setState({ tutorialStep: tutorialStep - 1 });
  };

  function next() {
    if (!checkTutorialErrors(selectedOrderProperties)) {
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

    let outcomeOrderBook = EmptyOrderBook;
    const orderbookLoading = !orderBook;
    let outcomeIdSet =
      selectedOutcomeId === null || selectedOutcomeId === undefined
        ? market.defaultSelectedOutcomeId
        : selectedOutcomeId;
    if (orderBook && orderBook[outcomeId]) {
      outcomeOrderBook = orderBook[outcomeId];
    }

    if (preview && !tradingTutorial) {
      outcomeIdSet = getDefaultOutcomeSelected(market.marketType);
      outcomeOrderBook = formatOrderBook(orderBook[outcomeIdSet]);
    }

    const networkId = tradingTutorial ? null : getNetworkId();
    let orders = null;
    if (tradingTutorial) {
      outcomeOrderBook = formatOrderBook(orderBook[outcomeIdSet]);
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
          outcomeName: TRADING_TUTORIAL_OUTCOMES[outcomeIdSet].description,
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
          outcome: TRADING_TUTORIAL_OUTCOMES[outcomeIdSet].description,
          timestamp: convertUnixToFormattedDate(currentTimestamp),
          trades: [
            {
              amount: createBigNumber(TUTORIAL_QUANTITY),
              logIndex: 1,
              marketDescription: market.description,
              marketId: market.id,
              type: BUY,
              price: createBigNumber(TUTORIAL_PRICE),
              outcome: TRADING_TUTORIAL_OUTCOMES[outcomeIdSet].description,
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
          outcomeName: TRADING_TUTORIAL_OUTCOMES[outcomeIdSet].description,
          quantity: formatShares(TUTORIAL_QUANTITY),
          id: TRADING_TUTORIAL,
          outcomeId: outcomeIdSet,
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
        ref={node}
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
                <StatusErrorMessage />
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
                        selectedOutcomeId={outcomeIdSet}
                        updateSelectedOutcome={updateSelectedOutcome}
                        orderBook={orderBook}
                        updateSelectedOrderProperties={updateSelectedOrderProperties}
                      />
                      <ModuleTabs selected={0} fillForMobile>
                        <ModulePane status={zeroXstatus} label="Order Book">
                          <div className={Styles.Orders}>
                            <OrderBook
                              updateSelectedOrderProperties={updateSelectedOrderProperties}
                              marketId={marketId}
                              selectedOutcomeId={outcomeIdSet}
                              toggle={toggleOrderBook}
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
                                outcome={outcomeIdSet}
                                toggle={toggleTradeHistory}
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
                        selectedOutcomeId={outcomeIdSet}
                        updateSelectedOutcome={updateSelectedOutcome}
                        updateSelectedOrderProperties={updateSelectedOrderProperties}
                      />
                    </div>
                  </ModulePane>
                  <ModulePane
                    label="Charts"
                    onClickCallback={() => {
                      this.setState({ pane: 'Charts' });
                      node.children[0].children[1].scrollTo({
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
                            selectedOutcomeId={outcomeIdSet}
                          />
                        )}
                      </div>
                      <MarketChartsPane
                        marketId={!tradingTutorial && marketId}
                        market={preview && market}
                        isArchived={market.isArchived}
                        selectedOutcomeId={outcomeIdSet}
                        currentTimestamp={currentTimestamp}
                        updateSelectedOrderProperties={
                          updateSelectedOrderProperties
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
                          updateSelectedOrderProperties
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
                      next={next}
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
                          next={next}
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
                      selectedOutcomeId={outcomeIdSet}
                      updateSelectedOutcome={updateSelectedOutcome}
                      updateSelectedOrderProperties={
                        updateSelectedOrderProperties
                      }
                      tutorialNext={next}
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
                              updateSelectedOrderProperties({
                                orderQuantity: '',
                                orderPrice: '',
                              });
                            }
                            next();
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
                    selectedOutcomeId={outcomeIdSet}
                    updateSelectedOutcome={updateSelectedOutcome}
                    hideOutcomes={cat5 ? !extendOutcomesList : false}
                    orderBook={orderBook}
                    updateSelectedOrderProperties={
                      updateSelectedOrderProperties
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
                      selectedOutcomeId={outcomeIdSet}
                      updateSelectedOrderProperties={
                        updateSelectedOrderProperties
                      }
                      tradingTutorial={tradingTutorial}
                      toggle={
                        cat5
                          ? () => toggleMiddleColumn('extendOutcomesList')
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
                        updateSelectedOrderProperties
                      }
                      marketId={marketId}
                      toggle={
                        cat5
                          ? null
                          : () => toggleMiddleColumn('extendOrders')
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
                          next={next}
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
                          updateSelectedOrderProperties
                        }
                        marketId={marketId}
                        selectedOutcomeId={outcomeIdSet}
                        toggle={toggleOrderBook}
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
                            next={next}
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
                          outcome={outcomeIdSet}
                          isArchived={market.isArchived}
                          toggle={toggleTradeHistory}
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

export default MarketView;
