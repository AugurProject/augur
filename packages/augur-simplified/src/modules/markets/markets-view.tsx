import React from 'react';
import Styles from 'modules/markets/markets-view.styles.less';
import makePath from 'modules/routes/helpers/make-path';
import {
  MARKET,
} from 'modules/constants';
import { Link } from 'react-router-dom';
import {
  ValueLabel,
  AppViewStats,
  CategoryLabel,
  CategoryIcon,
} from 'modules/common/labels';
import { formatDai } from 'utils/format-number';
import { EthIcon, UsdIcon } from 'modules/common/icons';
import classNames from 'classnames';
import { PrimaryButton } from 'modules/common/buttons';
import { SquareDropdown } from 'modules/common/selection';
import { Pagination } from 'modules/common/pagination';
import { useAppStatusStore } from 'modules/stores/app-status';

const OutcomesTable = ({ outcomes }) => {
  return (
    <div className={Styles.OutcomesTable}>
      {outcomes.map((outcome) => (
        <div key={`${outcome.description}-${outcome.price}-${outcome.id}`}>
          <span>{outcome.description}</span>
          <span>{formatDai(outcome.price).full}</span>
        </div>
      ))}
    </div>
  );
};

const MarketCard = ({ market }) => {
  return (
    <article
      className={classNames(Styles.MarketCard, {
        [Styles.NoLiquidity]: market.noLiquidity,
      })}
    >
      <Link to={makePath(MARKET)}>
        <div>
          <CategoryIcon category={market.category} />
          <CategoryLabel category={market.subcategory} />
          <div>{market.inUsd ? UsdIcon : EthIcon}</div>
          <span>{market.description}</span>
          {market.noLiquidity ? (
            <div>
              <span>Market requires Initial liquidity</span>
              <PrimaryButton text="Earn fees as a liquidity provider" />
            </div>
          ) : (
            <>
              <ValueLabel
                label="total volume"
                value={formatDai(market.volume).full}
              />
              <OutcomesTable outcomes={market.outcomes} />
            </>
          )}
        </div>
      </Link>
    </article>
  );
};
// TODO: when we have real data we can pull this out and simpley do a map to m[1]
const TEMPORARY_FILTER = (ml) => ml.map(m => m[0] !== '0xdeadbeef' ? m[1] : null).filter(i => !!i);

const MarketsView = () => {
  const { marketInfos } = useAppStatusStore();
  const markets = TEMPORARY_FILTER(Object.entries(marketInfos));
  return (
    <div className={Styles.MarketsView}>
      <AppViewStats showCashAmounts />
      <ul>
        <SquareDropdown
          onChange={() => null}
          options={[
            { label: 'Open', value: 0 },
            { label: 'Closed', value: 1 },
          ]}
          defaultValue="All Markets"
        />
        <SquareDropdown
          onChange={() => null}
          options={[
            { label: 'Open', value: 0 },
            { label: 'Closed', value: 1 },
          ]}
          defaultValue="Volume"
        />
        <SquareDropdown
          onChange={() => null}
          options={[
            { label: 'Open', value: 0 },
            { label: 'Closed', value: 1 },
          ]}
          defaultValue="Open"
        />
        <SquareDropdown
          onChange={() => null}
          options={[
            { label: 'Open', value: 0 },
            { label: 'Closed', value: 1 },
          ]}
          defaultValue="All Currencies"
        />
      </ul>
      <section>
        {markets.map((market) => (
          <MarketCard key={market.id} market={market} />
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
