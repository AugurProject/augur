import React from 'react'
import { Route } from 'react-router-dom'

import PortfolioHeader from 'modules/portfolio/containers/portfolio-header'
import MyPositions from 'modules/portfolio/containers/positions'
import MyMarkets from 'modules/portfolio/containers/markets'
import Watchlist from 'modules/portfolio/components/watchlist/watchlist'
import Transactions from 'modules/portfolio/containers/transactions'

import makePath from 'modules/routes/helpers/make-path'

import { MY_POSITIONS, MY_MARKETS, WATCHLIST, PORTFOLIO_TRANSACTIONS } from 'modules/routes/constants/views'

const PortfolioView = p => (
  <section>
    <PortfolioHeader />
    <Route path={makePath(MY_POSITIONS)} component={MyPositions} />
    <Route path={makePath(MY_MARKETS)} component={MyMarkets} />
    <Route path={makePath(WATCHLIST)} component={Watchlist} />
    <Route path={makePath(PORTFOLIO_TRANSACTIONS)} component={Transactions} />
  </section>
)

export default PortfolioView
