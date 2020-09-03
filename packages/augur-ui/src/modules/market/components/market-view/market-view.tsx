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
  TRADING_TUTORIAL_OUTCOMES,
  TRADING_TUTORIAL_STEPS,
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
import { useAppStatusStore } from 'modules/app/store/app-status';
import { useMarketsStore } from 'modules/markets/store/markets';
import { convertMarketInfoToMarketData } from 'utils/convert-marketInfo-marketData';
import { loadMarketOrderBook } from 'modules/orders/helpers/load-market-orderbook';
import { loadMarketTradingHistory } from 'modules/markets/actions/market-trading-history-management';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { addAlert } from 'modules/alerts/actions/alerts';
import OrderBook from 'modules/market-charts/components/order-book/order-book';
import { handleStyleCalculation, findType, getTutorialPreview, handleTutorialInfo, handleTutorialMocks } from 'modules/market/store/market-utils';
import { 
  MARKET_INFO,
  TUTORIAL_FILL_ALERT,
  TRADING_TUTORIAL_MARKET,
  DEFAULT_ORDER_PROPERTIES,
  EMPTY_FORMATTED_BOOK,
  FORMATTED_TUTORIAL_BOOK,
} from 'modules/market/store/constants';
import { Trading } from 'modules/trading/store/trading';


interface MarketViewProps {
  defaultMarket: MarketData;
}

export interface DefaultOrderPropertiesMap {
  [outcomeId: number]: DefaultOrderProperties;
}

const {
  INTRO_MODAL,
  MARKET_DETAILS,
} = TRADING_TUTORIAL_STEPS;

