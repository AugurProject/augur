import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  MARKET_VOLUME,
  MARKET_CREATION_TIME,
  MARKET_END_DATE,
  MARKET_RECENTLY_TRADED,
  MARKET_FEE
} from "modules/filter-sort/constants/market-sort-params";
import {
  MARKET_OPEN,
  MARKET_REPORTING,
  MARKET_CLOSED
} from "modules/filter-sort/constants/market-states";
import Dropdown from "modules/common/components/dropdown/dropdown";
import Styles from "modules/filter-sort/components/filter-dropdowns/filter-dropdowns.styles";

const sortOptions = [
  { value: MARKET_CREATION_TIME, label: "Creation Time" },
  { value: MARKET_END_DATE, label: "End Time" },
  { value: MARKET_RECENTLY_TRADED, label: "Recently Traded" },
  { value: MARKET_VOLUME, label: "Volume" },
  { value: MARKET_FEE, label: "Settlement Fee" }
];

const filterOptions = [
  { value: MARKET_OPEN, label: "Open" },
  { value: MARKET_REPORTING, label: "In Reporting" },
  { value: MARKET_CLOSED, label: "Resolved" }
];

export default class FilterSearch extends Component {
  static propTypes = {
    filter: PropTypes.string.isRequired,
    sort: PropTypes.string.isRequired,
    updateFilter: PropTypes.func.isRequired,
    defaultFilter: PropTypes.string.isRequired,
    defaultSort: PropTypes.string.isRequired,
    updateFilterOption: PropTypes.func.isRequired,
    updateSortOption: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.changeSortDropdown = this.changeSortDropdown.bind(this);
    this.changeFilterDropdown = this.changeFilterDropdown.bind(this);
  }

  changeSortDropdown(value) {
    const { filter, updateSortOption, updateFilter } = this.props;

    updateSortOption(value);
    updateFilter({ filter, sort: value });
  }

  changeFilterDropdown(value) {
    const { sort, updateFilterOption, updateFilter } = this.props;

    updateFilterOption(value);
    updateFilter({ filter: value, sort });
  }

  render() {
    const { defaultFilter, defaultSort } = this.props;

    return (
      <div className={Styles.FilterDropdowns}>
        <Dropdown
          default={defaultFilter}
          onChange={this.changeFilterDropdown}
          options={filterOptions}
          alignLeft
        />
        <Dropdown
          default={defaultSort}
          onChange={this.changeSortDropdown}
          options={sortOptions}
        />
      </div>
    );
  }
}
