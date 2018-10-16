import React, { Component } from 'react';
import PropTypes from "prop-types";
import { each, take, isEqual } from 'lodash'
import { ToastContainer, toast, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Styles from './notifications.style.less'
import Transition from 'react-transition-group/Transition';

const Zoom = cssTransition({
  enter: Styles.zoomIn,
  exit: Styles.zoomOut,
});

const Msg = ({ notification, closeToast }) => (
  <div className={Styles.Notification__body}>
    <div className={Styles.Notification__bodyText}>{notification.message}</div>
    <button className={Styles.Notification__close} onClick={ closeToast } />
  </div>
)

Msg.propTypes = {
  notification: PropTypes.object.isRequired,
  closeToast: PropTypes.func
}

const NUM_INFOS = 2
const NUM_SECONDS = 5 * 1000

export class Notifications extends Component {
  static propTypes = {
    infoNotifications: PropTypes.array.isRequired,
    removeNotification: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      toastIt: take(props.infoNotifications, NUM_INFOS) || []
    }

    this.removeToast = this.removeToast.bind(this);
  }

  componentDidMount() {
    this.showToast()
  }

  componentDidUpdate(prevProps) {
    const { infoNotifications } = this.props
    const { toastIt } = this.state
    if (!isEqual(prevProps.infoNotifications, infoNotifications)) {
      const values = take(infoNotifications.filter(n => !n.toastId), NUM_INFOS - toastIt.length)
      if (values.length > 0) {
        this.setState({
          toastIt: [...toastIt, ...values]
        }, () => {
          this.showToast()
        })
      }
    }
  }

  showToast() {
    const { toastIt } = this.state
    if (toastIt.length > 0) {
      each(toastIt, t => {
        if (!t.toastId) {
          t.toastId = toast(<Msg key={t.timestamp} notification={t} className={Styles.Notification__msgContainer}/>,
            {
              position: toast.POSITION.BOTTOM_CENTER,
              closeButton: false,
              onClose: () => this.removeToast(t),
              autoClose: t.time,
              transition: Zoom,
            })
        }
      })
    }
  }

  removeToast(notification) {
    this.setState({
      toastIt: this.state.toastIt.filter(t => t.toastId !== notification.toastId)
    }, () => {
      this.props.removeNotification(notification)
    })
  }

  render() {
    return (
      <div className={Styles.Notification}>
          <ToastContainer
            hideProgressBar={true}
            className={Styles.Notification__container}
            toastClassName={Styles.Notification__toast}
            autoClose={NUM_SECONDS}
          />
      </div>
    )
  }
}
