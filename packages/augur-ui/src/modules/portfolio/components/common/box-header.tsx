import React, { ReactNode } from 'react';
import classNames from 'classnames';

import Styles from 'modules/portfolio/components/common/box-header.styles.less';
import { ToggleExtendButton } from 'modules/common/buttons';

export interface BoxHeaderProps {
  title: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  rows?: ReactNode;
  bottomBarContent?: ReactNode;
  bottomRightBarContent?: ReactNode;
  switchHeaders?: boolean;
  noBackgroundBottom?: boolean;
  mostRightContent?: ReactNode;
  extraTitlePadding?: boolean;
  noBorders?: boolean;
  normalOnMobile?: boolean;
  showToggle?: boolean;
  toggle?: Function;
  hide?: boolean;
  extend?: boolean;
  showHeaderOnMobile?: boolean;
  h1Title?: boolean;
}

const BoxHeader = ({
  title,
  leftContent,
  rightContent,
  rows,
  bottomBarContent,
  bottomRightBarContent,
  switchHeaders,
  noBackgroundBottom,
  mostRightContent,
  extraTitlePadding,
  noBorders,
  normalOnMobile,
  showToggle,
  toggle,
  hide,
  extend,
  showHeaderOnMobile,
  h1Title,
}: BoxHeaderProps) => (
  <>
    {!normalOnMobile && (
      <div className={Styles.ShowOnMobile}>
        <div>
          {rightContent && (
            <div className={Styles.RightContent}>{rightContent}</div>
          )}
          {showHeaderOnMobile && <div className={Styles.Title}>{title}</div>}
          {bottomRightBarContent && (
            <div className={Styles.BottomRightContent}>
              {bottomRightBarContent}
            </div>
          )}
        </div>
        <div
          className={classNames(Styles.Middle, {
            [Styles.isSwitched]: switchHeaders,
          })}
        >
          {bottomBarContent && (
            <div
              className={classNames(Styles.BottomContent, {
                [Styles.noBackground]: noBackgroundBottom,
                [Styles.NoTopMargin]: title,
              })}
            >
              {bottomBarContent}
            </div>
          )}
          {mostRightContent && (
            <div className={Styles.MostRightContent}>{mostRightContent}</div>
          )}
        </div>
      </div>
    )}
    <div
      className={classNames(Styles.BoxHeader, {
        [Styles.HideOnMobile]: !normalOnMobile,
        [Styles.ExtraTitlePadding]: extraTitlePadding,
        [Styles.NoBorders]: noBorders,
        [Styles.Normal]: normalOnMobile,
      })}
    >
      <div>
        <div>{h1Title ? <h1>{title}</h1> : title}</div>
        <div>
          {rightContent}
          {mostRightContent}
          {showToggle && <ToggleExtendButton toggle={toggle} />}
        </div>
      </div>
      {bottomBarContent && (
        <div>
          {bottomBarContent}
          {bottomRightBarContent}
        </div>
      )}
    </div>
  </>
);

export default BoxHeader;
