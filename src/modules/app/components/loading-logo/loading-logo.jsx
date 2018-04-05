import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AugurLoadingLogo } from 'modules/common/components/icons'
import Styles from 'modules/app/components/loading-logo/loading-logo.styles'

export default class LoadingLogo extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      loading: props.isLoading,
    }
  }

  componentWillUnmount = () => {
    this.timeouts = null
  };

  render() {
    const s = this.state
    const { isLoading } = this.props
    // put in lag so animation can finish
    this.timeouts = setTimeout(() => {
      s.loading = isLoading
    }, 2500)

    return (
      <div
        className={s.loading ? Styles.LoadingLogo__running : Styles.LoadingLogo__paused}
      >
        <span>{ AugurLoadingLogo }</span>
      </div>
    )
  }
}

