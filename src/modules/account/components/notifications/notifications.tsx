import React, { ReactNode } from "react";
import { RouteComponentProps } from "react-router-dom";
import { orderBy } from "lodash";

import QuadBox from "modules/portfolio/components/common/quads/quad-box";
import EmptyDisplay from "modules/portfolio/components/common/tables/empty-display";
import makePath from "modules/routes/helpers/make-path";
import makeQuery from "modules/routes/helpers/make-query";

import { NotificationCard } from "modules/account/components/notifications/notification-card";
import { PillLabel } from "modules/common-elements/labels";
import { MARKET, REPORT, DISPUTE } from "modules/routes/constants/views";
import {
  MARKET_ID_PARAM_NAME,
  RETURN_PARAM_NAME
} from "modules/routes/constants/param-names";
import {
  Market,
  FinalizeTemplate,
  OpenOrdersResolvedMarketsTemplate,
  ReportEndingSoonTemplate,
  DisputeTemplate,
  SellCompleteSetTemplate,
  ClaimReportingFeesTemplate,
  UnsignedOrdersTemplate,
  ProceedsToClaimTemplate,
  ProceedsToClaimOnHoldTemplate,
  OrphanOrdersTemplate
} from "modules/account/components/notifications/notifications-templates";

import * as constants from "modules/common-elements/constants";

export interface INotifications {
  id: string;
  type: string;
  isImportant: boolean;
  isNew: boolean;
  title: string;
  buttonLabel: string;
  buttonAction: Function;
  Template: ReactNode;
  market: Market | null;
  markets: Array<string>;
  claimReportingFees?: Object;
  totalProceeds?: number;
}

export interface NotificationsProps extends RouteComponentProps {
  notifications: Array<INotifications>;
  isMobile: boolean;
  updateReadNotifications: Function;
  getReportingFees: Function;
  currentAugurTimestamp: number;
  reportingWindowStatsEndTime: number;
  sellCompleteSetsModal: Function;
  finalizeMarketModal: Function;
  claimTradingProceeds: Function;
  claimReportingFees: Function;
  unsignedOrdersModal: Function;
  openOrdersModal: Function;
}

export interface NotificationsState {
  disabledNotifications: any;
}

const { NOTIFICATION_TYPES } = constants;

class Notifications extends React.Component<
  NotificationsProps,
  NotificationsState
