import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import makePath from 'modules/routes/helpers/make-path'

import MarketsList from 'modules/markets/components/markets-list'
import Styles from 'modules/portfolio/components/markets/markets.styles'
import PortfolioStyles from 'modules/portfolio/components/portfolio-view/portfolio-view.styles'
import { TYPE_TRADE, TYPE_REPORT, TYPE_CLOSED } from 'modules/market/constants/link-types'
import { constants } from 'services/augurjs'
import { CREATE_MARKET } from 'modules/routes/constants/views'

class MyMarkets extends Component {
  static propTypes = {
    collectMarketCreatorFees: PropTypes.func.isRequired,
    loadMarketsInfoIfNotLoaded: PropTypes.func.isRequired,
    hasAllTransactionsLoaded: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    isLogged: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool,
    loadMarkets: PropTypes.func.isRequired,
    loadMarketsInfo: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    myMarkets: PropTypes.array.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    // NOTE: from here to this.state was added to sort markets, this might need to be more robust in the future.
    const openMarkets = []
    const reportingMarkets = []
    const finalMarkets = []
    const filteredMarketsOpen = []
    const filteredMarketsReporting = []
    const filteredMarketsFinal = []
    this.reportingStates = constants.REPORTING_STATE

    this.props.myMarkets.forEach((market, index) => {
      if (market.reportingState === this.reportingStates.PRE_REPORTING) {
        openMarkets.push(market)
        filteredMarketsOpen.push(market.id)
      } else if (market.reportingState === this.reportingStates.FINALIZED) {
        finalMarkets.push(market)
        filteredMarketsFinal.push(market.id)
      } else {
        reportingMarkets.push(market)
        filteredMarketsReporting.push(market.id)
      }
    })

    this.state = {
      openMarkets,
      reportingMarkets,
      finalMarkets,
      filteredMarketsOpen,
      filteredMarketsReporting,
      filteredMarketsFinal,
    }
  }

  componentWillMount() {
    const { loadMarkets } = this.props
    // Load all markets incase they haven't been loaded already
    // Eventually replace this with a 1 to 1 call to augurnode for example what we need.
    loadMarkets()
  }

  componentWillReceiveProps(nextProps) {
    const openMarkets = []
    const reportingMarkets = []
    const finalMarkets = []
    const filteredMarketsOpen = []
    const filteredMarketsReporting = []
    const filteredMarketsFinal = []

    nextProps.myMarkets.forEach((market, index) => {
      if (market.reportingState === this.reportingStates.PRE_REPORTING) {
        openMarkets.push(market)
        filteredMarketsOpen.push(market.id)
      } else if (market.reportingState === this.reportingStates.FINALIZED) {
        finalMarkets.push(market)
        filteredMarketsFinal.push(market.id)
      } else {
        reportingMarkets.push(market)
        filteredMarketsReporting.push(market.id)
      }
    })

    this.setState({
      openMarkets,
      reportingMarkets,
      finalMarkets,
      filteredMarketsOpen,
      filteredMarketsReporting,
      filteredMarketsFinal,
    })
  }

  render() {
    const {
      collectMarketCreatorFees,
      loadMarketsInfoIfNotLoaded,
      history,
      isLogged,
      isMobile,
      loadMarketsInfo,
      location,
      myMarkets,
      toggleFavorite,
    } = this.props
    const s = this.state
    const haveMarkets = myMarkets && !!myMarkets.length

    return (
      <section className={Styles.Markets}>
        <Helmet>
          <title>My Markets</title>
        </Helmet>
        {myMarkets && !!myMarkets.length &&
          <div
            className={Styles.Markets__SortBar}
          >
            <h2 className={Styles['Markets__SortBar-title']}>Open</h2>
          </div>
        }
        {haveMarkets &&
          <MarketsList
            isLogged={isLogged}
            markets={s.openMarkets}
            filteredMarkets={s.filteredMarketsOpen}
            location={location}
            history={history}
            toggleFavorite={toggleFavorite}
            loadMarketsInfo={loadMarketsInfo}
            linkType={TYPE_TRADE}
            paginationPageParam="open"
            collectMarketCreatorFees={collectMarketCreatorFees}
            loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
            isMobile={isMobile}
          />
        }
        {haveMarkets && s.filteredMarketsOpen.length === 0 && <div className={Styles['Markets__nullState--spacer']} />}
        {haveMarkets &&
          <div
            className={Styles.Markets__SortBar}
          >
            <div
              className={Styles['Markets__SortBar-title']}
            >
              In Reporting
            </div>
          </div>
        }
        {haveMarkets &&
          <MarketsList
            isLogged={isLogged}
            markets={s.reportingMarkets}
            filteredMarkets={s.filteredMarketsReporting}
            location={location}
            history={history}
            toggleFavorite={toggleFavorite}
            loadMarketsInfo={loadMarketsInfo}
            linkType={TYPE_REPORT}
            paginationPageParam="reporting"
            collectMarketCreatorFees={collectMarketCreatorFees}
            loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
            isMobile={isMobile}
          />
        }
        {haveMarkets && s.filteredMarketsReporting.length === 0 && <div className={Styles['Markets__nullState--spacer']} />}
        {haveMarkets &&
          <div
            className={Styles.Markets__SortBar}
          >
            <div
              className={Styles['Markets__SortBar-title']}
            >
              Resolved
            </div>
          </div>
        }
        {haveMarkets &&
          <MarketsList
            isLogged={isLogged}
            markets={s.finalMarkets}
            filteredMarkets={s.filteredMarketsFinal}
            location={location}
            history={history}
            toggleFavorite={toggleFavorite}
            loadMarketsInfo={loadMarketsInfo}
            linkType={TYPE_CLOSED}
            paginationPageParam="final"
            collectMarketCreatorFees={collectMarketCreatorFees}
            loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
            isMobile={isMobile}
          />
        }
        {haveMarkets && s.filteredMarketsFinal.length === 0 && <div className={Styles['Markets__nullState--spacer']} />}
        {(myMarkets == null || (myMarkets && myMarkets.length === 0)) &&
          <div className={PortfolioStyles.NoMarkets__container} >
            <span>You haven&apos;t created any markets.</span>
            <Link
              className={PortfolioStyles.NoMarkets__link}
              to={makePath(CREATE_MARKET)}
            >
              <span>Click here to create a new market.</span>
            </Link>
          </div>
        }
      </section>
    )
  }
}

export default MyMarkets
