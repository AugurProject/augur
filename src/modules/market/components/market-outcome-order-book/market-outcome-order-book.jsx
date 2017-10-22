import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class MarketOutcomeOrderbook extends Component {
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
      <span>Faaaak order book</span>
    )
  }
}
