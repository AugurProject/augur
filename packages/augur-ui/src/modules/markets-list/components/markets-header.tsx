import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Location, History } from 'history';
import FilterSearch from 'modules/filter-sort/containers/filter-search';
import parseQuery from 'modules/routes/helpers/parse-query';
import {
  CATEGORY_PARAM_NAME,
} from 'modules/common/constants';
import MarketCardFormatSwitcher from 'modules/filter-sort/components/market-card-format-switcher';
import Styles from 'modules/markets-list/components/markets-header.styles.less';
import { FilterButton } from 'modules/common/buttons';
import FilterDropDowns from 'modules/filter-sort/containers/filter-dropdowns';

interface MarketsHeaderProps {
  location: Location;
  history: History;
  filter: string;
  sort: string;
  isSearchingMarkets: boolean;
  selectedCategory: string[];
  search: string;
  marketCardFormat: string;
}

const getHeaderTitleFromProps = (
  search: string,
  location: Location,
  selectedCategory: string[]
) => {
  if (search) {
    if (search.endsWith('*')) {
      search = search.slice(0, -1)
    }
    return `Search: "${search}"`;
  }

  const searchParams = parseQuery(location.search);

  if (searchParams[CATEGORY_PARAM_NAME]) {
    return searchParams[CATEGORY_PARAM_NAME];
  }

  if (selectedCategory && selectedCategory.length > 0) {
    return selectedCategory[selectedCategory.length - 1];
  }

  return "Popular markets";
};

const MarketsHeader: React.FC<MarketsHeaderProps> = ({
  isSearchingMarkets,
  location,
  selectedCategory,
  search,
}) => {
  const [headerTitle, setHeaderTitle] = useState(
    getHeaderTitleFromProps(search, location, selectedCategory)
  );

  useEffect(() => {
    const nextHeaderTitle = getHeaderTitleFromProps(
      search,
      location,
      selectedCategory
    );

    setHeaderTitle(nextHeaderTitle);
  }, [location, selectedCategory, search]);

  return (
    <article
      className={classNames(Styles.MarketsHeader, {
        [Styles.DisableFilters]: isSearchingMarkets,
      })}
    >
      <div>
        <FilterSearch isSearchingMarkets={isSearchingMarkets} />
        {/* MOBILE FILTERS TOGGLE */}
        <FilterButton />
      </div>
      <div>
        <h2>{headerTitle}</h2>
        <FilterSearch isSearchingMarkets={isSearchingMarkets} />
        <MarketCardFormatSwitcher />
        <FilterDropDowns />
      </div>
    </article>
  );
};

export default MarketsHeader;
