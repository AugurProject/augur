import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { orderBy } from "lodash";

import QuadBox from "modules/portfolio/components/common/quad-box";
import EmptyDisplay from "modules/portfolio/components/common/empty-display";
import makePath from "modules/routes/helpers/make-path";
import makeQuery from "modules/routes/helpers/make-query";

import { NotificationCard } from "modules/account/components/notification-card";
import { PillLabel } from "modules/common/labels";
import { MARKET } from "modules/routes/constants/views";
import {
  MARKET_ID_PARAM_NAME,
  RETURN_PARAM_NAME,
} from "modules/routes/constants/param-names";
import {
  OpenOrdersResolvedMarketsTemplate,
  ReportEndingSoonTemplate,
  DisputeTemplate,
  ClaimReportingFeesTemplate,
  UnsignedOrdersTemplate,
  ProceedsToClaimTemplate, MostLikelyInvalidMarketsTemplate, FinalizeWarpSyncMarketTemplate,
} from "modules/account/components/notifications-templates";

import { Notification, DateFormattedObject, QueryEndpoints } from "modules/types";

import {
  NOTIFICATION_TYPES,
  NOTIFICATIONS_TITLE,
  NOTIFICATIONS_LABEL,
  NEW,
} from "modules/common/constants";

import Styles from "modules/account/components/notification.styles.less";

export interface NotificationsProps extends RouteComponentProps {
  notifications: Notification[];
  updateReadNotifications: Function;
  getReportingFees: Function;
  currentAugurTimestamp: DateFormattedObject;
  disputingWindowEndTime: DateFormattedObject;
  finalizeMarketModal: Function;
  dispute: Function;
  showReportingModal: Function;
  claimMarketsProceeds: Function;
  claimReportingFees: Function;
  unsignedOrdersModal: Function;
  openOrdersModal: Function;
  toggle: Function;
  finalize: Function;
}

export interface NotificationsState {
  disabledNotifications: any;
}

const notificationsWithCountdown = [
  NOTIFICATION_TYPES.marketsInDispute,
  NOTIFICATION_TYPES.reportOnMarkets,
  NOTIFICATION_TYPES.proceedsToClaim,
];

class Notifications extends React.Component<
  NotificationsProps,
  NotificationsState
