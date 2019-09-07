import React, { Component } from 'react';
import {
  SORT_OPTIONS,
} from 'modules/common/constants';
import Styles from 'modules/filter-sort/components/filter-dropdowns.styles.less';
import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';
import { PAGINATION_PARAM_NAME } from 'modules/routes/constants/param-names';
import { SquareDropdown } from 'modules/common/selection';

const sortOptions = SORT_OPTIONS.map(option => {
  return {
    value: option.value,
    label: option.header,
  };
});

interface FilterSearchProps {
  defaultSort: string;
  updateSortOption: Function;
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
    const { updateSortOption } = this.props;

    this.goToPageOne();
    updateSortOption(value);
  }

  render() {
    const { defaultSort } = this.props;

    return (
      <div className={Styles.FilterDropdowns}>
        <SquareDropdown
          defaultValue={defaultSort}
          options={sortOptions}
          onChange={this.changeSortDropdown}
          stretchOutOnMobile
        />
      </div>
    );
  }
}
