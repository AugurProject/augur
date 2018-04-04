import React from 'react'
import { AugurLoadingLogo } from 'modules/common/components/icons'
import Styles from 'modules/app/components/loading-logo/loading-logo.styles'

const LoadingLogo = props => (

  <div className={Styles['loading-anim']}>
    <span>{ AugurLoadingLogo }</span>
  </div>

)

export default LoadingLogo
