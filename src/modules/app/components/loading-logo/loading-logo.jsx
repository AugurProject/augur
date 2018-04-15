import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { AugurLoadingLogo } from 'modules/common/components/icons'
import Styles from 'modules/app/components/loading-logo/loading-logo.styles'

export default class LoadingLogo extends Component {

  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      loading: false,
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isLoading) {
      this.setState({
        loading: newProps.isLoading,
      })
    }
  }

  animateEnd() {
    this.setState({
      loading: false,
    })
  }

  render() {
    const { loading } = this.state
    return (
      <div
        className={classNames(Styles.LoadingLogo, {
          [Styles.running]: loading,
          [Styles.paused]: !loading,
        })}
        onAnimationEnd={() => (this.animateEnd())}
      >
        { AugurLoadingLogo }
      </div>
    )
  }
}
