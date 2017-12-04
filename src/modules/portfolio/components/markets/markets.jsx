import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import Dropdown from 'modules/common/components/dropdown/dropdown'
import MarketsList from 'modules/markets/components/markets-list'
import Styles from 'modules/portfolio/components/markets/markets.styles'
import { TYPE_REPORT } from 'modules/market/constants/link-types'
import { constants } from 'services/augurjs'

class MyMarkets extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    hasAllTransactionsLoaded: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    myMarkets: PropTypes.array.isRequired,
    scalarShareDenomination: PropTypes.object.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    loadMarketsInfo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    // NOTE: from here to this.state was added to sort markets, this might need to be more robust in the future.
    const reportingMarkets = []
    const designatedReportingMarkets = []
    this.reportingStates = constants.REPORTING_STATE

    this.props.myMarkets.forEach((market, index) => {
      if (market.reportingState === this.reportingStates.DESIGNATED_REPORTING) {
        designatedReportingMarkets.push(index)
      } else if (market.reportingState === this.reportingStates.FIRST_REPORTING || market.reportingState === this.reportingStates.LAST_REPORTING) {
        reportingMarkets.push(index)
      }
    })

    this.state = {
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
      filterDefaultReporting: 'finance',
      filterTypeReporting: 'finance',
      sortOptionsDesignatedReporting: [
        { label: 'Volume', value: 'volume' },
        { label: 'Newest', value: 'newest' },
        { label: 'Fees', value: 'fees' },
        { label: 'Expiring Soon', value: 'expiring' }
      ],
      sortDefaultDesignatedReporting: 'volume',
      sortTypeDesignatedReporting: 'volume',
      filterOptionsDesignatedReporting: [
        { label: 'Sports', value: 'sports' },
        { label: 'Finance', value: 'finance' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Politics', value: 'politics' },
        { label: 'Environment', value: 'environment' },
      ],
      filterDefaultDesignatedReporting: 'sports',
      filterTypeDesignatedReporting: 'sports',
      filteredMarketsReporting: reportingMarkets,
      filteredMarketsDesignatedReporting: designatedReportingMarkets
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
      const reportingMarkets = []
      const designatedReportingMarkets = []

      nextProps.myMarkets.forEach((market, index) => {
        if (market.reportingState === this.reportingStates.DESIGNATED_REPORTING) {
          designatedReportingMarkets.push(market.id)
        } else if (market.reportingState === this.reportingStates.FIRST_REPORTING || market.reportingState === this.reportingStates.LAST_REPORTING) {
          reportingMarkets.push(market.id)
        }
      })

      this.setState({ filteredMarketsReporting: reportingMarkets, filteredMarketsDesignatedReporting: designatedReportingMarkets })
    }
  }

  // TODO -- clean up this method
  changeDropdown(value) {
    let {
      sortTypeReporting,
      filterTypeReporting,
      sortTypeDesignatedReporting,
      filterTypeDesignatedReporting
    } = this.state

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

    this.state.sortOptionsDesignatedReporting.forEach((type, ind) => {
      if (type.value === value) {
        sortTypeDesignatedReporting = value
      }
    })

    this.state.filterOptionsDesignatedReporting.forEach((type, ind) => {
      if (type.value === value) {
        filterTypeDesignatedReporting = value
      }
    })


    this.setState({
      sortTypeReporting,
      filterTypeReporting,
      sortTypeDesignatedReporting,
      filterTypeDesignatedReporting
    })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <section className={Styles.Markets}>
        <Helmet>
          <title>My Markets</title>
        </Helmet>
        <div
          className={Styles.Markets__SortBar}
        >
          <div
            className={Styles['Markets__SortBar-title']}
          >
            Reporting
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
        <MarketsList
          isLogged={p.isLogged}
          markets={p.myMarkets}
          filteredMarkets={s.filteredMarketsReporting}
          location={p.location}
          history={p.history}
          scalarShareDenomination={p.scalarShareDenomination}
          toggleFavorite={p.toggleFavorite}
          loadMarketsInfo={p.loadMarketsInfo}
          linkType={TYPE_REPORT}
          outstandingReturns
          pageParam="reporting"
        />
        <div
          className={Styles.Markets__SortBar}
        >
          <div
            className={Styles['Markets__SortBar-title']}
          >
            Designated Reporting
          </div>
          <div
            className={Styles['Markets__SortBar-sort']}
          >
            <Dropdown default={s.sortDefaultDesignatedReporting} options={s.sortOptionsDesignatedReporting} onChange={this.changeDropdown} />
          </div>
          <div
            className={Styles['Markets__SortBar-filter']}
          >
            <Dropdown default={s.filterDefaultDesignatedReporting} options={s.filterOptionsDesignatedReporting} onChange={this.changeDropdown} />
          </div>
        </div>
        <MarketsList
          isLogged={p.isLogged}
          markets={p.myMarkets}
          filteredMarkets={s.filteredMarketsDesignatedReporting}
          location={p.location}
          history={p.history}
          scalarShareDenomination={p.scalarShareDenomination}
          toggleFavorite={p.toggleFavorite}
          loadMarketsInfo={p.loadMarketsInfo}
          linkType={TYPE_REPORT}
          outstandingReturns
          pageParam="designated"
        />
      </section>
    )
  }
}

export default MyMarkets
