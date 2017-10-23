import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outcome-depth/market-outcome-depth.styles'

export default class MarketOutcomeDepth extends Component {
  static propTypes = {
    selectedOutcome: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.state = {
      // ???
    }
  }

  render() {
    return (
      <section className={Styles.MarketOutcomeDepth}>
        <span>depth</span>
      </section>
    )
  }
}
