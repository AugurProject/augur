import React from 'react'
import { Switch } from 'react-router-dom'

import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route'

import PortfolioHeader from 'modules/portfolio/containers/portfolio-header'
import MyPositions from 'modules/portfolio/containers/positions'
import MyMarkets from 'modules/portfolio/containers/markets'
import Watchlist from 'modules/portfolio/containers/watchlist'
import Transactions from 'modules/portfolio/containers/transactions'

import makePath from 'modules/routes/helpers/make-path'

import { MY_POSITIONS, MY_MARKETS, WATCHLIST, PORTFOLIO_TRANSACTIONS } from 'modules/routes/constants/views'

const PortfolioView = p => (
  <section>
    <PortfolioHeader />
    <Switch>
      <AuthenticatedRoute path={makePath(MY_POSITIONS)} component={MyPositions} />
      <AuthenticatedRoute path={makePath(MY_MARKETS)} component={MyMarkets} />
      <AuthenticatedRoute path={makePath(WATCHLIST)} component={Watchlist} />
      <AuthenticatedRoute path={makePath(PORTFOLIO_TRANSACTIONS)} component={Transactions} />
    </Switch>
  </section>
)

export default PortfolioView
