import React from 'react'
import { Route, withRouter } from 'react-router-dom'

import MyPositions from 'modules/new-portfolio/components/positions/container'
import MyMarkets from 'modules/new-portfolio/components/markets/container'
import Watchlist from 'modules/new-portfolio/components/watchlist/container'
import Transactions from 'modules/new-portfolio/components/transactions/container'

import makePath from 'modules/routes/helpers/make-path'

import { MY_POSITIONS, MY_MARKETS, WATCHLIST, TRANSACTIONS } from 'modules/routes/constants/views'

const PortfolioView = p => (
  <section>
    <Route path={makePath(MY_POSITIONS)} component={MyPositions} />
    <Route path={makePath(MY_MARKETS)} component={MyMarkets} />
    <Route path={makePath(WATCHLIST)} component={Watchlist} />
    <Route path={makePath(TRANSACTIONS)} component={Transactions} />
  </section>
)

export default withRouter(PortfolioView)
