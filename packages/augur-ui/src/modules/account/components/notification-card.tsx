import React from "react";
import classNames from "classnames";

import * as constants from "modules/common/constants";
import { ImmediateImportance } from "modules/common/icons";
import { PillLabel } from "modules/common/labels";

import Styles from "modules/account/components/notification.styles.less";

export interface NotificationProps {
  isImportant: boolean;
  redIcon?: boolean;
  isNew: boolean;
  title: string;
  noCounter: boolean;
  hideCheckbox?: boolean;
  children: React.StatelessComponent | Array<React.StatelessComponent>;
}

export const NotificationCard = ({ isNew, isImportant, redIcon, title, children, noCounter, hideCheckbox }: NotificationProps) => (
  <div
    className={classNames(Styles.NotificationCard, {
      [Styles.NewNotificationCard]: isNew,
      [Styles.noCounter]: noCounter,
      [Styles.HasCheckbox]: hideCheckbox
    })}
  >
    <section>
      <div className={Styles.TitleBar}>
        {isImportant && (
          <span className={classNames(Styles.Importance, {
            [Styles.ImportantRed]: redIcon,
          })}
          >
            {ImmediateImportance}
          </span>
        )}
        <span
          className={classNames(Styles.Title, {
            [Styles.TitleNew]: isNew,
          })}
        >
          {title}
        </span>
        {isNew && <PillLabel label={constants.NEW} />}
      </div>
      <div
        className={classNames(Styles.Message, {
          [Styles.MessageNew]: isNew,
        })}
      >
        {children}
      </div>
    </section>
  </div>
);
