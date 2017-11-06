import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class MainErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.element
  }

  constructor(props) {
    super(props)

    this.state = {
      hasError: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) return <h1>ಠ_ಠ -- check the console</h1>

    return this.props.children
  }
}
