import React from 'react'
import PropTypes from 'prop-types'
import { AugurLoadingLogo } from 'modules/common/components/icons'
import Styles from 'modules/app/components/loading-logo/loading-logo.styles'

const LoadingLogo = props => (
  <div className={props.isLoading ? Styles.LoadingLogo__AugurLogo : Styles.LoadingLogo__Not__AugurLogo}>
    <span>{ AugurLoadingLogo }</span>
  </div>
)

LoadingLogo.propTypes = {
  isLoading: PropTypes.bool,
}

export default LoadingLogo
