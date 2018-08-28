import React, { Component } from 'react';
import PropTypes from "prop-types";
import { each, pull } from 'lodash'
import classNames from "classnames";
import { INFO_NOTIFICATION } from '../../../../utils/constants'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Styles from './notifications.style.less'

const Msg = ({ notification, closeToast }) => (
  <div className={Styles.Notification__body}>
    {notification.message}
    <button className={Styles.Notification__close} onClick={ closeToast }><span className={Styles.Notification__close__button}>X</span></button>
  </div>
)

Msg.propTypes = {
  notification: PropTypes.object.isRequired,
  closeToast: PropTypes.func.isRequired
}

export class Notifications extends Component {
  static propTypes = {
    notifications: PropTypes.object.isRequired,
    removeNotification: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      toasts: []
    }

    this.showToast(this.props.notifications)
    this.removeToast = this.removeToast.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.notifications !== this.props.notifications) {
      this.showToast(this.props.notifications)
    }
  }

  showToast(notifications) {
    const infos = notifications[INFO_NOTIFICATION]

    if (infos && infos.length > 0) {
      each(infos, n => {
        if (this.state.toasts.indexOf(n.message) === -1) {
          toast(<Msg notification={n} />,
          {
            position: toast.POSITION.BOTTOM_CENTER,
            closeButton: false,
            onClose: () => this.removeToast(n)
          })
          this.setState({
            toasts: [...this.state.toasts, n.message]
          })
        }
      })
    }
  }

  removeToast(notification) {
    this.setState({
      toasts: pull(this.state.toasts, notification.message)
    })
    this.props.removeNotification(notification)
  }

  render() {
    return (
      <div>
          <ToastContainer
            hideProgressBar={true}
            className={Styles.Notification__container}
            toastClassName={Styles.Notification__container}
            autoClose={100000}
          />
      </div>
    )
  }
}
