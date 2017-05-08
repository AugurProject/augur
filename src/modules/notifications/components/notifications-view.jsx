import React, { Component, PropTypes } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import NullStateMessage from 'modules/common/components/null-state-message';
import Notification from 'modules/notifications/components/notification';

import getValue from 'utils/get-value';

export default class NotificationsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationsBounds: {}
    };

    this.updateNotificationsBoundingBox = this.updateNotificationsBoundingBox.bind(this);
  }

  componentDidMount() {
    this.updateNotificationsBoundingBox();
  }

  updateNotificationsBoundingBox() {
    if (this.notifications) this.setState({ notificationsBounds: this.notifications.getBoundingClientRect() });
  }

  render() {
    const p = this.props;
    const s = this.state;

    const notifications = getValue(p, 'notifications.notifications');
    const animationSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-normal'), 10);

    return (
      <section id="notifications_view">
        <div className="notifications-header">
          <h3>Notifications</h3>
          {!!notifications && !!notifications.length &&
            <button
              className="unstyled notifications-button-clear"
              onClick={(e) => {
                e.stopPropagation();
                p.clearNotifications();
              }}
            >
              clear all
            </button>
          }
        </div>
        {notifications && notifications.length ?
          <div
            ref={(notifications) => {
              this.notifications = notifications;
            }}
          >
            <CSSTransitionGroup
              className="notifications"
              component="div"
              transitionName="notification"
              transitionAppear
              transitionAppearTimeout={animationSpeed}
              transitionEnterTimeout={animationSpeed}
              transitionLeaveTimeout={animationSpeed}
            >
              {notifications.map((notification, i) => (
                <Notification
                  key={`${notification.id}-${notification.title}`}
                  removeNotification={() => p.removeNotification(i)}
                  onClick={p.onClick}
                  toggleNotifications={p.toggleNotifications}
                  updateNotification={p.updateNotification}
                  notificationsBounds={s.notificationsBounds}
                  updateNotificationsBoundingBox={this.updateNotificationsBoundingBox}
                  {...notification}
                />
              ))}
            </CSSTransitionGroup>
          </div> :
          <NullStateMessage message="No Notifications" />
        }
      </section>
    );
  }
}

// const NotificationsView = (p) => {
//   const notifications = getValue(p, 'notifications.notifications');
//
//   const animationSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-normal'), 10);
//
//   return (
//     <section id="notifications_view">
//       <div className="notifications-header">
//         <h3>Notifications</h3>
//         {!!notifications && !!notifications.length &&
//           <button
//             className="unstyled notifications-button-clear"
//             onClick={(e) => {
//               e.stopPropagation();
//               p.clearNotifications();
//             }}
//           >
//             clear all
//           </button>
//         }
//       </div>
//       {notifications && notifications.length ?
//         <CSSTransitionGroup
//           ref={(notifications) => {
//             this.notificationsBounds = notifications.getBoundingClientRect();
//           }}
//           className="notifications"
//           component="div"
//           transitionName="notification"
//           transitionAppear
//           transitionAppearTimeout={animationSpeed}
//           transitionEnterTimeout={animationSpeed}
//           transitionLeaveTimeout={animationSpeed}
//         >
//           {notifications.map((notification, i) => (
//             <Notification
//               key={`${notification.id}-${notification.title}`}
//               removeNotification={() => p.removeNotification(i)}
//               onClick={p.onClick}
//               toggleNotifications={p.toggleNotifications}
//               notificationContainer={this.notifications}
//               {...notification}
//             />
//           ))}
//         </CSSTransitionGroup> :
//         <NullStateMessage message="No Notifications" />
//       }
//     </section>
//   );
// };
//
// NotificationsView.propTypes = {
//   notifications: PropTypes.object.isRequired,
//   removeNotification: PropTypes.func.isRequired,
//   clearNotifications: PropTypes.func.isRequired,
//   toggleNotifications: PropTypes.func.isRequired,
//   onClick: PropTypes.func
// };
//
// export default NotificationsView;
