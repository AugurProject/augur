import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { REPORTING_DISPUTE } from 'modules/routes/constants/views'
import Styles from 'modules/portfolio/components/portfolio-reports/portfolio-reports.styles'
import { Link } from 'react-router-dom'
import makePath from 'modules/routes/helpers/make-path'

export default class PortfolioReports extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
  }

  componentWillMount() {

  }

  render() {
    const p = this.props
    return (
      <section>
        <Helmet>
          <title>Reports</title>
        </Helmet>
        <div>{p.data}</div>

        {p.markets.length === 0 &&
          <div className={Styles.NoMarkets__container} >
            <span>You don&apos;t have any reports.</span>
            <Link
              className={Styles.NoMarkets__link}
              to={makePath(REPORTING_DISPUTE)}
            >
              <span>Click here to view markets to report.</span>
            </Link>
          </div>
        }
      </section>
    )
  }
}
