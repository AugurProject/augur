import React from "react";
import classNames from "classnames";

import * as constants from "modules/common-elements/constants";
import { ImmediateImportance } from "modules/common-elements/icons";
import { PillLabel } from "modules/common-elements/labels";

import Styles from "modules/account/components/notification.styles";

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
    <section>
      <div className={Styles.TitleBar}>
        {props.isImportant && (
          <span className={Styles.Importance}>
            {ImmediateImportance}
          </span>
        )}
        <span
          className={classNames(Styles.Title, {
            [Styles.TitleNew]: props.isNew
          })}
        >
          {props.title}
        </span>
        {props.isNew && <PillLabel label={constants.NEW} />}
      </div>
      <div
        className={classNames(Styles.Message, {
          [Styles.MessageNew]: props.isNew
        })}
      >
        {props.children}
      </div>
    </section>
  </div>
);
