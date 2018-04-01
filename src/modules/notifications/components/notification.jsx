import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment from 'moment'

import debounce from 'utils/debounce'
import { AlertCircle, CloseBlack } from 'modules/common/components/icons'
import Styles from 'modules/notifications/components/notification.styles'

export default class Notification extends Component {
  static propTypes = {
    checkSeen: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    linkPath: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    notificationsBounds: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    removeNotification: PropTypes.func.isRequired,
    seen: PropTypes.bool.isRequired,
    timestamp: PropTypes.number,
    title: PropTypes.string.isRequired,
    toggleNotifications: PropTypes.func.isRequired,
    updateNotification: PropTypes.func.isRequired,
    updateNotificationsBoundingBox: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      notificationBounds: {},
    }

    this.updateNotificationBoundingBox = debounce(this.updateNotificationBoundingBox.bind(this), 100)
    this.hasNotificationBeenSeen = this.hasNotificationBeenSeen.bind(this)
  }

  componentDidMount() {
    this.updateNotificationBoundingBox()

    window.addEventListener('scroll', this.updateNotificationBoundingBox)
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      checkSeen,
      notificationsBounds,
      updateNotificationsBoundingBox,
    } = this.props
    if (this.state.notificationBounds !== nextState.notificationBounds) {
      updateNotificationsBoundingBox()
    }

    if (
      notificationsBounds !== nextProps.notificationsBounds ||
      this.state.notificationBounds !== nextState.notificationBounds
    ) {
      this.hasNotificationBeenSeen(nextProps.notificationsBounds, nextState.notificationBounds)
    }

    if (checkSeen !== nextProps.checkSeen && nextProps.checkSeen) {
      this.updateNotificationBoundingBox()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateNotificationBoundingBox)
  }

  updateNotificationBoundingBox() {
    if (this.notification) this.setState({ notificationBounds: this.notification.getBoundingClientRect() })
  }

  hasNotificationBeenSeen(notificationsBounds, notificationBounds) {
    const {
      id,
      updateNotification,
    } = this.props
    if (!this.seen && notificationsBounds.top && notificationsBounds.bottom && notificationBounds.top && notificationBounds.bottom) {
      const topBound = notificationsBounds.top
      const bottomBound = notificationsBounds.bottom
      const notificationMidpoint = (notificationBounds.top + notificationBounds.bottom) / 2

      if (
        notificationMidpoint >= topBound &&
        notificationMidpoint <= bottomBound
      ) {
        setTimeout(() => {
          updateNotification(id, { seen: true })
        }, 1000)
      }
    }
  }

  render() {
    const {
      description,
      linkPath,
      onClick,
      removeNotification,
      seen,
      timestamp,
      title,
      toggleNotifications,
    } = this.props
    return (
      <article
        ref={(notification) => {
          this.notification = notification
        }}
        className={Styles.Notification}
      >
        <Link
          className={Styles.Notification__link}
          to={linkPath || ''}
          onClick={(e) => {
            e.stopPropagation()
            if (!linkPath) e.preventDefault()
            if (linkPath && onClick) toggleNotifications()
          }}
        >
          <span className={Styles.Notification__title}>{title}</span>
          {AlertCircle(!seen ? Styles.Notification__dot : Styles['Notification__dot-seen'], '#553580')}
          <button
            className={Styles.Notification__close}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              removeNotification()
            }}
          >
            {CloseBlack}
          </button>
          <span className={Styles.Notification__description}>{description}</span>
          <span className={Styles.Notification__time}>{moment.unix(timestamp).fromNow()}</span>
        </Link>
      </article>
    )
  }
}
