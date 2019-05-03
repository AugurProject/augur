import React, { ReactNode } from "react";
import classNames from "classnames";

import { SquareDropdown } from "modules/common-elements/selection";
import { SearchBar } from "modules/common-elements/search";
import { NameValuePair } from "modules/portfolio/types";

import Styles from "modules/common-elements/search-sort.styles";

export interface SearchSortProps {
  sortByOptions: Array<NameValuePair>;
  updateDropdown: Function;
  onChange: Function;
  bottomRightBarContent?: ReactNode;
  rightContent?: ReactNode;
  sortByStyles?: Object;
  isMobile?: Boolean;
}

export interface SearchSortState {
  showPercent: boolean;
}

export class SearchSort extends React.Component<
  SearchSortProps,
  SearchSortState
> {
  state: SearchSortState = {
    showSortByOptions: true
  };

  onFocus = hide => {
    if (!this.props.isMobile) this.setState({ showSortByOptions: hide });
  };

  render() {
    const {
      sortByOptions,
      updateDropdown,
      sortByStyles,
      onChange
    } = this.props;

    const { showSortByOptions } = this.state;

    return (
      <>
        <div className={classNames(Styles.SearchSort, Styles.ShowOnMobile)}>
          <SearchBar isMobile onFocus={this.onFocus} onChange={onChange} />
          {sortByOptions && (
            <div className={Styles.SearchSort_dropdown}>
              <SquareDropdown
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
