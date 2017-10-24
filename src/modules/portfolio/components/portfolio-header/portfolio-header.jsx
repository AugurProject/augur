import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Styles from 'modules/portfolio/components/portfolio-header/portfolio-header.styles'

import parsePath from 'modules/routes/helpers/parse-path'
import { MY_POSITIONS, MY_MARKETS, WATCHLIST, TRANSACTIONS } from 'modules/routes/constants/views'

// const PortfolioHeader = p => ()

class PortfolioHeader extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    series: PropTypes.object,
    stats: PropTypes.array,
    location: PropTypes.object,
    match: PropTypes.object
  }

  constructor(props) {
    super(props)
  }

  getTitle(path) {
    const view = parsePath(path)[0]

    switch (view) {
    case MY_MARKETS:
      return 'my markets'
      break
    case WATCHLIST:
      return 'watching'
      break
    case TRANSACTIONS:
      return 'transactions'
      break
    default:
      return 'positions'
      break
    }
  }

  render() {
    const p = this.props
    const subTitle = this.getTitle(p.location.pathname)
    // console.log(p)

    return (
      <section
        className={Styles.PortfolioHeader}
      >
        <h1 className={Styles.PortfolioHeader__title}>portfolio: {subTitle}</h1>
      </section>
    )
  }
}

export default PortfolioHeader
