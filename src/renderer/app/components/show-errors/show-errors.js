import React from 'react'
import PropTypes from 'prop-types'
import Styles from './show-errors.style.less'

export const ShowErrors = ({
  errorNotifications,
  removeError
}) => {
  return (
    <section className={Styles.ShowErrors}>
      { errorNotifications.map((e, i) => {
        <div key={i}className={Styles.ShowErrors__body}>
          <div className={Styles.ShowErrors__icon}>icon</div>
          <div className={Styles.ShowErrors__bodyText}>{e.message}</div>
          <button className={Styles.ShowErrors__close} onClick={ () => removeError(e) } />
        </div>
      })}
    </section>
  )
}


ShowErrors.propTypes = {
  errorNotifications: PropTypes.array.isRequired,
  removeError: PropTypes.func.isRequired,
}

export default ShowErrors
