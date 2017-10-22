import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class MarketOutcomeDepth extends Component {
  static propTypes = {
    fak: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.state = {
      // ???
    }
  }

  render() {
    return (
      <span>Faaaak depth</span>
    )
  }
}
