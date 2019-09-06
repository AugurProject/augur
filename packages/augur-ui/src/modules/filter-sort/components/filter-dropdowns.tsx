import React, { Component } from 'react';
import {
  MARKET_SORT_PARAMS,
  MOBILE_MENU_STATES,
} from 'modules/common/constants';
import Styles from 'modules/filter-sort/components/filter-dropdowns.styles.less';
import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';
import { PAGINATION_PARAM_NAME } from 'modules/routes/constants/param-names';
import { SquareDropdown } from 'modules/common/selection';
import { FilterButton } from 'modules/common/buttons';

const sortOptions = [
  { value: MARKET_SORT_PARAMS.LIQUIDITY, label: 'Highest liquidity' },
  { value: MARKET_SORT_PARAMS.OPEN_INTEREST, label: 'Highest open interest' },
  { value: MARKET_SORT_PARAMS.VOLUME, label: 'Highest volume' },
  { value: MARKET_SORT_PARAMS.CREATION_TIME, label: 'Recently created' },
  { value: MARKET_SORT_PARAMS.END_DATE, label: 'Ending soon ' },
  { value: MARKET_SORT_PARAMS.RECENTLY_TRADED, label: 'Recently Traded' },
  {
    value: MARKET_SORT_PARAMS.LAST_LIQUIDITY_DEPLETED,
    label: 'Recently depleted liquidity',
  },
];

interface FilterSearchProps {
  filter: string;
  sort: string;
  updateFilter: Function;
  defaultFilter: string;
  defaultSort: string;
  updateFilterOption: Function;
  updateSortOption: Function;
  updateMobileMenuState: Function;
  history: History;
  location: Location;
}

export default class FilterSearch extends Component<FilterSearchProps> {
  constructor(props) {
    super(props);
    this.changeSortDropdown = this.changeSortDropdown.bind(this);
    this.goToPageOne = this.goToPageOne.bind(this);
  }

  goToPageOne() {
    const { history, location } = this.props;
    let updatedSearch = parseQuery(location.search);

    delete updatedSearch[PAGINATION_PARAM_NAME];
    updatedSearch = makeQuery(updatedSearch);
    // @ts-ignore
    history.push({
      ...location,
      search: updatedSearch,
    });
  }

  changeSortDropdown(value) {
    const { filter, updateSortOption, updateFilter } = this.props;

    this.goToPageOne();
    updateSortOption(value);
    updateFilter({ filter, sort: value });
  }

  render() {
    const { defaultSort, updateMobileMenuState } = this.props;

    return (
      <div className={Styles.FilterDropdowns}>
        <SquareDropdown
          defaultValue={defaultSort}
          options={sortOptions}
          onChange={this.changeSortDropdown}
          stretchOutOnMobile
        />

        {/* MOBILE FILTERS TOGGLE */}
        <FilterButton
          action={() =>
            updateMobileMenuState(MOBILE_MENU_STATES.FIRSTMENU_OPEN)
          }
        />
      </div>
    );
  }
}