> {
  state: NotificationsState = {
    disabledNotifications: {}
  };

  getButtonAction(notification: INotifications) {
    let buttonAction;
    const { location, history } = this.props;

    switch (notification.type) {
      case NOTIFICATION_TYPES.resolvedMarketsOpenOrders:
        buttonAction = () => {
          this.markAsRead(notification);
          this.disableNotification(notification.id, true);
          this.props.openOrdersModal(notification.market.id, () =>
            this.disableNotification(notification.id, false)
          );
        };
        break;

      case NOTIFICATION_TYPES.reportOnMarkets:
        buttonAction = () => {
          this.markAsRead(notification);
          const queryLink = {
            [MARKET_ID_PARAM_NAME]: notification.market.id,
            [RETURN_PARAM_NAME]: location.hash
          };
          history.push({
            pathname: makePath(REPORT),
            search: makeQuery(queryLink)
          });
        };
        break;

      case NOTIFICATION_TYPES.finalizeMarkets:
        buttonAction = () => {
          this.markAsRead(notification);
          this.disableNotification(notification.id, true);
          this.props.finalizeMarketModal(notification.market.id, () =>
            this.disableNotification(notification.id, false)
          );
        };
        break;

      case NOTIFICATION_TYPES.marketsInDispute:
        buttonAction = () => {
          this.markAsRead(notification);
          const queryLink = {
            [MARKET_ID_PARAM_NAME]: notification.market.id,
            [RETURN_PARAM_NAME]: location.hash
          };
          history.push({
            pathname: makePath(DISPUTE),
            search: makeQuery(queryLink)
          });
        };
        break;

      case NOTIFICATION_TYPES.completeSetPositions:
        buttonAction = () => {
          this.markAsRead(notification);
          this.disableNotification(notification.id, true);
          this.props.sellCompleteSetsModal(
            notification.market.id,
            notification.market.myPositionsSummary.numCompleteSets,
            () => this.disableNotification(notification.id, false)
          );
        };
        break;

      case NOTIFICATION_TYPES.unsignedOrders:
        buttonAction = () => {
          this.markAsRead(notification);
          this.disableNotification(notification.id, true);
          this.props.unsignedOrdersModal(notification.market.id, () =>
            this.disableNotification(notification.id, false)
          );
        };
        break;

      case NOTIFICATION_TYPES.claimReportingFees:
        buttonAction = () => {
          this.markAsRead(notification);
          this.props.claimReportingFees(
            notification.claimReportingFees,
            () => null
          );
        };
        break;

      case NOTIFICATION_TYPES.proceedsToClaim:
        buttonAction = () => {
          this.markAsRead(notification);
          this.disableNotification(notification.id, true);
          this.props.claimTradingProceeds(() =>
            this.disableNotification(notification.id, false)
          );
        };
        break;

      case NOTIFICATION_TYPES.proceedsToClaimOnHold:
        buttonAction = () => {
          this.markAsRead(notification);
          const queryLink = {
            [MARKET_ID_PARAM_NAME]: notification.market.id,
            [RETURN_PARAM_NAME]: location.hash
          };
          history.push({
            pathname: makePath(MARKET),
            search: makeQuery(queryLink)
          });
        };
        break;

      case NOTIFICATION_TYPES.orphanOrders:
        buttonAction = () => {
          this.markAsRead(notification);
          const queryLink = {
            [MARKET_ID_PARAM_NAME]: notification.market.id,
            [RETURN_PARAM_NAME]: location.hash
          };
          history.push({
            pathname: makePath(MARKET),
            search: makeQuery(queryLink)
          });
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
      buttonAction
    };
  }

  disableNotification(id: string, disabled: boolean) {
    this.setState({
      disabledNotifications: {
        ...this.state.disabledNotifications,
        [id]: disabled
      }
    });
  }

  markAsRead({ id }: INotifications) {
    const newState = this.props.notifications.map(
      (notification: INotifications | null) => {
        if (notification && notification.id === id) {
          notification.isNew = false;
        }

        return notification;
      }
    );

    this.props.updateReadNotifications(newState);
  }

  render() {
    const { currentAugurTimestamp, reportingWindowStatsEndTime } = this.props;
    const notifications = this.props.notifications.map(notification =>
      this.getButtonAction(notification)
    );
    const notificationCount = notifications.length;
    const newNotificationCount = notifications.filter(item => item.isNew)
      .length;

    const rows = orderBy(notifications, "isNew", ["desc"]).map(notification => {
      const {
        id,
        isImportant,
        isNew,
        title,
        buttonLabel,
        buttonAction,
        market,
        markets,
        claimReportingFees,
        totalProceeds,
        type
      } = notification;

      const templateProps = {
        claimReportingFees,
        totalProceeds,
        markets,
        market,
        currentTime: currentAugurTimestamp,
        reportingWindowStatsEndTime,
        buttonAction,
        buttonLabel,
        type
      };

      const notificationCardProps = {
        id,
        type,
        isImportant,
        isNew,
        title,
        buttonLabel,
        buttonAction
      };

      const isDisabled: boolean =
        this.state.disabledNotifications[id] &&
        this.state.disabledNotifications[id] === true;

      return (
        <NotificationCard
          key={id}
          {...notificationCardProps}
          isDisabled={isDisabled}
        >
          {type === NOTIFICATION_TYPES.resolvedMarketsOpenOrders ? (
            <OpenOrdersResolvedMarketsTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) : null}
          {type === NOTIFICATION_TYPES.reportOnMarkets ? (
            <ReportEndingSoonTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) : null}
          {type === NOTIFICATION_TYPES.finalizeMarkets ? (
            <FinalizeTemplate isDisabled={isDisabled} {...templateProps} />
          ) : null}
          {type === NOTIFICATION_TYPES.marketsInDispute ? (
            <DisputeTemplate isDisabled={isDisabled} {...templateProps} />
          ) : null}
          {type === NOTIFICATION_TYPES.completeSetPositions ? (
            <SellCompleteSetTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) : null}
          {type === NOTIFICATION_TYPES.unsignedOrders ? (
            <UnsignedOrdersTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) : null}
          {type === NOTIFICATION_TYPES.claimReportingFees ? (
            <ClaimReportingFeesTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) : null}
          {type === NOTIFICATION_TYPES.proceedsToClaimOnHold ? (
            <ProceedsToClaimOnHoldTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) : null}
          {type === NOTIFICATION_TYPES.proceedsToClaim ? (
            <ProceedsToClaimTemplate
              isDisabled={isDisabled}
              {...templateProps}
            />
          ) : null}
          {type === NOTIFICATION_TYPES.orphanOrders ? (
            <OrphanOrdersTemplate isDisabled={isDisabled} {...templateProps} />
          ) : null}
        </NotificationCard>
      );
    });

    const labelContent = (
      <div>
        {!this.props.isMobile &&
          newNotificationCount > 0 && (
            <PillLabel label={`${newNotificationCount} ${constants.NEW}`} />
          )}
      </div>
    );

    return (
      <QuadBox
        title={constants.NOTIFICATIONS_TITLE}
        rightContent={labelContent}
        content={
          notificationCount === 0 ? (
            <EmptyDisplay
              selectedTab=""
              filterLabel={constants.NOTIFICATIONS_LABEL}
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
