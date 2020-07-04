import React from 'react';
import classNames from 'classnames';
import { Location, History } from 'history';
import FilterSearch from 'modules/filter-sort/containers/filter-search';
import parseQuery from 'modules/routes/helpers/parse-query';
import {
  CATEGORY_PARAM_NAME,
  MOBILE_MENU_STATES,
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
  updateMarketsListCardFormat: Function;
  updateMobileMenuState: (mobileMenuState: number) => void;
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

const MarketsHeader: React.FC<MarketsHeaderProps> = props => {
  const {
    isSearchingMarkets,
    updateMobileMenuState,
    location,
    selectedCategory,
    search,
    marketCardFormat,
    updateMarketsListCardFormat
  } = props;
  const [headerTitle, setHeaderTitle] = React.useState(
    getHeaderTitleFromProps(search, location, selectedCategory)
  );

  React.useEffect(() => {
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
        <FilterButton
          action={() =>
            updateMobileMenuState(MOBILE_MENU_STATES.FIRSTMENU_OPEN)
          }
        />
      </div>
      <div>
        <h2>{headerTitle}</h2>
        <FilterSearch isSearchingMarkets={isSearchingMarkets} />
        <MarketCardFormatSwitcher
          marketCardFormat={marketCardFormat}
          updateMarketsListCardFormat={updateMarketsListCardFormat}
        />
        <FilterDropDowns />
      </div>
    </article>
  );
};

export default MarketsHeader;
