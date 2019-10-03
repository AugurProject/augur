import React, { ReactNode } from 'react';
import classNames from 'classnames';

import BoxHeader from 'modules/portfolio/components/common/box-header';
import { NameValuePair } from 'modules/portfolio/types';
import { SearchSort } from 'modules/common/search-sort';
import { SquareDropdown } from 'modules/common/selection';

import Styles from 'modules/portfolio/components/common/quad-box.styles.less';

export interface QuadBoxProps {
  title: string;
  showFilterSearch?: boolean | undefined;
  sortByOptions?: any;
  updateDropdown?: any;
  onSearchChange?: any;
  content?: ReactNode;
  bottomBarContent?: ReactNode;
  bottomRightBarContent?: ReactNode;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  sortByStyles?: object;
  switchHeaders?: boolean;
  noBackgroundBottom?: boolean;
  search?: string;
  extraTitlePadding?: boolean;
  noBorders?: boolean;
  normalOnMobile?: boolean;
  toggle?: Function;
  hide?: boolean;
  extend?: boolean;
  hideHeader?: boolean;
}

const BoxHeaderElement = (props: QuadBoxProps) => (
  <BoxHeader
    extraTitlePadding={props.extraTitlePadding}
    title={props.title}
    normalOnMobile={props.normalOnMobile}
    switchHeaders={props.switchHeaders}
    noBorders={props.noBorders}
    leftContent={props.leftContent}
    rightContent={
      (props.showFilterSearch && (
        <SearchSort
          sortByOptions={props.sortByOptions}
          updateDropdown={props.updateDropdown}
          sortByStyles={props.sortByStyles}
          onChange={(value) => props.onSearchChange(value)}
          checkBox={props.leftContent}
        />
      )) ||
      props.rightContent
    }
    showToggle={Boolean(props.toggle)}
    toggle={props.toggle}
    hide={props.hide}
    extend={props.extend}
    bottomRightBarContent={props.bottomRightBarContent}
    bottomBarContent={props.bottomBarContent}
    noBackgroundBottom={props.noBackgroundBottom}
  />
);

const QuadBox = (props: QuadBoxProps) => (
  <div
    className={classNames(Styles.Quad, {
      [Styles.NoBorders]: props.noBorders,
      [Styles.NormalOnMobile]: props.normalOnMobile,
      [Styles.HideToggle]: props.hide,
      [Styles.Extend]: props.extend
    })}
  >
    {!props.hideHeader &&
      <div
        className={classNames({ [Styles.HideOnMobile]: !props.normalOnMobile })}
      >
        <BoxHeaderElement {...props} switchHeaders={false} />
      </div>
    }
    <div>
      <div
        className={classNames(Styles.ShowOnMobile, {
          [Styles.Hide]: props.normalOnMobile,
        })}
      >
        <BoxHeaderElement {...props} switchHeaders={props.switchHeaders} />
      </div>
      {props.content ? props.content : null}
    </div>
  </div>
);

export default QuadBox;
