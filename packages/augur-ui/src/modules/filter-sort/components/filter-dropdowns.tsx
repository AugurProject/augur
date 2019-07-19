import React, { Component } from "react";
import {
  MARKET_SORT_PARAMS,
  MARKET_OPEN,
  MARKET_REPORTING,
  MARKET_CLOSED,
  MAX_FEE_02_PERCENT,
  MAX_FEE_05_PERCENT,
  MAX_FEE_100_PERCENT,
  MAX_FEE_10_PERCENT,
  MAX_FEE_20_PERCENT,
  MAX_FEE_30_PERCENT,
  MAX_FEE_40_PERCENT,
  MOBILE_MENU_STATES,
} from "modules/common/constants";
import { Checkbox } from "modules/common/form";
import Styles from "modules/filter-sort/components/filter-dropdowns.styles.less";
import parseQuery from "modules/routes/helpers/parse-query";
import makeQuery from "modules/routes/helpers/make-query";
import { PAGINATION_PARAM_NAME } from "modules/routes/constants/param-names";
import { SquareDropdown } from "modules/common/selection";
import { FilterButton } from "modules/common/buttons";

const sortOptions = [
  { value: MARKET_SORT_PARAMS.CREATION_TIME, label: "Creation Time" },
  { value: MARKET_SORT_PARAMS.END_DATE, label: "End Time" },
  { value: MARKET_SORT_PARAMS.RECENTLY_TRADED, label: "Recently Traded" },
  { value: MARKET_SORT_PARAMS.VOLUME, label: "Volume" },
  { value: MARKET_SORT_PARAMS.CREATOR_FEE_RATE, label: "Settlement Fee" },
  { value: MARKET_SORT_PARAMS.OPEN_INTEREST, label: "Open Interest" },
];

const filterOptions = [
  { value: MARKET_OPEN, label: "Open" },
  { value: MARKET_REPORTING, label: "In Reporting" },
  { value: MARKET_CLOSED, label: "Resolved" },
];

const maxFeesOptions = [
  { label: "All Fees", value: MAX_FEE_100_PERCENT },
  { label: "Fees < 2%", value: MAX_FEE_02_PERCENT },
  { label: "Fees < 5%", value: MAX_FEE_05_PERCENT },
  { label: "Fees < 10%", value: MAX_FEE_10_PERCENT },
  { label: "Fees < 20%", value: MAX_FEE_20_PERCENT },
  { label: "Fees < 30%", value: MAX_FEE_30_PERCENT },
  { label: "Fees < 40%", value: MAX_FEE_40_PERCENT },
];

interface FilterSearchProps {
  filter: string;
  sort: string;
  maxFee: string;
  updateFilter: Function;
  defaultFilter: string;
  defaultSort: string;
  defaultMaxFee: string;
  hasOrders: boolean;
  updateFilterOption: Function;
  updateSortOption: Function;
  updateMaxFee: Function;
  updateHasOpenOrders: Function;
  updateMobileMenuState: Function;
  history: History;
  location: Location;
}

export default class FilterSearch extends Component<FilterSearchProps> {
  constructor(props) {
    super(props);
    this.changeSortDropdown = this.changeSortDropdown.bind(this);
    this.changeFilterDropdown = this.changeFilterDropdown.bind(this);
    this.changeMaxFees = this.changeMaxFees.bind(this);
    this.goToPageOne = this.goToPageOne.bind(this);
    this.changeHasOrders = this.changeHasOrders.bind(this);
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
    const {
      filter,
      updateSortOption,
      updateFilter,
      maxFee,
      hasOrders,
    } = this.props;

    this.goToPageOne();
    updateSortOption(value);
    updateFilter({ filter, sort: value, maxFee, hasOrders });
  }

  changeFilterDropdown(value) {
    const {
      sort,
      updateFilterOption,
      updateFilter,
      maxFee,
      hasOrders,
    } = this.props;

    this.goToPageOne();
    updateFilterOption(value);
    updateFilter({ filter: value, sort, maxFee, hasOrders });
  }

  changeMaxFees(maxFee) {
    const { sort, filter, updateMaxFee, hasOrders, updateFilter } = this.props;

    this.goToPageOne();
    updateMaxFee(maxFee);
    updateFilter({ filter, sort, maxFee, hasOrders });
  }

  changeHasOrders(event) {
    const {
      filter,
      sort,
      maxFee,
      updateFilter,
      hasOrders,
      updateHasOpenOrders,
    } = this.props;
    const hasOpenOrders = !hasOrders;
    updateHasOpenOrders(hasOpenOrders);
    updateFilter({
      filter,
      sort,
      maxFee,
      hasOrders: hasOpenOrders,
    });
  }

  render() {
    const {
      defaultFilter,
      defaultSort,
      defaultMaxFee,
      hasOrders,
      updateMobileMenuState,
    } = this.props;

    return (
      <div className={Styles.FilterDropdowns}>
        <SquareDropdown
          defaultValue={defaultFilter}
          onChange={this.changeFilterDropdown}
          options={filterOptions}
        />
        <SquareDropdown
          defaultValue={defaultSort}
          onChange={this.changeSortDropdown}
          options={sortOptions}
        />
        <SquareDropdown
          defaultValue={defaultMaxFee}
          onChange={this.changeMaxFees}
          options={maxFeesOptions}
        />
        <FilterButton
          action={() =>
            updateMobileMenuState(MOBILE_MENU_STATES.FIRSTMENU_OPEN)
          }
        />
        <Checkbox
          id="has-orders"
          isChecked={hasOrders}
          onClick={this.changeHasOrders}
        />
        <label htmlFor="has-orders">has open orders</label>
      </div>
    );
  }
}
