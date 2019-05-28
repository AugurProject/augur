import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  MARKET_VOLUME,
  MARKET_CREATION_TIME,
  MARKET_END_DATE,
  MARKET_RECENTLY_TRADED,
  MARKET_FEE,
  MARKET_OPEN_INTEREST,
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
  MOBILE_MENU_STATES
} from "modules/common-elements/constants";
import Checkbox from "modules/common/components/checkbox/checkbox";
import Styles from "modules/filter-sort/components/filter-dropdowns/filter-dropdowns.styles";
import parseQuery from "modules/routes/helpers/parse-query";
import makeQuery from "modules/routes/helpers/make-query";
import { PAGINATION_PARAM_NAME } from "modules/routes/constants/param-names";
import { SquareDropdown } from "modules/common-elements/selection";
import { FilterButton } from "modules/common-elements/buttons";

const sortOptions = [
  { value: MARKET_CREATION_TIME, label: "Creation Time" },
  { value: MARKET_END_DATE, label: "End Time" },
  { value: MARKET_RECENTLY_TRADED, label: "Recently Traded" },
  { value: MARKET_VOLUME, label: "Volume" },
  { value: MARKET_FEE, label: "Settlement Fee" },
  { value: MARKET_OPEN_INTEREST, label: "Open Interest" }
];

const filterOptions = [
  { value: MARKET_OPEN, label: "Open" },
  { value: MARKET_REPORTING, label: "In Reporting" },
  { value: MARKET_CLOSED, label: "Resolved" }
];

const maxFeesOptions = [
  { label: "All Fees", value: MAX_FEE_100_PERCENT },
  { label: "Fees < 2%", value: MAX_FEE_02_PERCENT },
  { label: "Fees < 5%", value: MAX_FEE_05_PERCENT },
  { label: "Fees < 10%", value: MAX_FEE_10_PERCENT },
  { label: "Fees < 20%", value: MAX_FEE_20_PERCENT },
  { label: "Fees < 30%", value: MAX_FEE_30_PERCENT },
  { label: "Fees < 40%", value: MAX_FEE_40_PERCENT }
];

export default class FilterSearch extends Component {
  static propTypes = {
    filter: PropTypes.string.isRequired,
    sort: PropTypes.string.isRequired,
    maxFee: PropTypes.string.isRequired,
    updateFilter: PropTypes.func.isRequired,
    defaultFilter: PropTypes.string.isRequired,
    defaultSort: PropTypes.string.isRequired,
    defaultMaxFee: PropTypes.string.isRequired,
    hasOrders: PropTypes.bool.isRequired,
    updateFilterOption: PropTypes.func.isRequired,
    updateSortOption: PropTypes.func.isRequired,
    updateMaxFee: PropTypes.func.isRequired,
    updateHasOpenOrders: PropTypes.func.isRequired,
    updateMobileMenuState: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

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
    history.push({
      ...location,
      search: updatedSearch
    });
  }

  changeSortDropdown(value) {
    const {
      filter,
      updateSortOption,
      updateFilter,
      maxFee,
      hasOrders
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
      hasOrders
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
      updateHasOpenOrders
    } = this.props;
    const hasOpenOrders = !hasOrders;
    updateHasOpenOrders(hasOpenOrders);
    updateFilter({
      filter,
      sort,
      maxFee,
      hasOrders: hasOpenOrders
    });
  }

  render() {
    const {
      defaultFilter,
      defaultSort,
      defaultMaxFee,
      hasOrders,
      updateMobileMenuState
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
          type="checkbox"
          name="hasOrders"
          isChecked={hasOrders}
          value={hasOrders}
          onClick={this.changeHasOrders}
        />
        <label htmlFor="has-orders">has open orders</label>
      </div>
    );
  }
}
