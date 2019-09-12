import React, { ReactNode } from "react";
import classNames from "classnames";

import { SquareDropdown } from "modules/common/selection";
import { SearchBar } from "modules/common/search";
import { NameValuePair } from "modules/portfolio/types";

import Styles from "modules/common/search-sort.styles";

export interface SearchSortProps {
  sortByOptions: Array<NameValuePair>;
  updateDropdown: Function;
  onChange: Function;
  bottomRightBarContent?: ReactNode;
  rightContent?: ReactNode;
  sortByStyles?: Object;
  checkBox?: ReactNode;
}

export interface SearchSortState {
  showSortByOptions: Boolean;
  showCheckbox: boolean;
}

export class SearchSort extends React.Component<
  SearchSortProps,
  SearchSortState
> {
  state: SearchSortState = {
    showSortByOptions: true,
    showCheckbox: true
  };

  onFocus = (hide: Boolean) => {
    this.setState({ showSortByOptions: hide, showCheckbox: hide });
  };

  render() {
    const {
      sortByOptions,
      updateDropdown,
      sortByStyles,
      onChange,
      checkBox
    } = this.props;

    const { showSortByOptions, showCheckbox } = this.state;

    return (
      <>
        <div className={classNames(Styles.SearchSort, Styles.ShowOnMobile)}>
          {showCheckbox && checkBox}
          <SearchBar onFocus={this.onFocus} onChange={onChange} />
          {sortByOptions && (
            <div className={Styles.Dropdown}>
              <SquareDropdown
                defaultValue={sortByOptions[0].value}
                options={sortByOptions}
                onChange={updateDropdown}
                stretchOutOnMobile
                sortByStyles={sortByStyles}
              />
            </div>
          )}
        </div>
        <div className={classNames(Styles.SearchSort, Styles.HideOnMobile)}>
          {sortByOptions && (
            <SquareDropdown
              defaultValue={sortByOptions[0].value}
              className={classNames({ [Styles.Hide]: !showSortByOptions })}
              options={sortByOptions}
              onChange={updateDropdown}
              stretchOutOnMobile
              sortByStyles={sortByStyles}
            />
          )}
          <SearchBar onFocus={this.onFocus} onChange={onChange} />
        </div>
      </>
    );
  }
}