> {
  state: NotificationsState = {
    disabledNotifications: {},
  };

  getButtonAction(notification: Notification) {
    let buttonAction;
    const { location, history } = this.props;

    switch (notification.type) {
      case NOTIFICATION_TYPES.resolvedMarketsOpenOrders:
        buttonAction = () => {
          this.markAsRead(notification);
          this.disableNotification(notification.id, true);
          if (notification.market) {
            this.props.openOrdersModal(notification.market.id, () =>
              this.disableNotification(notification.id, false)
            );
          }
        };
        break;

      case NOTIFICATION_TYPES.reportOnMarkets:
        buttonAction = () => {
          this.markAsRead(notification);
          this.props.showReportingModal(notification.market.id);
        };
        break;

      case NOTIFICATION_TYPES.marketsInDispute:
        buttonAction = () => {
          this.markAsRead(notification);
          const queryLink = {
            [MARKET_ID_PARAM_NAME]: notification.market && notification.market.id,
            [RETURN_PARAM_NAME]: location.hash,
          };
          this.props.dispute(notification.market.id);
        };
        break;

      case NOTIFICATION_TYPES.unsignedOrders:
        buttonAction = () => {
          this.markAsRead(notification);
          if (notification.market) {
            this.props.unsignedOrdersModal(notification.market.id, () => {
              const queryLink: QueryEndpoints = {
                [MARKET_ID_PARAM_NAME]: notification.market && notification.market.id,
              };
              history.push({
                pathname: makePath(MARKET, null),
                search: makeQuery(queryLink),
              });
            });
          }
        };
        break;

      case NOTIFICATION_TYPES.claimReportingFees:
        buttonAction = () => {
          this.markAsRead(notification);
          this.props.claimReportingFees(notification.claimReportingFees);
        };
        break;

      case NOTIFICATION_TYPES.proceedsToClaim:
        buttonAction = () => {
          this.markAsRead(notification);
          this.disableNotification(notification.id, true);
          this.props.claimMarketsProceeds(notification.markets, () =>
            this.disableNotification(notification.id, false)
          );
        };
        break;

      case NOTIFICATION_TYPES.marketIsMostLikelyInvalid:
        buttonAction = () => {
          this.markAsRead(notification);
          const queryLink: QueryEndpoints = {
            [MARKET_ID_PARAM_NAME]: notification.market && notification.market.id,
          };
          history.push({
            pathname: makePath(MARKET, null),
            search: makeQuery(queryLink),
          });
        };
        break;

      case NOTIFICATION_TYPES.finalizeMarket:
          buttonAction = () => {
            this.markAsRead(notification);
            this.disableNotification(notification.id, true);
            this.props.finalize(notification.market.id, () =>
              this.disableNotification(notification.id, false)
            );
          };
          break;

      default:
        buttonAction = () => {
          this.markAsRead(notification);
        };
        break;
    }

    return {
      ...notification,
      buttonAction,
    };
  }

  disableNotification(id: string, disabled: boolean) {
    this.setState({
      disabledNotifications: {
        ...this.state.disabledNotifications,
        [id]: disabled,
      }
    });
  }

  markAsRead({ id }: Notification) {
    const newState = this.props.notifications.map(
      (notification: Notification | null) => {
        if (notification && notification.id === id) {
          notification.isNew = false;
        }

        return notification;
      }
    );

    this.props.updateReadNotifications(newState);
  }

  render() {
    const { currentAugurTimestamp, disputingWindowEndTime, toggle } = this.props;
    const notifications = this.props.notifications.map((notification) =>
      this.getButtonAction(notification)
    );
    const notificationCount = notifications.length;
    const newNotificationCount = notifications.filter((item) => item.isNew)
      .length;

    const rows = orderBy(notifications, 'isNew', ['desc']).filter(notification => !notification.hideNotification).map((notification) => {
      const {
        id,
        isImportant,
        redIcon,
        isNew,
        title,
        buttonLabel,
        buttonAction,
        market,
        markets,
        claimReportingFees,
        totalProceeds,
        type,
        queueName,
        queueId,
        hideCheckbox,
      } = notification;

      const templateProps = {
        claimReportingFees,
        totalProceeds,
        markets,
        market,
        currentTime: currentAugurTimestamp,
        disputingWindowEndTime,
        buttonAction,
        buttonLabel,
        type,
        queueName,
        queueId,
      };

      const notificationCardProps = {
        id,
        type,
        isImportant,
        redIcon,
        isNew,
        title,
        buttonLabel,
        buttonAction,
        hideCheckbox
      };

      const isDisabled: boolean =
        this.state.disabledNotifications[id] &&
        this.state.disabledNotifications[id] === true;
      const hasCounter = market && notificationsWithCountdown.includes(type);
      return (
        <NotificationCard
          key={id}
          noCounter={!hasCounter}
          {...notificationCardProps}
        >
          {type === NOTIFICATION_TYPES.resolvedMarketsOpenOrders ? (
            <OpenOrdersResolvedMarketsTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) as any : null}
          {type === NOTIFICATION_TYPES.reportOnMarkets ? (
            <ReportEndingSoonTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) as any : null}
          {type === NOTIFICATION_TYPES.marketsInDispute ? (
            <DisputeTemplate isDisabled={isDisabled} {...templateProps} />
          ) as any : null}
          {type === NOTIFICATION_TYPES.unsignedOrders ? (
            <UnsignedOrdersTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) as any : null}
          {type === NOTIFICATION_TYPES.claimReportingFees ? (
            <ClaimReportingFeesTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) as any : null}
          {type === NOTIFICATION_TYPES.proceedsToClaim ? (
            <ProceedsToClaimTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) as any : null}
          {type === NOTIFICATION_TYPES.marketIsMostLikelyInvalid ? (
            <MostLikelyInvalidMarketsTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) as any : null}
          {type === NOTIFICATION_TYPES.finalizeMarket ? (
            <FinalizeWarpSyncMarketTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) as any : null}
        </NotificationCard>
      );
    });

    const labelContent = (
      <div className={Styles.NewTopLabel}>
        {newNotificationCount > 0 && (
          <PillLabel label={`${newNotificationCount} ${NEW}`} hideOnMobile />
        )}
      </div>
    );

    return (
      <QuadBox
        title={NOTIFICATIONS_TITLE}
        rightContent={labelContent}
        toggle={toggle}
        customClass={notificationCount !== 0 && Styles.DarkBackgroundMobile}
        content={
          notificationCount === 0 ? (
            <EmptyDisplay
              selectedTab=""
              filterLabel={NOTIFICATIONS_LABEL}
              search=""
            />
          ) : (
            rows
          )
        }
      />
    );
  }
}

export default Notifications;
