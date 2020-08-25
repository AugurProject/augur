/* eslint-disable jsx-a11y/no-static-element-interaction */

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useLocation, useHistory } from 'react-router';
import Media from 'react-media';
import { MarketHeader } from 'modules/market/components/market-header/market-header';
import MarketOrdersPositionsTable from 'modules/market/components/market-orders-positions-table/market-orders-positions-table';
import MarketOutcomesList from "modules/market/components/market-outcomes-list/market-outcomes-list";
import TradingForm from 'modules/trading/components/trading-form';
import { TutorialPopUp } from 'modules/market/components/common/tutorial-pop-up';
import MarketChartsPane from "modules/market-charts/components/market-charts-pane/market-charts-pane";
import parseMarketTitle from 'modules/markets/helpers/parse-market-title';
import MarketTradeHistory from 'modules/market/components/market-trade-history/market-trade-history';
import { MarketComments } from 'modules/market/components/common/comments/market-comments';
import {
  MODAL_SCALAR_MARKET,
  MODAL_TUTORIAL_INTRO,
  MODAL_TUTORIAL_OUTRO,
  PUBLICFILLORDER,
  SCALAR,
  SMALL_MOBILE,
  TRADING_TUTORIAL,
  TRADING_TUTORIAL_COPY,
  TRADING_TUTORIAL_OUTCOMES,
  TRADING_TUTORIAL_STEPS,
  TUTORIAL_OUTCOME,
  ZEROX_STATUSES,
  SCALAR_MODAL_SEEN,
  MODAL_MARKET_LOADING,
  TUTORIAL_PRICE,
  TUTORIAL_QUANTITY,
} from 'modules/common/constants';
import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import PriceHistory from "modules/market-charts/components/price-history/price-history";
import Styles from 'modules/market/components/market-view/market-view.styles.less';
import { LeftChevron } from 'modules/common/icons';
import { MARKET_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import { HelmetTag } from 'modules/seo/helmet-tag';
import {
  MarketData,
  DefaultOrderProperties,
  IndividualOutcomeOrderBook,
  TestTradingOrder,
} from 'modules/types';
import { getDefaultOutcomeSelected } from 'utils/convert-marketInfo-marketData';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';
import { formatOrderBook } from 'modules/create-market/helpers/format-order-book';
import type { Getters } from '@augurproject/sdk';
import { StatusErrorMessage } from 'modules/common/labels';
import parseQuery from 'modules/routes/helpers/parse-query';
import {
  MARKET_ID_PARAM_NAME,
  OUTCOME_ID_PARAM_NAME,
} from 'modules/routes/constants/param-names';
import { windowRef } from 'utils/window-ref';
import { getAddress } from 'ethers/utils/address';
import { hotLoadMarket } from 'modules/markets/actions/load-markets';
import {
 convertUnixToFormattedDate,
} from 'utils/format-date';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { useMarketsStore } from 'modules/markets/store/markets';
import { convertMarketInfoToMarketData } from 'utils/convert-marketInfo-marketData';
import { loadMarketOrderBook } from 'modules/orders/helpers/load-market-orderbook';
import { loadMarketTradingHistory } from 'modules/markets/actions/market-trading-history-management';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { addAlert } from 'modules/alerts/actions/alerts';
import OrderBook from 'modules/market-charts/components/order-book/order-book';
import { handleStyleCalculation, findType } from 'modules/market/store/market-utils';
import { MarketProvider } from 'modules/market/store/market';
import { 
  TUTORIAL_POSITION,
  MARKET_INFO,
  TUTORIAL_FILL,
  TUTORIAL_OPEN_ORDER,
  TUTORIAL_FILL_TRADE,
  TUTORIAL_FILL_ALERT,
  TRADING_TUTORIAL_MARKET,
  DEFAULT_ORDER_PROPERTIES,
} from 'modules/market/store/constants';
interface MarketViewProps {
  history: History;
  defaultMarket: MarketData;
  isPreview?: boolean;
}

export interface DefaultOrderPropertiesMap {
  [outcomeId: number]: DefaultOrderProperties;
}

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
  ORDER_BOOK,
  MARKET_DATA,
} = TRADING_TUTORIAL_STEPS;

