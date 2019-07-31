import React, { ReactNode } from "react";
import classNames from "classnames";

import Styles from "modules/portfolio/components/common/box-header.styles.less";

export interface BoxHeaderProps {
  title: string;
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
}

const BoxHeader = (props: BoxHeaderProps) => (
  <>
    <div className={Styles.ShowOnMobile}>
      <div className={Styles.RightContent}>
        {props.rightContent}
      </div>
      <div
        className={classNames(Styles.Middle, {
          [Styles.isSwitched]: props.switchHeadersx
        })}
      >
        {props.bottomBarContent && (
          <div
            className={classNames(Styles.BottomContent, {
              [Styles.noBackground]: props.noBackgroundBottom
            })}
          >
            {props.bottomBarContent}
          </div>
        )}
        {props.mostRightContent && (
          <div className={Styles.MostRightContent}>
            {props.mostRightContent}
          </div>
        )}
      </div>
      {props.bottomRightBarContent && (
        <div className={Styles.BottomRightContent}>
          {props.bottomRightBarContent}
        </div>
      )}
    </div>
    <div 
      className={
        classNames(Styles.BoxHeader, 
          {
            [Styles.HideOnMobile]: !props.normalOnMobile,
            [Styles.ExtraTitlePadding]: props.extraTitlePadding, 
            [Styles.NoBorders]: props.noBorders,
            [Styles.Normal]: props.normalOnMobile
          }
        )
      }
    >
      <div>
        <div>{props.title}</div>
        <div>
          {props.rightContent}
          {props.mostRightContent}
        </div>
      </div>
      {props.bottomBarContent && (
        <div>
          {props.bottomBarContent}
          {props.bottomRightBarContent}
        </div>
      )}
    </div>
  </>
);

export default BoxHeader;
