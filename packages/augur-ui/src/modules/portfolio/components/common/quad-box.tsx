import React, { ReactNode } from "react";

import BoxHeader from "modules/portfolio/components/common/box-header";
import { NameValuePair } from "modules/portfolio/types";
import { SearchSort } from "modules/common/search-sort";
import { SquareDropdown } from "modules/common/selection";

import Styles from "modules/portfolio/components/common/quad-box.styles.less";

export interface QuadBoxProps {
  title: string;
  showFilterSearch?: boolean | undefined;
  sortByOptions?: any;
  updateDropdown?: any;
  onSearchChange?: any;
  content?: ReactNode;
  bottomBarContent?: ReactNode;
  bottomRightBarContent?: ReactNode;
  rightContent?: ReactNode;
  sortByStyles?: object;
  switchHeaders?: boolean;
  noBackgroundBottom?: boolean;
  search?: string;
}

const BoxHeaderElement = (props: QuadBoxProps) => (
  <BoxHeader
    title={props.title}
    switchHeaders={props.switchHeaders}
    rightContent={
      (props.showFilterSearch && (
        <SearchSort
          sortByOptions={!props.switchHeaders && props.sortByOptions}
          updateDropdown={props.updateDropdown}
          sortByStyles={props.sortByStyles}
          onChange={props.onSearchChange}
        />
      )) ||
      props.rightContent
    }
    mostRightContent={
      props.switchHeaders && (
        <SquareDropdown
          options={props.sortByOptions}
          onChange={props.updateDropdown}
          stretchOutOnMobile
          sortByStyles={props.sortByStyles}
        />
      )
    }
    bottomRightBarContent={props.bottomRightBarContent}
    bottomBarContent={props.bottomBarContent}
    noBackgroundBottom={props.noBackgroundBottom}
  />
);

const QuadBox = (props: QuadBoxProps) => (
  <div className={Styles.Quad}>
    <div className={Styles.HideOnMobile}>
      <BoxHeaderElement {...props} switchHeaders={false} />
    </div>
    <div>
      <div className={Styles.ShowOnMobile}>
        <BoxHeaderElement
          {...props}
          switchHeaders={props.switchHeaders}
        />
      </div>
      {(props.content) ? props.content : null}
    </div>
  </div>
);

export default QuadBox;