const MarketView = ({
  defaultMarket = null,
  isPreview = null
}: MarketViewProps) => {
  const {
    universe,
    modal: { type: modalType },
    zeroXStatus,
    isConnected: connected,
    canHotload,
    blockchain: { currentAugurTimestamp },
    actions: { setModal, closeModal, removeAlert }
  } = useAppStatusStore();
  const {
    marketInfos,
    orderBooks,
    actions: {
      updateOrderBook,
      bulkMarketTradingHistory,
      updateMarketsData
    },
  } = useMarketsStore();
  const location = useLocation();
  const history = useHistory();
  const node = useRef(null);
  const prevProps = useRef();
  const queryId = parseQuery(location.search)[MARKET_ID_PARAM_NAME];
  const marketId = (queryId === TRADING_TUTORIAL || isPreview) ? queryId : getAddress(queryId);
  const queryOutcomeId = parseQuery(location.search)[
    OUTCOME_ID_PARAM_NAME
  ];
  const isConnected = connected && universe.id != null;
  const outcomeId = queryOutcomeId ? parseInt(queryOutcomeId) : null;
  const modalShowing = modalType;
  const tradingTutorial = marketId === TRADING_TUTORIAL;
  const preview = tradingTutorial || isPreview;
  const market = tradingTutorial ? 
    TRADING_TUTORIAL_MARKET : 
    defaultMarket || marketInfos && marketInfos[marketId] && convertMarketInfoToMarketData(marketInfos[marketId], currentAugurTimestamp * 1000);
  const hasZeroXError = zeroXStatus === ZEROX_STATUSES.ERROR;
  const zeroXSynced = zeroXStatus === ZEROX_STATUSES.SYNCED;
  const orderBook: Getters.Markets.OutcomeOrderBook = preview ? market.orderBook : (orderBooks[marketId] || {}).orderBook;
  const orderbookLoading = !orderBook;
  const cat5 = findType(market);
  const [state, setState] = useState({
    pane: null,
    introShowing: false,
    tutorialStep: INTRO_MODAL,
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
        : null,
    tutorialError: '',
  });
  const scalarModalSeen =
    Boolean(modalType) || windowRef?.localStorage?.getItem(SCALAR_MODAL_SEEN) === 'true';

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
    introShowing,
    hasShownScalarModal,
  } = state;

  let outcomeIdSet =
    selectedOutcomeId === null
      ? market?.defaultSelectedOutcomeId
      : selectedOutcomeId;

  useEffect(() => {
    if (!preview && !hasZeroXError) {
      window.scrollTo(0, 1);
    }
    if (!market) {
      setModal({
        type: MODAL_MARKET_LOADING,
      });
    }
  }, []);

  useEffect(() => {
    // inital mount, state setting
    tradingTutorialWidthCheck();
    if (
      isConnected &&
      !!marketId &&
      !tradingTutorial &&
      !preview &&
      zeroXSynced
    ) {
      updateMarketsData(null, loadMarketsInfo([marketId]));
      updateOrderBook(marketId, null, loadMarketOrderBook(marketId));
      bulkMarketTradingHistory(null, loadMarketTradingHistory(marketId));
    }

    return () => {
      modalShowing === MODAL_MARKET_LOADING && closeModal();
    }
  }, []);

  useEffect(() => {
    prevProps.current = {
      tradingTutorial, outcomeId, isConnected
    };
  }, [tradingTutorial, outcomeId, isConnected]);

  useEffect(() => {
    outcomeIdSet = selectedOutcomeId === null
    ? market?.defaultSelectedOutcomeId
    : selectedOutcomeId;
  }, [selectedOutcomeId]);

  useEffect(() => {
    // This will only be called once on the 'canHotLoad' prop change.
    if (canHotload && !tradingTutorial && marketId && !market) hotLoadMarket(marketId, history);
  }, [canHotload, marketId]);

  useEffect(() => {
    if (outcomeId !== prevProps.current.outcomeId && outcomeId !== null) {
      setState({
        ...state,
        selectedOutcomeId: outcomeId,
      });
    }

    if (tradingTutorial) {
      if (
        !introShowing &&
        tutorialStep === INTRO_MODAL
      ) {
        setModal({
          type: MODAL_TUTORIAL_INTRO,
          next,
        });
        setState({
          ...state,
          introShowing: true,
          selectedOrderProperties: {
            ...(tradingTutorial !== prevProps.current.tradingTutorial
              ? DEFAULT_ORDER_PROPERTIES
              : selectedOrderProperties),
          },
        });
      }
      return;
    }

    if (
      prevProps.current.isConnected !== isConnected &&
      !!marketId &&
      !tradingTutorial &&
      !preview &&
      zeroXSynced
    ) {
      updateOrderBook(marketId, null, loadMarketOrderBook(marketId));
      updateMarketsData(null, loadMarketsInfo(marketId));
      bulkMarketTradingHistory(null, loadMarketTradingHistory(marketId));
    }
    if (market) {
      modalShowing === MODAL_MARKET_LOADING && closeModal();
    }

    if (
      !prevProps.current.tradingTutorial &&
      !scalarModalSeen &&
      market?.marketType === SCALAR &&
      !hasShownScalarModal
    ) {
      setModal({
        type: MODAL_SCALAR_MARKET,
        cb: () =>
          setState({
            ...state,
            hasShownScalarModal: true,
          }),
      });
    }
  }, [
    market,
    introShowing,
    preview,
    tradingTutorial,
    outcomeId,
    isConnected,
    scalarModalSeen,
    hasShownScalarModal,
  ]);

  const {
    MarketViewStyle,
    ContainerStyle,
    HeaderStyle,
    TradingFormStyle,
    ChartsPaneStyle,
    OrdersPaneStyle,
    OrderBookStyle,
    HistoryStyle,
  } = useMemo(() => 
    handleStyleCalculation(preview, tradingTutorial, tutorialStep, extendOrderBook, extendTradeHistory, extendOutcomesList, extendOrders, cat5), 
  [preview, tradingTutorial, tutorialStep, extendOrderBook, extendTradeHistory, extendOutcomesList, extendOrders, cat5]);

  if (!market) {
    return <div ref={node} className={Styles.MarketView} />;
  }

  const {
    description: marketDescription,
    marketType,
    tickSize,
    minPrice,
    maxPrice,
    isArchived,
    groupedTradeHistory,
  } = market;

  function tradingTutorialWidthCheck() {
    if (tradingTutorial && window.innerWidth < 1150) {
      // tablet-max
      // Don't show tradingTutorial on mobile,
      // redirect to markets when we enter tablet breakpoints
      history.push({ pathname: makePath(MARKETS) });
    }
  }

  function toggleTradeHistory() {
    setState({
      ...state,
      extendOrderBook: false,
      extendTradeHistory: 
        (extendOrderBook && !extendTradeHistory) ? false : !extendTradeHistory,
    })
  }

  function toggleOrderBook() {
    setState({
      ...state,
      extendTradeHistory: false,
      extendOrderBook: 
        (!extendOrderBook && extendTradeHistory) ? false : !extendOrderBook,
    })
  }

  function updateSelectedOutcome(selectedOutcomeIdPassed, keepOrder) {
    if (selectedOutcomeIdPassed !== selectedOutcomeId) {
      setState({
        ...state,
        selectedOutcomeId: selectedOutcomeIdPassed,
        selectedOrderProperties: keepOrder ? 
          state.selectedOrderProperties : { ...DEFAULT_ORDER_PROPERTIES }
      });
    }
  }

  function updateSelectedOrderProperties(selectedOrderProperties) {
    checkTutorialErrors(selectedOrderProperties);
    if (pane === MARKET_INFO) {
      document
        .querySelector('.trading-form-styles_TradingForm')
        .scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    setState({
      ...state,
      selectedOrderProperties,
    });
  }

  function checkTutorialErrors(selectedOrderProperties) {
    if (tutorialStep === QUANTITY) {
      const invalidQuantity =
        parseFloat(selectedOrderProperties.orderQuantity) !== TUTORIAL_QUANTITY;

      setState({
        ...state,
        tutorialError:
          parseFloat(selectedOrderProperties.orderQuantity) !==
          TUTORIAL_QUANTITY
            ? 'Please enter a quantity of 100 for this order to be filled on the test market'
            : '',
      });

      return invalidQuantity;
    }

    if (tutorialStep === LIMIT_PRICE) {
      const invalidPrice =
        parseFloat(selectedOrderProperties.orderPrice) !== TUTORIAL_PRICE;

      setState({
        ...state,
        tutorialError: invalidPrice
          ? 'Enter a limit price of $.40 for this order to be filled on the test market'
          : '',
      });

      return invalidPrice;
    }

    return false;
  }

  function toggleMiddleColumn(show: string) {
    setState({
      ...state,
      [show]: !state[show],
    });
  }

  function next() {
    if (!checkTutorialErrors(selectedOrderProperties)) {
      setState({
        ...state,
        tutorialStep: tutorialStep + 1,
      });
    }

    if (tutorialStep === OPEN_ORDERS) {
      const outcomeId =
        selectedOutcomeId === null
          ? market?.defaultSelectedOutcomeId
          : selectedOutcomeId;
      addAlert({
        ...TUTORIAL_FILL_ALERT,
        params: {
          ...TUTORIAL_FILL_ALERT.params,
          outcome: TRADING_TUTORIAL_OUTCOMES[outcomeId].description,
          marketInfo: {
            tickSize,
            description: marketDescription,
            minPrice,
            maxPrice,
            marketType,
          },
        },
      });
    } else if (tutorialStep === MY_FILLS) {
      removeAlert(TRADING_TUTORIAL, PUBLICFILLORDER);
    } else if (tutorialStep === POSITIONS) {
      setModal({
        type: MODAL_TUTORIAL_OUTRO,
        back: () => {
          setState({
            ...state,
            tutorialStep: MARKET_DETAILS,
          });
        },
      });
    }
  }

  let outcomeOrderBook: IndividualOutcomeOrderBook = {
    spread: null,
    bids: [],
    asks: [],
  };
 
  if (orderBook && orderBook[outcomeIdSet]) {
    outcomeOrderBook = orderBook[outcomeIdSet];
  }

  if (preview && !tradingTutorial) {
    outcomeIdSet = getDefaultOutcomeSelected(marketType);
    outcomeOrderBook = formatOrderBook(orderBook[outcomeIdSet]);
  }
  if (tradingTutorial) {
    outcomeOrderBook = formatOrderBook(orderBook[outcomeIdSet]);
  }

  const orders = tradingTutorial && tutorialStep === OPEN_ORDERS ? [
    {
      ...TUTORIAL_OPEN_ORDER,
      outcomeName: TRADING_TUTORIAL_OUTCOMES[outcomeIdSet].description,
    },
  ] : null;

  const fills = (tradingTutorial && tutorialStep === MY_FILLS) ? [
    {
      ...TUTORIAL_FILL,
      marketDescription,
      marketId,
      outcome: TRADING_TUTORIAL_OUTCOMES[outcomeIdSet].description,
      timestamp: convertUnixToFormattedDate(currentAugurTimestamp),
      trades: [
        {
          ...TUTORIAL_FILL_TRADE,
          marketDescription,
          marketId,
          outcome: TRADING_TUTORIAL_OUTCOMES[outcomeIdSet].description,
          timestamp: convertUnixToFormattedDate(currentAugurTimestamp),
        },
      ],
    },
  ] : null;

  const positions = (tradingTutorial && tutorialStep === POSITIONS) ? [
    {
      ...TUTORIAL_POSITION,
      outcomeName: TRADING_TUTORIAL_OUTCOMES[outcomeIdSet].description,
      outcomeId: outcomeIdSet,
    },
  ] : null;

  let selected = 0;
  if (tradingTutorial && tutorialStep === MY_FILLS) {
    selected = 1;
  }
  if (tradingTutorial && tutorialStep === POSITIONS) {
    selected = 2;
  }

  const totalSteps = Object.keys(TRADING_TUTORIAL_STEPS).length / 2 - 2;

  if (
    tradingTutorial &&
    (tutorialStep === POSITIONS ||
      tutorialStep === MY_FILLS)
  ) {
    const orders = orderBook[TUTORIAL_OUTCOME] as TestTradingOrder[];
    const newOrderBook = orders.filter(order => !order.disappear);
    outcomeOrderBook = formatOrderBook(newOrderBook);
  }
  const parsedMarketDescription = parseMarketTitle(marketDescription);

  return (
    <MarketProvider
      market={market}
      defaultMarket={defaultMarket}
      isPreview={isPreview}
    >
      <div
        ref={node}
        className={MarketViewStyle}
      >
        {tradingTutorial && <span />}
        <HelmetTag
          {...MARKET_VIEW_HEAD_TAGS}
          title={parsedMarketDescription}
          ogTitle={parsedMarketDescription}
          twitterTitle={parsedMarketDescription}
        />
        <Media
          query={SMALL_MOBILE}
          onChange={matches => {
            if (matches && pane !== MARKET_INFO)
              setState({
                ...state,
                pane: MARKET_INFO,
              });
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
                    label={MARKET_INFO}
                    onClickCallback={() =>
                      setState({
                        ...state,
                        pane: MARKET_INFO,
                      })
                    }
                  >
                    <div className={Styles.PaneContainer}>
                      <MarketHeader marketId={marketId} preview={preview} />
                      <MarketOutcomesList
                        marketId={marketId}
                        preview={preview}
                        selectedOutcomeId={outcomeIdSet}
                        updateSelectedOutcome={updateSelectedOutcome}
                        orderBook={orderBook}
                        updateSelectedOrderProperties={
                          updateSelectedOrderProperties
                        }
                      />
                      <ModuleTabs selected={0} fillForMobile>
                        <ModulePane label="Order Book">
                          <div className={Styles.Orders}>
                            <OrderBook
                              updateSelectedOrderProperties={
                                updateSelectedOrderProperties
                              }
                              toggle={toggleOrderBook}
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
                                isArchived={isArchived}
                                marketId={marketId}
                                outcome={outcomeIdSet}
                                toggle={toggleTradeHistory}
                                extend={extendTradeHistory}
                                hide={extendOrderBook}
                                marketType={marketType}
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
                        orderBook={outcomeOrderBook}
                        updateSelectedOrderProperties={
                          updateSelectedOrderProperties
                        }
                      />
                    </div>
                  </ModulePane>
                  <ModulePane
                    label="Charts"
                    onClickCallback={() => {
                      setState({
                        ...state,
                        pane: 'Charts',
                      });
                      node.children[0].children[1].scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      });
                    }}
                  >
                    <div className={Styles.PaneContainer}>
                      <h1>{marketDescription}</h1>
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
                        marketId={marketId}
                        market={preview && market}
                        isArchived={isArchived}
                        selectedOutcomeId={outcomeIdSet}
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
                      setState({
                        ...state,
                        pane: 'Orders/Position',
                      })
                    }
                  >
                    <div className={Styles.PaneContainer}>
                      <h1>{marketDescription}</h1>
                      <MarketOrdersPositionsTable
                        updateSelectedOrderProperties={
                          updateSelectedOrderProperties
                        }
                        marketId={marketId}
                        market={preview && market}
                        preview={preview}
                        orders={orders}
                        fills={fills}
                      />
                    </div>
                  </ModulePane>
                </ModuleTabs>
                {!tradingTutorial && (
                  <MarketComments marketId={marketId} />
                )}
              </>
            ) : (
              <>
                <div className={ContainerStyle}>
                  <div className={HeaderStyle}>
                    <MarketHeader
                      marketId={marketId}
                      preview={preview}
                      next={next}
                      showTutorialData={
                        tradingTutorial &&
                        tutorialStep === MARKET_DATA
                      }
                      step={tutorialStep}
                      totalSteps={totalSteps}
                      text={TRADING_TUTORIAL_COPY[tutorialStep]}
                      showTutorialDetails={
                        tradingTutorial &&
                        tutorialStep === MARKET_DETAILS
                      }
                    />
                    {tradingTutorial &&
                      tutorialStep === MARKET_DETAILS && (
                        <TutorialPopUp
                          top
                          step={tutorialStep}
                          totalSteps={totalSteps}
                          text={TRADING_TUTORIAL_COPY[tutorialStep]}
                          next={next}
                        />
                      )}
                  </div>
                  <div className={TradingFormStyle}>
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
                      ((tutorialStep >= BUYING_SHARES &&
                        tutorialStep <= ORDER_VALUE) ||
                        tutorialStep === PLACE_ORDER) && (
                        <TutorialPopUp
                          left={tutorialStep !== PLACE_ORDER}
                          leftBottom={tutorialStep === PLACE_ORDER}
                          next={() => {
                            if (tutorialStep === PLACE_ORDER) {
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
                    preview={preview}
                    selectedOutcomeId={outcomeIdSet}
                    updateSelectedOutcome={updateSelectedOutcome}
                    hideOutcomes={cat5 ? !extendOutcomesList : false}
                    orderBook={orderBook}
                    updateSelectedOrderProperties={updateSelectedOrderProperties}
                  />
                  <div className={ChartsPaneStyle}>
                    <MarketChartsPane
                      marketId={!tradingTutorial && marketId}
                      isArchived={isArchived}
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
                      market={market}
                      preview={preview}
                      orderBook={outcomeOrderBook}
                      extendOutcomesList={extendOutcomesList}
                    />
                  </div>
                  <div className={OrdersPaneStyle}>
                    <MarketOrdersPositionsTable
                      updateSelectedOrderProperties={
                        updateSelectedOrderProperties
                      }
                      marketId={marketId}
                      toggle={
                        cat5 ? null : () => toggleMiddleColumn('extendOrders')
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
                      (tutorialStep === OPEN_ORDERS ||
                        tutorialStep === MY_FILLS ||
                        tutorialStep === POSITIONS) && (
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
                    <div className={OrderBookStyle}>
                      <OrderBook
                        updateSelectedOrderProperties={
                          updateSelectedOrderProperties
                        }
                        toggle={toggleOrderBook}
                        hide={extendTradeHistory}
                        market={market}
                        initialLiquidity={preview}
                        orderBook={outcomeOrderBook}
                        orderbookLoading={orderbookLoading}
                      />
                      {tradingTutorial &&
                        tutorialStep === ORDER_BOOK && (
                          <TutorialPopUp
                            right
                            next={next}
                            step={tutorialStep}
                            totalSteps={totalSteps}
                            text={TRADING_TUTORIAL_COPY[tutorialStep]}
                          />
                        )}
                    </div>
                    <div className={HistoryStyle}>
                      {(marketId || preview) && (
                        <MarketTradeHistory
                          marketId={marketId}
                          outcome={outcomeIdSet}
                          isArchived={isArchived}
                          toggle={toggleTradeHistory}
                          marketType={marketType}
                          hide={extendOrderBook}
                          tradingTutorial={tradingTutorial}
                          initialGroupedTradeHistory={groupedTradeHistory}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {!tradingTutorial && (
                  <MarketComments marketId={marketId} />
                )}
              </>
            )
          }
        </Media>
      </div>
    </MarketProvider>
  );
};

export default MarketView;
