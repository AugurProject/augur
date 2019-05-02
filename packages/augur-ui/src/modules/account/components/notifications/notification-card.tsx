import React from "react";
import classNames from "classnames";

import * as constants from "modules/common-elements/constants";
import { ImmediateImportance } from "modules/common-elements/icons";
import { PillLabel } from "modules/common-elements/labels";

import Styles from "modules/account/components/notifications/notification-card.styles";

export interface NotificationProps {
  isImportant: boolean;
  isNew: boolean;
  title: string;
  children: React.StatelessComponent;
}

export const NotificationCard = (props: NotificationProps) => (
  <div
    className={classNames(Styles.NotificationCard, {
      [Styles.new]: props.isNew
    })}
  >
    <div className={Styles.NotificationCard__content}>
      <div className={Styles.NotificationCard__content__titleBar}>
        {props.isImportant && (
          <span className={Styles.NotificationCard__content__Importance}>
            {ImmediateImportance}
          </span>
        )}
        <span
          className={classNames(Styles.NotificationCard__content__title, {
            [Styles.NotificationCard__content__title__new]: props.isNew
          })}
        >
          {props.title}
        </span>
        {props.isNew && <PillLabel label={constants.NEW} />}
      </div>
      <div
        className={classNames(Styles.NotificationCard__content__message, {
          [Styles.NotificationCard__content__message__new]: props.isNew
        })}
      >
        {props.children}
      </div>
    </div>
  </div>
);
