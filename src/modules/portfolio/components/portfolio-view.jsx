import React from 'react'
import { Route } from 'react-router-dom'

import MyPositions from 'modules/my-positions/container'
import MyMarkets from 'modules/my-markets/container'
import MyReports from 'modules/my-reports/container'

import makePath from 'modules/routes/helpers/make-path'

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from 'modules/routes/constants/views'

const PortfolioView = p => (
  <section id="portfolio_view" >
    <Route path={makePath(MY_POSITIONS)} component={MyPositions} />
    <Route path={makePath(MY_MARKETS)} component={MyMarkets} />
    <Route path={makePath(MY_REPORTS)} component={MyReports} />
  </section>
)

export default PortfolioView
