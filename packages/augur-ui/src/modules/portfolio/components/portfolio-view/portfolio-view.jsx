import React from 'react'
import { Switch } from 'react-router-dom'

import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route'

import PortfolioHeader from 'modules/portfolio/containers/portfolio-header'
import MyPositions from 'modules/portfolio/containers/positions'
import MyMarkets from 'modules/portfolio/containers/my-markets'
import Favorites from 'modules/portfolio/containers/favorites'
import Transactions from 'modules/portfolio/containers/transactions'
import Reports from 'modules/portfolio/containers/reports'

import makePath from 'modules/routes/helpers/make-path'

import { MY_POSITIONS, MY_MARKETS, FAVORITES, PORTFOLIO_TRANSACTIONS, PORTFOLIO_REPORTS } from 'modules/routes/constants/views'

const PortfolioView = p => (
  <section>
    <PortfolioHeader />
    <Switch>
      <AuthenticatedRoute path={makePath(MY_POSITIONS)} component={MyPositions} />
      <AuthenticatedRoute path={makePath(MY_MARKETS)} component={MyMarkets} />
      <AuthenticatedRoute path={makePath(FAVORITES)} component={Favorites} />
      <AuthenticatedRoute path={makePath(PORTFOLIO_TRANSACTIONS)} component={Transactions} />
      <AuthenticatedRoute path={makePath(PORTFOLIO_REPORTS)} component={Reports} />
    </Switch>
  </section>
)

export default PortfolioView
