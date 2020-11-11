import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { orderBy } from 'lodash';
import EmptyDisplay from 'modules/portfolio/components/common/empty-display';
import makePath from 'modules/routes/helpers/make-path';
import makeQuery from 'modules/routes/helpers/make-query';
import { NotificationCard } from 'modules/account/components/notification-card';
import { PillLabel } from 'modules/common/labels';
import { MARKET } from 'modules/routes/constants/views';
import { MARKET_ID_PARAM_NAME, THEME_NAME, } from 'modules/routes/constants/param-names';
import {
  ClaimReportingFeesTemplate,
  DisputeTemplate,
  FinalizeWarpSyncMarketTemplate,
  MostLikelyInvalidMarketsTemplate,
  OpenOrdersResolvedMarketsTemplate,
  ProceedsToClaimTemplate,
  ReportEndingSoonTemplate,
  UnsignedOrdersTemplate,
} from 'modules/account/components/notifications-templates';
import { Notification, QueryEndpoints } from 'modules/types';
import {
  MODAL_CLAIM_FEES,
  MODAL_CLAIM_MARKETS_PROCEEDS,
  MODAL_FINALIZE_MARKET,
  MODAL_OPEN_ORDERS,
  MODAL_REPORTING,
  MODAL_UNSIGNED_ORDERS,
  NEW,
  NOTIFICATION_TYPES,
  NOTIFICATIONS_LABEL,
  NOTIFICATIONS_TITLE,
} from 'modules/common/constants';
import { MessagesIcon } from 'modules/common/icons';
import Styles from 'modules/account/components/notification.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { selectMarket } from 'modules/markets/selectors/market';
import { getNotifications } from 'modules/notifications/selectors/notification-state';
import { getHTMLTheme } from 'modules/app/store/app-status-hooks';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import classNames from 'classnames';

export interface NotificationsProps {
  toggle?: Function;
}

const notificationsWithCountdown = [
  NOTIFICATION_TYPES.marketsInDispute,
  NOTIFICATION_TYPES.reportOnMarkets,
  NOTIFICATION_TYPES.proceedsToClaim,
];

function getRows(
  notifications,
  currentTime,
  disputingWindowEndTime,
  disabledNotifications
) {
  return orderBy(notifications, ['isNew','lastUpdated'], ['desc', 'desc'])
    .filter(notification => !notification.hideNotification)
    .map(({
      buttonAction,
      buttonLabel,
      claimReportingFees,
      hideCheckbox,
      id,
      isImportant,
      isNew,
      isRead,
      market,
      markets,
      queueId,
      queueName,
      redIcon,
      title,
      totalProceeds,
      type,
      dontShowNotificationButton
    }) => {
      const templateProps = {
        claimReportingFees,
        totalProceeds,
        markets,
        market,
        currentTime,
        disputingWindowEndTime,
        buttonAction,
        buttonLabel,
        type,
        queueName,
        queueId,
        dontShowNotificationButton
      };
      const notificationCardProps = {
        id,
        type,
        isImportant,
        redIcon,
        isNew,
        isRead,
        title,
        buttonLabel,
        buttonAction,
        hideCheckbox,
        dontShowNotificationButton
      };

      const isDisabled: boolean =
        disabledNotifications[id] && disabledNotifications[id] === true;
      const hasCounter = market && notificationsWithCountdown.includes(type);
      return (
        <NotificationCard
          key={id}
          noCounter={!hasCounter}
          {...notificationCardProps}
        >
          {type === NOTIFICATION_TYPES.resolvedMarketsOpenOrders
            ? ((
                <OpenOrdersResolvedMarketsTemplate
                  isDisabled={isDisabled}
                  {...templateProps}
                />
              ) as any)
            : null}
          {type === NOTIFICATION_TYPES.reportOnMarkets
            ? ((
                <ReportEndingSoonTemplate
                  isDisabled={isDisabled}
                  {...templateProps}
                />
              ) as any)
            : null}
          {type === NOTIFICATION_TYPES.marketsInDispute
            ? ((
                <DisputeTemplate isDisabled={isDisabled} {...templateProps} />
              ) as any)
            : null}
          {type === NOTIFICATION_TYPES.unsignedOrders
            ? ((
                <UnsignedOrdersTemplate
                  isDisabled={isDisabled}
                  {...templateProps}
                />
              ) as any)
            : null}
          {type === NOTIFICATION_TYPES.claimReportingFees
            ? ((
                <ClaimReportingFeesTemplate
                  isDisabled={isDisabled}
                  {...templateProps}
                />
              ) as any)
            : null}
          {type === NOTIFICATION_TYPES.proceedsToClaim
            ? ((
                <ProceedsToClaimTemplate
                  isDisabled={isDisabled}
                  {...templateProps}
                />
              ) as any)
            : null}
          {type === NOTIFICATION_TYPES.marketIsMostLikelyInvalid
            ? ((
                <MostLikelyInvalidMarketsTemplate
                  isDisabled={isDisabled}
                  {...templateProps}
                />
              ) as any)
            : null}
          {type === NOTIFICATION_TYPES.finalizeMarket
            ? ((
                <FinalizeWarpSyncMarketTemplate
                  isDisabled={isDisabled}
                  {...templateProps}
                />
              ) as any)
            : null}
        </NotificationCard>
      );
    });
}

