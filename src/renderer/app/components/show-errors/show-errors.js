import React from 'react'
import PropTypes from 'prop-types'
import Styles from './show-errors.style.less'
import { ERROR_NOTIFICATION } from '../../../../utils/constants'

export const ShowErrors = ({
  notifications,
  removeError
}) => {
  return (
    <div className={Styles.ShowErrors}>
      { notifications[ERROR_NOTIFICATION].map((e, i) => (
        <div key={i} className={Styles.ShowErrors__body}>
          <div className={Styles.ShowErrors__icon}/>
          <div className={Styles.ShowErrors__bodyText}>{e.message}</div>
          <button className={Styles.ShowErrors__close} onClick={ () => removeError(e) } >X</button>
        </div>
      ))}
    </div>
  )
}

ShowErrors.propTypes = {
  notifications: PropTypes.object.isRequired,
  removeError: PropTypes.func.isRequired,
}

export default ShowErrors
