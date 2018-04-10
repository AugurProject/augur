import React from 'react'
import PropTypes from 'prop-types'
import LoadingLogo from 'modules/app/components/loading-logo/loading-logo'
import Styles from 'modules/app/components/logo/logo.styles'

const Logo = props => (
  <section className={Styles.Logo}>
    <LoadingLogo
      isLoading={props.isLoading}
    />
    <span className={Styles.Logo__text}>
      Augur
    </span>
  </section>
)

Logo.propTypes = {
  isLoading: PropTypes.bool,
}
export default Logo