function getButtonAction(
  notification: Notification,
  history,
  stateNotifications,
  updateNotifications,
  setModal,
  disabledNotifications,
  setDisabledNotifications,
) {
  function disableNotification(id, disabled) {
    setDisabledNotifications({ ...disabledNotifications, [id]: disabled });
  }

  function markAsRead({ id }: Notification) {
    const newState = stateNotifications.map(
      (notification: Notification | null) => {
        if (notification?.id === id) {
          notification.isNew = false;
          notification.isRead = true;
          notification.lastUpdated = new Date().getTime();
        }

        return notification;
      }
    );
    updateNotifications(newState);
  }

  let buttonAction;
  const {
    id: notificationId
  } = notification;
  let marketId = notification?.market?.id;

  switch (notification.type) {
    case NOTIFICATION_TYPES.resolvedMarketsOpenOrders:
      buttonAction = () => {
        markAsRead(notification);
        disableNotification(notificationId, true);
        if (notification.market) {
          setModal({
            type: MODAL_OPEN_ORDERS,
            marketId,
            cb: () => disableNotification(notificationId, false),
          });
        }
      };
      break;

    case NOTIFICATION_TYPES.reportOnMarkets:
      buttonAction = () => {
        markAsRead(notification);
        const market = selectMarket(marketId);
        setModal({
          type: MODAL_REPORTING,
          market,
        });
      };
      break;

    case NOTIFICATION_TYPES.marketsInDispute:
      buttonAction = () => {
        markAsRead(notification);
        const market = selectMarket(marketId);
        setModal({
          type: MODAL_REPORTING,
          market,
        });
      };
      break;

    case NOTIFICATION_TYPES.unsignedOrders:
      buttonAction = () => {
        markAsRead(notification);
        if (notification.market) {
          setModal({
            type: MODAL_UNSIGNED_ORDERS,
            marketId,
          });
        }
      };
      break;

    case NOTIFICATION_TYPES.claimReportingFees:
      buttonAction = () => {
        markAsRead(notification);
        setModal({
          type: MODAL_CLAIM_FEES,
          ...notification.claimReportingFees,
        });
      };
      break;

    case NOTIFICATION_TYPES.proceedsToClaim:
      buttonAction = () => {
        markAsRead(notification);
        disableNotification(notification.id, true);
        setModal({
          type: MODAL_CLAIM_MARKETS_PROCEEDS,
          marketIds: notification.markets,
          cb: () => disableNotification(notificationId, false),
        });
      };
      break;

    case NOTIFICATION_TYPES.marketIsMostLikelyInvalid:
      buttonAction = () => {
        markAsRead(notification);
        const queryLink: QueryEndpoints = {
          [MARKET_ID_PARAM_NAME]: marketId,
          [THEME_NAME]: getHTMLTheme(),
        };
        history.push({
          pathname: makePath(MARKET, null),
          search: makeQuery(queryLink),
        });
      };
      break;

    case NOTIFICATION_TYPES.finalizeMarket:
      buttonAction = () => {
        markAsRead(notification);
        disableNotification(notificationId, true);
        setModal({
          type: MODAL_FINALIZE_MARKET,
          cb: () => disableNotification(notificationId, false),
          marketId,
        });
      };
      break;

    default:
      buttonAction = () => {
        markAsRead(notification);
      };
      break;
  }

  return {
    ...notification,
    buttonAction,
  };
}

const Notifications = ({ toggle }: NotificationsProps) => {
  const [disabledNotifications, setDisabledNotifications] = useState({});
  const {
    universe: { disputeWindow },
    blockchain: { currentAugurTimestamp: currentTime },
    actions: { setModal, updateNotifications },
  } = useAppStatusStore();
  const history = useHistory();
  const selectedNotifications = getNotifications();
  const notifications = selectedNotifications.map(notification =>
    getButtonAction(
      notification,
      history,
      selectedNotifications,
      updateNotifications,
      setModal,
      disabledNotifications,
      setDisabledNotifications,
    )
  );
  const notificationCount = notifications.length;
  const newNotificationCount = notifications.filter(item => item.isNew).length;

  const labelContent = (
    <div className={Styles.NewTopLabel}>
      {newNotificationCount > 0 && (
        <PillLabel label={`${newNotificationCount} ${NEW}`} hideOnMobile />
      )}
    </div>
  );

  const rows = getRows(notifications, currentTime, (disputeWindow?.endTime ||
  0), disabledNotifications);

  const markAsNotNew =({ id }: Notification, stateNotifications, updateNotifications) => {
    const newState = stateNotifications.map(
      (notification: Notification | null) => {
        if (notification?.id === id) {
          notification.isNew = false;
        }

        return notification;
      }
    );
    updateNotifications(newState);
  };

  useEffect(() => {
    return () => {
      const notifications = getNotifications();
      notifications.map(notification => markAsNotNew(notification, notifications, updateNotifications));
    };
  }, []);

  return (
    <QuadBox
      title={NOTIFICATIONS_TITLE}
      headerComplement={labelContent}
      toggle={toggle}
      customClass={classNames({
        [Styles.HasNotifications]: notificationCount !== 0,
      })}
      content={
        notificationCount === 0 ? (
          <EmptyDisplay
            selectedTab=""
            filterLabel={NOTIFICATIONS_LABEL}
            search=""
            title={NOTIFICATIONS_TITLE}
            icon={MessagesIcon}
          />
        ) : (
          rows
        )
      }
    />
  );
};

export default Notifications;
