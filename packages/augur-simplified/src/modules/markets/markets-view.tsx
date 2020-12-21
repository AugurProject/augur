import React from 'react';
import Styles from 'modules/markets/markets-view.styles.less';
import makePath from 'modules/routes/helpers/make-path';
import { MARKET, SIDEBAR_TYPES } from 'modules/constants';
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
import {
  categoryItems,
  currencyItems,
  ETH,
  INVALID_OUTCOME_ID,
  marketStatusItems,
  sortByItems,
  YES_OUTCOME_ID,
} from '../constants';

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
            {ammExchange && ammExchange?.cash.name === ETH ? EthIcon : UsdIcon}
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

const MarketsView = () => {
  const {
    isMobile,
    marketsViewSettings,
    actions: { setSidebar, updateMarketsViewSettings },
    processed: { markets },
  } = useAppStatusStore();
  const { sortBy, categories, reportingState, currency } = marketsViewSettings;

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
        {Object.values(markets).map((market, index) => (
          <MarketCard key={`${market.marketId}-${index}`} market={market} />
        ))}
      </section>
      <Pagination
        page={1}
        itemCount={10}
        itemsPerPage={9}
        action={() => null}
        updateLimit={() => null}
      />
    </div>
  );
};

export default MarketsView;