const MarketView = ({
  defaultMarket = null,
}: MarketViewProps) => {
  const {
    modal: { type: modalType },
    zeroXStatus,
    isConnected,
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
  const {
    [MARKET_ID_PARAM_NAME]: queryId,
    [OUTCOME_ID_PARAM_NAME]: queryOutcomeId,
  } = parseQuery(location.search);
  const {
    isPreview,
    isTutorial: tradingTutorial,
    preview
  } = getTutorialPreview(queryId, location);
  const marketId = (preview) ? queryId : getAddress(queryId);
  const market = tradingTutorial ? 
    TRADING_TUTORIAL_MARKET : 
    defaultMarket || convertMarketInfoToMarketData(marketInfos[marketId], currentAugurTimestamp * 1000);
  const defaultOutcomeId = market?.defaultSelectedOutcomeId;
  const cat5 = findType(market);
  const zeroXSynced = zeroXStatus === ZEROX_STATUSES.SYNCED;
  const orderBook: Getters.Markets.OutcomeOrderBook = preview ? market.orderBook : ((orderBooks[marketId] || {}).orderBook || EMPTY_FORMATTED_BOOK);
  const [state, setState] = useState({
    pane: null,
    introShowing: false,
    tutorialStep: INTRO_MODAL,
    hasShownScalarModal: false,
    extendOrderBook: false,
    extendTradeHistory: false,
    extendOutcomesList: cat5 ? true : false,
    extendOrders: false,
    selectedOutcomeId: isPreview ? getDefaultOutcomeSelected(market.marketType) : !queryOutcomeId ? defaultOutcomeId : parseInt(queryOutcomeId),
    tutorialError: null,
  });
  const scalarModalSeen =
    Boolean(modalType) || windowRef?.localStorage?.getItem(SCALAR_MODAL_SEEN) === 'true';

  const {
    selectedOutcomeId,
    extendOrderBook,
    extendTradeHistory,
    extendOutcomesList,
    extendOrders,
    tutorialStep,
    tutorialError,
    pane,
    introShowing,
    hasShownScalarModal,
  } = state;

  const {
    tutorialCopy,
    isIntro,
    isDetails,
    isQuantity,
    isPrice,
    isOpenOrders,
    isFills,
    isPositions,
    isPlaceOrder,
    isOrderBook,
    isTrading,
    totalSteps,
  } = useMemo(() => handleTutorialInfo(tradingTutorial, tutorialStep), [tradingTutorial, tutorialStep]);

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

  const {
    selected,
    orders,
    fills,
    positions,
  } = useMemo(() => 
    handleTutorialMocks(
      selectedOutcomeId,
      market?.description,
      marketId,
      currentAugurTimestamp,
      isOpenOrders,
      isFills,
      isPositions
    ), 
    [isOpenOrders, isFills, isPositions]);

  useEffect(() => {
    // This will only be called once on the 'canHotLoad' prop change.
    if (canHotload && marketId && !market) hotLoadMarket(marketId, history);
  }, [canHotload, marketId]);

  useEffect(() => {
    // set selectedOutcomeID if it's unset.
    if (!selectedOutcomeId) {
      setState({
        ...state,
        selectedOutcomeId: queryOutcomeId ? parseInt(queryOutcomeId) : defaultOutcomeId,
      });
    }
  }, [defaultOutcomeId, queryOutcomeId]);

  useEffect(() => {
    // loadInfoIfNotLoaded
    tradingTutorialWidthCheck();
    if (
      isConnected &&
      !!marketId &&
      !preview &&
      zeroXSynced
    ) {
      updateMarketsData(null, loadMarketsInfo([marketId]));
      updateOrderBook(marketId, null, loadMarketOrderBook(marketId));
      bulkMarketTradingHistory(null, loadMarketTradingHistory(marketId));
    }

    return () => {
      modalType === MODAL_MARKET_LOADING && closeModal();
    }
  }, [zeroXSynced, marketId]);

  useEffect(() => {
    if (tradingTutorial) {
      if (!introShowing && isIntro) {
        setModal({
          type: MODAL_TUTORIAL_INTRO,
          next,
        });
        setState({
          ...state,
          introShowing: true
        });
        Trading.actions.clearOrderProperties();
      }
    } else if (
      market?.marketType === SCALAR &&
      !scalarModalSeen &&
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
  }, [tradingTutorial, scalarModalSeen, hasShownScalarModal]);

  useEffect(() => {
    if (isOpenOrders) {
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
            description,
            minPrice,
            maxPrice,
            marketType,
          },
        },
      });
    } else if (isFills) {
      removeAlert(TRADING_TUTORIAL, PUBLICFILLORDER);
    } else if (isPositions) {
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
  }, [isOpenOrders, isFills, isPositions]);

  useEffect(() => {
    checkTutorialErrors(Trading.get().orderProperties);
  }, [isQuantity, isPrice, Trading.get().orderProperties])

  useEffect(() => {
    // initial render only.
    document.getElementById("mainContent")?.scrollTo(0, 0);
    window.scrollTo(0, 1);
  }, []);

  if (!market) {
    if (modalType !== MODAL_MARKET_LOADING) setModal({ type: MODAL_MARKET_LOADING });
    return <div ref={node} className={Styles.MarketView} />;
  } else {
    modalType === MODAL_MARKET_LOADING && closeModal()
  }

  const {
    description,
    marketType,
    tickSize,
    minPrice,
    maxPrice,
    isArchived,
    groupedTradeHistory,
  } = market;
  const parsedMarketDescription = parseMarketTitle(description);
  const outcomeOrderBook = preview ? 
    formatOrderBook(orderBook[selectedOutcomeId]) :
    (isFills || isPositions) ? 
      FORMATTED_TUTORIAL_BOOK :
      orderBook[selectedOutcomeId] ? 
        orderBook[selectedOutcomeId] : orderBook;
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
      });
    }
  }
  // TODO: update functionality to handle this behavior.
  function updateSelectedOrderProperties() {
    if (pane === MARKET_INFO) {
      document
        .querySelector('.trading-form-styles_TradingForm')
        .scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  function checkTutorialErrors({ orderQuantity, orderPrice }) {
    if (isQuantity) {
      const invalidQuantity =
        parseFloat(orderQuantity) !== TUTORIAL_QUANTITY;

      setState({
        ...state,
        tutorialError:
          parseFloat(orderQuantity) !==
          TUTORIAL_QUANTITY
            ? 'Please enter a quantity of 100 for this order to be filled on the test market'
            : null,
      });

      return invalidQuantity;
    }

    if (isPrice) {
      const invalidPrice =
        parseFloat(orderPrice) !== TUTORIAL_PRICE;

      setState({
        ...state,
        tutorialError: invalidPrice
          ? 'Enter a limit price of $.40 for this order to be filled on the test market'
          : null,
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
    if (!checkTutorialErrors(Trading.get().orderProperties)) {
      setState({
        ...state,
        tutorialStep: tutorialStep + 1,
      });
    }
  }
  return (
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
                    <MarketHeader market={market} />
                    <MarketOutcomesList
                      market={market}
                      preview={preview}
                      selectedOutcomeId={selectedOutcomeId}
                      updateSelectedOutcome={updateSelectedOutcome}
                      orderBook={orderBook}
                    />
                    <ModuleTabs selected={0} fillForMobile>
                      <ModulePane label="Order Book">
                        <div className={Styles.Orders}>
                          <OrderBook
                            toggle={toggleOrderBook}
                            hide={extendTradeHistory}
                            market={market}
                            orderBook={outcomeOrderBook}
                            showButtons
                          />
                        </div>
                      </ModulePane>
                      <ModulePane label="Trade History">
                        <div className={Styles.History}>
                          <MarketTradeHistory
                            isArchived={isArchived}
                            marketId={marketId}
                            outcome={selectedOutcomeId}
                            toggle={toggleTradeHistory}
                            hide={extendOrderBook}
                            marketType={marketType}
                          />
                        </div>
                      </ModulePane>
                    </ModuleTabs>
                    <TradingForm
                      market={market}
                      selectedOutcomeId={selectedOutcomeId}
                      updateSelectedOutcome={updateSelectedOutcome}
                      orderBook={outcomeOrderBook}
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
                    <h1>{description}</h1>
                    <div className={Styles.PriceHistory}>
                      <h3>Price History</h3>
                      {!preview && (
                        <PriceHistory
                          marketId={marketId}
                          market={market}
                          selectedOutcomeId={selectedOutcomeId}
                        />
                      )}
                    </div>
                    <MarketChartsPane
                      marketId={marketId}
                      market={market}
                      isArchived={isArchived}
                      selectedOutcomeId={selectedOutcomeId}
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
                    <h1>{description}</h1>
                    <MarketOrdersPositionsTable
                      marketId={marketId}
                      market={preview && market}
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
                    market={market}
                    next={next}
                    step={tutorialStep}
                    totalSteps={totalSteps}
                    text={tutorialCopy}
                  />
                  {isDetails && (
                    <TutorialPopUp
                      top
                      step={tutorialStep}
                      totalSteps={totalSteps}
                      text={tutorialCopy}
                      next={next}
                    />
                  )}
                </div>
                <div className={TradingFormStyle}>
                  <TradingForm
                    market={market}
                    selectedOutcomeId={selectedOutcomeId}
                    updateSelectedOutcome={updateSelectedOutcome}
                    tutorialNext={next}
                    orderBook={outcomeOrderBook}
                  />
                  {isTrading && (
                    <TutorialPopUp
                      left={!isPlaceOrder}
                      leftBottom={isPlaceOrder}
                      next={() => {
                        if (isPlaceOrder) {
                          Trading.actions.updateOrderProperties({
                            orderQuantity: '',
                            orderPrice: '',
                          });
                        }
                        next();
                      }}
                      step={tutorialStep}
                      totalSteps={totalSteps}
                      text={tutorialCopy}
                      error={tutorialError}
                    />
                  )}
                </div>
                <MarketOutcomesList
                  market={market}
                  preview={preview}
                  selectedOutcomeId={selectedOutcomeId}
                  updateSelectedOutcome={updateSelectedOutcome}
                  hideOutcomes={cat5 ? !extendOutcomesList : false}
                  orderBook={orderBook}
                />
                <div className={ChartsPaneStyle}>
                  <MarketChartsPane
                    marketId={marketId}
                    isArchived={isArchived}
                    selectedOutcomeId={selectedOutcomeId}
                    toggle={
                      cat5
                        ? () => toggleMiddleColumn('extendOutcomesList')
                        : () => {}
                    }
                    market={market}
                    orderBook={outcomeOrderBook}
                    extendOutcomesList={extendOutcomesList}
                  />
                </div>
                <div className={OrdersPaneStyle}>
                  <MarketOrdersPositionsTable
                    marketId={marketId}
                    toggle={
                      cat5 ? null : () => toggleMiddleColumn('extendOrders')
                    }
                    market={preview && market}
                    orders={orders}
                    fills={fills}
                    positions={positions}
                    selected={selected}
                  />
                  {(isOpenOrders || isFills || isPositions) && (
                    <TutorialPopUp
                      bottom
                      next={next}
                      step={tutorialStep}
                      totalSteps={totalSteps}
                      text={tutorialCopy}
                    />
                  )}
                </div>
                <div className={Styles.OrderBookAndHistory}>
                  <div className={OrderBookStyle}>
                    <OrderBook
                      toggle={toggleOrderBook}
                      hide={extendTradeHistory}
                      market={market}
                      orderBook={outcomeOrderBook}
                    />
                    {isOrderBook && (
                      <TutorialPopUp
                        right
                        next={next}
                        step={tutorialStep}
                        totalSteps={totalSteps}
                        text={tutorialCopy}
                      />
                    )}
                  </div>
                  <div className={HistoryStyle}>
                    <MarketTradeHistory
                      marketId={marketId}
                      outcome={selectedOutcomeId}
                      isArchived={isArchived}
                      toggle={toggleTradeHistory}
                      marketType={marketType}
                      hide={extendOrderBook}
                      initialGroupedTradeHistory={groupedTradeHistory}
                    />
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
  );
};

export default MarketView;
