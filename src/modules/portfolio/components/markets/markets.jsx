import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import makePath from 'modules/routes/helpers/make-path'

import Dropdown from 'modules/common/components/dropdown/dropdown'
import MarketsList from 'modules/markets/components/markets-list'
import Styles from 'modules/portfolio/components/markets/markets.styles'
import PortfolioStyles from 'modules/portfolio/components/portfolio-view/portfolio-view.styles'
import { TYPE_TRADE, TYPE_REPORT, TYPE_CLOSED } from 'modules/market/constants/link-types'
import { constants } from 'services/augurjs'
import { CREATE_MARKET } from 'modules/routes/constants/views'

class MyMarkets extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    hasAllTransactionsLoaded: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    myMarkets: PropTypes.array.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    loadMarketsInfo: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
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
      if (market.reportingState === this.reportingStates.DESIGNATED_REPORTING) {
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
      sortOptionsOpen: [
        { label: 'Volume', value: 'volume' },
        { label: 'Newest', value: 'newest' },
        { label: 'Fees', value: 'fees' },
        { label: 'Expiring Soon', value: 'expiring' }
      ],
      sortDefaultOpen: 'volume',
      sortTypeOpen: 'volume',
      filterOptionsOpen: [
        { label: 'Sports', value: 'sports' },
        { label: 'Finance', value: 'finance' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Politics', value: 'politics' },
        { label: 'Environment', value: 'environment' },
      ],
      filterDefaultOpen: 'finance',
      filterTypeOpen: 'finance',
      sortOptionsReporting: [
        { label: 'Volume', value: 'volume' },
        { label: 'Newest', value: 'newest' },
        { label: 'Fees', value: 'fees' },
        { label: 'Expiring Soon', value: 'expiring' }
      ],
      sortDefaultReporting: 'volume',
      sortTypeReporting: 'volume',
      filterOptionsReporting: [
        { label: 'Sports', value: 'sports' },
        { label: 'Finance', value: 'finance' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Politics', value: 'politics' },
        { label: 'Environment', value: 'environment' },
      ],
      filterDefaultReporting: 'sports',
      filterTypeReporting: 'sports',
      sortOptionsFinal: [
        { label: 'Volume', value: 'volume' },
        { label: 'Newest', value: 'newest' },
        { label: 'Fees', value: 'fees' },
        { label: 'Expiring Soon', value: 'expiring' }
      ],
      sortDefaultFinal: 'volume',
      sortTypeFinal: 'volume',
      filterOptionsFinal: [
        { label: 'Sports', value: 'sports' },
        { label: 'Finance', value: 'finance' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Politics', value: 'politics' },
        { label: 'Environment', value: 'environment' },
      ],
      filterDefaultFinal: 'healthcare',
      filterTypeFinal: 'healthcare',
      openMarkets,
      reportingMarkets,
      finalMarkets,
      filteredMarketsOpen,
      filteredMarketsReporting,
      filteredMarketsFinal
    }

    this.changeDropdown = this.changeDropdown.bind(this)
  }

  componentWillMount() {
    // Load all markets incase they haven't been loaded already
    // Eventually replace this with a 1 to 1 call to augurnode for example what we need.
    this.props.loadMarkets()
  }

  componentWillReceiveProps(nextProps) {
    // update the filtered markets if the myMarkets prop changes
    if (this.props.myMarkets !== nextProps.myMarkets) {
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
        filteredMarketsOpen,
        openMarkets,
        filteredMarketsReporting,
        reportingMarkets,
        filteredMarketsFinal,
        finalMarkets
      })
    }
  }

  // TODO -- clean up this method
  changeDropdown(value) {
    let {
      sortTypeOpen,
      filterTypeOpen,
      sortTypeReporting,
      filterTypeReporting,
      sortTypeFinal,
      filterTypeFinal
    } = this.state

    this.state.sortOptionsOpen.forEach((type, ind) => {
      if (type.value === value) {
        sortTypeOpen = value
      }
    })

    this.state.filterOptionsOpen.forEach((type, ind) => {
      if (type.value === value) {
        filterTypeOpen = value
      }
    })

    this.state.sortOptionsReporting.forEach((type, ind) => {
      if (type.value === value) {
        sortTypeReporting = value
      }
    })

    this.state.filterOptionsReporting.forEach((type, ind) => {
      if (type.value === value) {
        filterTypeReporting = value
      }
    })

    this.state.sortOptionsFinal.forEach((type, ind) => {
      if (type.value === value) {
        sortTypeFinal = value
      }
    })

    this.state.filterOptionsFinal.forEach((type, ind) => {
      if (type.value === value) {
        filterTypeFinal = value
      }
    })


    this.setState({
      sortTypeOpen,
      filterTypeOpen,
      sortTypeReporting,
      filterTypeReporting,
      sortTypeFinal,
      filterTypeFinal,
    })
  }

  render() {
    const p = this.props
    const s = this.state
    const haveMarkets = p.myMarkets && !!p.myMarkets.length

    return (
      <section className={Styles.Markets}>
        <Helmet>
          <title>My Markets</title>
        </Helmet>
        {p.myMarkets && !!p.myMarkets.length &&
          <div
            className={Styles.Markets__SortBar}
          >
            <h2 className={Styles['Markets__SortBar-title']}>Open</h2>
            <div
              className={Styles['Markets__SortBar-sort']}
            >
              <Dropdown default={s.sortDefaultOpen} options={s.sortOptionsOpen} onChange={this.changeDropdown} />
            </div>
            <div
              className={Styles['Markets__SortBar-filter']}
            >
              <Dropdown default={s.filterDefaultOpen} options={s.filterOptionsOpen} onChange={this.changeDropdown} />
            </div>
          </div>
        }
        {haveMarkets &&
          <MarketsList
            isLogged={p.isLogged}
            markets={s.openMarkets}
            filteredMarkets={s.filteredMarketsOpen}
            location={p.location}
            history={p.history}
            toggleFavorite={p.toggleFavorite}
            loadMarketsInfo={p.loadMarketsInfo}
            linkType={TYPE_TRADE}
            outstandingReturns
            paginationPageParam="open"
            collectMarketCreatorFees={p.collectMarketCreatorFees}
            isMobile={p.isMobile}
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
            <div
              className={Styles['Markets__SortBar-sort']}
            >
              <Dropdown default={s.sortDefaultReporting} options={s.sortOptionsReporting} onChange={this.changeDropdown} />
            </div>
            <div
              className={Styles['Markets__SortBar-filter']}
            >
              <Dropdown default={s.filterDefaultReporting} options={s.filterOptionsReporting} onChange={this.changeDropdown} />
            </div>
          </div>
        }
        {haveMarkets &&
          <MarketsList
            isLogged={p.isLogged}
            markets={s.reportingMarkets}
            filteredMarkets={s.filteredMarketsReporting}
            location={p.location}
            history={p.history}
            toggleFavorite={p.toggleFavorite}
            loadMarketsInfo={p.loadMarketsInfo}
            linkType={TYPE_REPORT}
            outstandingReturns
            paginationPageParam="reporting"
            collectMarketCreatorFees={p.collectMarketCreatorFees}
            isMobile={p.isMobile}
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
              Finalized
            </div>
            <div
              className={Styles.Markets__SortBar}
            >
              <Dropdown default={s.sortDefaultFinal} options={s.sortOptionsFinal} onChange={this.changeDropdown} />
            </div>
            <div
              className={Styles['Markets__SortBar-filter']}
            >
              <Dropdown default={s.filterDefaultFinal} options={s.filterOptionsFinal} onChange={this.changeDropdown} />
            </div>
          </div>
        }
        {haveMarkets &&
          <MarketsList
            isLogged={p.isLogged}
            markets={s.finalMarkets}
            filteredMarkets={s.filteredMarketsFinal}
            location={p.location}
            history={p.history}
            toggleFavorite={p.toggleFavorite}
            loadMarketsInfo={p.loadMarketsInfo}
            linkType={TYPE_CLOSED}
            outstandingReturns
            paginationPageParam="final"
            collectMarketCreatorFees={p.collectMarketCreatorFees}
            isMobile={p.isMobile}
          />
        }
        {haveMarkets && s.filteredMarketsFinal.length === 0 && <div className={Styles['Markets__nullState--spacer']} />}
        {(p.myMarkets == null || (p.myMarkets && p.myMarkets.length === 0)) &&
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
