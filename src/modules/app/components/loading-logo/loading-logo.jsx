import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { AugurLoadingLogo } from 'modules/common/components/icons'
import Styles from 'modules/app/components/loading-logo/loading-logo.styles'

const LoadingLogo = (p) => {
  const { isLoading } = p

  return (
    <div
      className={classNames(Styles.LoadingLogo, {
        [Styles.running]: isLoading,
        [Styles.paused]: !isLoading,
      })}
    >
      { AugurLoadingLogo }
    </div>
  )
}

LoadingLogo.propTypes = {
  isLoading: PropTypes.bool.isRequired,
}

export default LoadingLogo
