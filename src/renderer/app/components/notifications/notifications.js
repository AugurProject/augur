import React, { Component } from 'react';
import PropTypes from "prop-types";
import { each, pull, take } from 'lodash'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Styles from './notifications.style.less'

const Msg = ({ notification, closeToast }) => (
  <div className={Styles.Notification__body}>
    <div className={Styles.Notification__bodyText}>{notification.message}</div>
    <button className={Styles.Notification__close} onClick={ closeToast }><span className={Styles.Notification__close__button}>X</span></button>
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

    this.showToast()
    this.removeToast = this.removeToast.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.notifications !== this.props.notifications) {
      this.setState({
        toastIt: take(this.props.infoNotifications, NUM_INFOS - this.state.toastIt.length) || []
      }, () => {
        this.showToast()
      })
    }
  }

  showToast() {
    const { toastIt } = this.state
    if (toastIt.length > 0) {
      each(toastIt, t => {
        if (!t.toastId) {
          t.toastId = toast(<Msg notification={t} className={Styles.Notification__msgContainer}/>,
            {
              position: toast.POSITION.BOTTOM_CENTER,
              closeButton: false,
              onClose: () => this.removeToast(t)
            })
        }
      })
      this.setState({
        toastIt
      })
    }
  }

  removeToast(notification) {
    this.setState({
      toasts: pull(this.state.toastIt, notification.message)
    })
    this.props.removeNotification(notification)
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
