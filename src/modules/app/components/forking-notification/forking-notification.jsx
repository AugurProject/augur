import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Styles from 'modules/app/components/forking-notification/forking-notification.styles'

const ForkingNotification = props => (
  <header className={Styles.ForkingNotification}>
    <section>
      <img
        className={Styles.ForkingNotification__AlertIcon}
        alt="Alert"
        src="../../assets/images/alert-icon.svg"
      />
      <div className={Styles.ForkingNotification__message}>
        A Fork has been initiated. This universe is now locked.
      </div>
      <div className={Styles.ForkingNotification__addition_details}>
        <button className={Styles.ForkingNotification__addition_details_button}>
          Additional details
          <i className={classNames(Styles.ForkingNotification__arrow, 'fa', 'fa-angle-down')} />
        </button>
      </div>
    </section>
  </header>
)

ForkingNotification.propTypes = {
  isLogged: PropTypes.bool.isRequired,
}

export default ForkingNotification
