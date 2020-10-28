import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import MarketsList from 'modules/markets-list/components/markets-list';
import Styles from 'modules/markets-list/components/markets-landing-page.styles.less';
import {
  TYPE_TRADE,
  MARKET_CARD_FORMATS,
  POPULAR_CATEGORIES,
  MODAL_SIGNUP,
} from 'modules/common/constants';
import { MarketList } from '@augurproject/sdk-lite';
import { PrimaryButton, CategoryButtons } from 'modules/common/buttons';
import makePath from 'modules/routes/helpers/make-path';
import { MARKETS } from 'modules/routes/constants/views';
import { CategorySelector } from 'modules/common/selection';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { selectMarkets } from 'modules/markets/selectors/markets-all';
import { loadMarketsByFilter } from 'modules/markets/actions/load-markets';
import { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';

const MarketsView = () => {
  const location = useLocation();
  const history = useHistory();
  const componentWrapper = useRef();
  let markets = selectMarkets();
  const {
    marketsList: { isSearching },
    universe: { id },
    categoryStats,
    isLogged,
    theme,
    restoredAccount,
    actions: { setModal, updateMarketsList },
  } = useAppStatusStore();
  let { isConnected } = useAppStatusStore();

  const [state, setState] = useState({
    marketCategory: 'all',
    filterSortedMarkets: [],
  });
  
  const {marketCategory, filterSortedMarkets} = state;

  isConnected = isConnected && id != null;
  markets = markets.filter(market =>
    POPULAR_CATEGORIES.includes(market.categories[0])
  );

  useEffect(() => {
    if (isConnected) {
     updateFilteredMarkets();
    }
  }, [isConnected, marketCategory, theme])

  function updateFilteredMarkets() {
    const { marketCategory } = state;
    updateMarketsList({ isSearching: true });
    updateMarketsList(null, loadMarketsByFilter(
      {
        categories:
          marketCategory && marketCategory !== 'all' ? [marketCategory] : [],
        offset: 1,
        limit: 25,
      },
      (err, result: MarketList) => {
        if (err) return console.log('Error loadMarketsFilter:', err);
        if (componentWrapper) {
          const filterSortedMarkets = result.markets.map(m => m.id);
          setState({
            ...state,
            filterSortedMarkets,
          });
          updateMarketsList({
            isSearching: false,
            meta: result.meta,
          });
        }
      }
    ));
  }

  return (
    <section className={Styles.LandingPage} ref={componentWrapper}>
      <Helmet>
        <title>Markets</title>
      </Helmet>

      <div>The world’s most accessible, no-limit betting exchange.</div>

      {!isLogged && !restoredAccount ? (
        <div>
          <PrimaryButton
            action={() => setModal({ type: MODAL_SIGNUP })}
            text="Signup to start betting"
          />
        </div>
      ) : (
        <div />
      )}

      <CategoryButtons
        action={categoryName => {
          history.push({
            pathname: makePath(MARKETS, null),
            search: `category=${categoryName}`,
          });
        }}
        categoryStats={categoryStats}
      />

      <div>Popular markets</div>

      <CategorySelector
        action={marketCategory => {
          setState({ ...state, marketCategory });
        }}
        selected={marketCategory}
      />

      <MarketsList
        testid="markets"
        markets={markets}
        showPagination={false}
        filteredMarkets={filterSortedMarkets}
        location={location}
        history={history}
        linkType={TYPE_TRADE}
        isSearchingMarkets={isSearching}
        marketCardFormat={MARKET_CARD_FORMATS.COMPACT}
      />
    </section>
  );
};
export default MarketsView;