import React, { useEffect, useState } from 'react';
import Styles from 'modules/markets/markets-view.styles.less';
import makePath from 'modules/routes/helpers/make-path';
import {
  MARKET,
  SIDEBAR_TYPES,
  ALL,
  ALL_MARKETS,
  categoryItems,
  currencyItems,
  ETH,
  INVALID_OUTCOME_ID,
  marketStatusItems,
  OPEN,
  OTHER,
  POPULAR_CATEGORIES_ICONS,
  sortByItems,
  TOTAL_VOLUME,
  USDT,
  YES_OUTCOME_ID,
} from 'modules/constants';
import { Link } from 'react-router-dom';
import {
  ValueLabel,
  AppViewStats,
  CategoryLabel,
  CategoryIcon,
} from 'modules/common/labels';
import { formatDai } from 'utils/format-number';
import { EthIcon, FilterIcon, UsdIcon } from 'modules/common/icons';
import classNames from 'classnames';
import { PrimaryButton } from 'modules/common/buttons';
import { SquareDropdown } from 'modules/common/selection';
import { Pagination } from 'modules/common/pagination';
import { useAppStatusStore } from 'modules/stores/app-status';

const PAGE_LIMIT = 20;

const LoadingMarketCard = () => {
  return (
    <article className={Styles.LoadingMarketCard}>
      <div>
        <div/>
        <div/>
        <div/>
      </div>
      <div>
        <div/>
        <div/>
        <div/>
      </div>
      <div>
        <div/>
        <div/>
        <div/>
      </div>
    </article>
  );
}

const OutcomesTable = ({ outcomes, marketId, priceNo, priceYes }) => {
  return (
    <div className={Styles.OutcomesTable}>
      {outcomes
        .filter((outcome) => outcome.id !== INVALID_OUTCOME_ID)
        .map((outcome) => (
          <div key={`${outcome.name}-${marketId}-${outcome.id}`}>
            <span>{outcome.name.toLowerCase()}</span>
            <span>
              {
                formatDai(outcome.name === YES_OUTCOME_ID ? priceYes : priceNo)
                  .full
              }
            </span>
          </div>
        ))}
    </div>
  );
};

const MarketCard = ({ market }) => {
  const { categories, description, outcomes, marketId, ammExchange } = market;

  return (
    <article
      className={classNames(Styles.MarketCard, {
        [Styles.NoLiquidity]: !ammExchange,
      })}
    >
      <Link to={makePath(MARKET)}>
        <div>
          <CategoryIcon category={categories[0]} />
          <CategoryLabel category={categories[1]} />
          <div>
            {ammExchange && ammExchange?.cash.name === ETH && EthIcon}
            {ammExchange && ammExchange?.cash.name === USDT && UsdIcon}
          </div>
          <span>{description}</span>
          {!ammExchange ? (
            <div>
              <span>Market requires Initial liquidity</span>
              <PrimaryButton text="Earn fees as a liquidity provider" />
            </div>
          ) : (
            <>
              <ValueLabel
                label="total volume"
                value={formatDai(market.ammExchange?.volumeTotalUSD).full}
              />
              <OutcomesTable
                marketId={marketId}
                priceNo={ammExchange?.priceNo}
                priceYes={ammExchange?.priceYes}
                outcomes={outcomes}
              />
            </>
          )}
        </div>
      </Link>
    </article>
  );
};

const getOffset = (page) => {
  return (page - 1) * PAGE_LIMIT;
};

const applyFiltersAndSort = (
  passedInMarkets,
  setFilteredMarkets,
  { categories, sortBy, currency, reportingState }
) => {
  let updatedFilteredMarkets = passedInMarkets;
  updatedFilteredMarkets = updatedFilteredMarkets.filter((market) => {
    if (
      categories !== ALL_MARKETS &&
      categories !== OTHER &&
      market.categories[0].toLowerCase() !== categories.toLowerCase()
    ) {
      return false;
    }
    if (
      categories === OTHER &&
      POPULAR_CATEGORIES_ICONS[market.categories[0].toLowerCase()]
    ) {
      return false;
    }
    if (currency !== ALL) {
      if (!market.ammExchange) {
        return false;
      } else if (market?.ammExchange?.cash?.name !== currency) {
        return false;
      }
    }
    if (reportingState === OPEN) {
      if (market.reportingState !== 'TRADING') {
        return false;
      }
    } else if (market.reportingState !== reportingState) {
      return false;
    }
    return true;
  });
  updatedFilteredMarkets = updatedFilteredMarkets.sort((marketA, marketB) => {
    if (sortBy === TOTAL_VOLUME) {
      return (
        marketB?.ammExchange?.volumeTotal - marketA?.ammExchange?.volumeTotal
      );
    }
    return true;
  });
  setFilteredMarkets(updatedFilteredMarkets);
};

const MarketsView = () => {
  const {
    isMobile,
    marketsViewSettings,
    actions: { setSidebar, updateMarketsViewSettings },
    processed: { markets },
  } = useAppStatusStore();
  const { sortBy, categories, reportingState, currency } = marketsViewSettings;
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filteredMarkets, setFilteredMarkets] = useState([]);

  useEffect(() => {
    if (Object.values(markets).length > 0) setLoading(false);
    setPage(1);
    applyFiltersAndSort(Object.values(markets), setFilteredMarkets, {
      categories,
      sortBy,
      currency,
      reportingState,
    });
  }, [sortBy, categories, reportingState, currency, markets]);

  return (
    <div className={Styles.MarketsView}>
      <AppViewStats showCashAmounts />
      {isMobile && (
        <PrimaryButton
          text="filters"
          icon={FilterIcon}
          action={() => setSidebar(SIDEBAR_TYPES.FILTERS)}
        />
      )}
      <ul>
        <SquareDropdown
          onChange={(value) => {
            updateMarketsViewSettings({ categories: value });
          }}
          options={categoryItems}
          defaultValue={categories}
        />
        <SquareDropdown
          onChange={(value) => {
            updateMarketsViewSettings({ sortBy: value });
          }}
          options={sortByItems}
          defaultValue={sortBy}
        />
        <SquareDropdown
          onChange={(value) => {
            updateMarketsViewSettings({ reportingState: value });
          }}
          options={marketStatusItems}
          defaultValue={reportingState}
        />
        <SquareDropdown
          onChange={(value) => {
            updateMarketsViewSettings({ currency: value });
          }}
          options={currencyItems}
          defaultValue={currency}
        />
      </ul>
      <section>
        {loading &&
          new Array(PAGE_LIMIT)
            .fill(null)
            .map((m, index) => <LoadingMarketCard key={index} />)}
        {!loading &&
          filteredMarkets
            .slice(getOffset(page), getOffset(page) + PAGE_LIMIT)
            .map((market, index) => (
              <MarketCard key={`${market.marketId}-${index}`} market={market} />
            ))}
      </section>
      <Pagination
        page={page}
        itemCount={filteredMarkets.length}
        itemsPerPage={PAGE_LIMIT}
        action={(page) => {
          setPage(page);
        }}
        updateLimit={null}
      />
    </div>
  );
};

export default MarketsView;
