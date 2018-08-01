import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import ReportingHeader from 'modules/reporting/containers/reporting-header'
import ReportDisputeNoRepState from 'src/modules/reporting/components/reporting-dispute-no-rep-state/reporting-dispute-no-rep-state'
import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'
import DisputeMarketCard from 'modules/reporting/components/dispute-market-card/dispute-market-card'
import MarketsHeaderStyles from 'modules/markets/components/markets-header/markets-header.styles'
import Paginator from 'modules/common/components/paginator/paginator'
import isEqual from 'lodash/isEqual'

const Styles = require('./reporting-dispute-markets.styles')

export default class ReportingDisputeMarkets extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    doesUserHaveRep: PropTypes.bool.isRequired,
    markets: PropTypes.array.isRequired,
    upcomingMarkets: PropTypes.array.isRequired,
    upcomingMarketsCount: PropTypes.number.isRequired,
    isMobile: PropTypes.bool,
    navigateToAccountDepositHandler: PropTypes.func.isRequired,
    isConnected: PropTypes.bool.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    outcomes: PropTypes.object.isRequired,
    isForking: PropTypes.bool.isRequired,
    forkingMarketId: PropTypes.string.isRequired,
    pageinationCount: PropTypes.number.isRequired,
    disputableMarketsLength: PropTypes.number,
    forkEndTime: PropTypes.string,
    showPagination: PropTypes.bool,
    showUpcomingPagination: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      lowerBound: 1,
      boundedLength: this.props.pageinationCount,
      lowerBoundUpcoming: 1,
      boundedLengthUpcoming: this.props.pageinationCount,
      loadedMarkets: [],
      filteredMarkets: [],
      loadedUpcomingMarkets: [],
      filteredUpcomingMarkets: [],
    }

    this.setSegment = this.setSegment.bind(this)
    this.setSegmentUpcoming = this.setSegmentUpcoming.bind(this)
  }

  componentWillMount() {
    const {
      loadMarkets,
    } = this.props
    loadMarkets()
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.lowerBound !== nextState.lowerBound ||
      this.state.boundedLength !== nextState.boundedLength ||
      !isEqual(this.state.loadedMarkets, nextProps.markets)
    ) {
      this.setLoadedMarkets(nextProps.markets, nextState.lowerBound, nextState.boundedLength, nextProps.showPagination)
    }
    if (
      this.state.lowerBoundUpcoming !== nextState.lowerBoundUpcoming ||
      this.state.boundedLengthUpcoming !== nextState.boundedLengthUpcoming ||
      !isEqual(this.state.loadedUpcomingMarkets, nextProps.upcomingMarkets)
    ) {
      this.setLoadedMarketsUpcoming(nextProps.upcomingMarkets, nextState.lowerBoundUpcoming, nextState.boundedLengthUpcoming, nextProps.showUpcomingPagination)
    }
  }

  setLoadedMarkets(markets, lowerBound, boundedLength, showPagination) {
    const filteredMarkets = this.filterMarkets(markets, lowerBound, boundedLength, showPagination) || []
    this.setState({ filteredMarkets, loadedMarkets: markets })
  }

  setLoadedMarketsUpcoming(markets, lowerBound, boundedLength, showPagination) {
    const filteredUpcomingMarkets = this.filterMarkets(markets, lowerBound, boundedLength, showPagination) || []
    this.setState({ filteredUpcomingMarkets, loadedUpcomingMarkets: markets })
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, boundedLength })
  }

  setSegmentUpcoming(lowerBoundUpcoming, upperBound, boundedLengthUpcoming) {
    this.setState({ lowerBoundUpcoming, boundedLengthUpcoming })
  }

  filterMarkets(markets, lowerBound, boundedLength, showPagination) {
    const {
      isConnected,
    } = this.props
    if (isConnected) {
      const marketIdLength = boundedLength + (lowerBound - 1)
      const marketIds = markets.map(m => m.id)
      const newMarketIdArray = marketIds.slice(lowerBound - 1, marketIdLength)

      return showPagination ? markets.filter(m => newMarketIdArray.indexOf(m.id) !== -1) : markets
    }
  }

  render() {
    const {
      doesUserHaveRep,
      forkEndTime,
      history,
      isForking,
      isMobile,
      location,
      markets,
      navigateToAccountDepositHandler,
      outcomes,
      upcomingMarketsCount,
      forkingMarketId,
      pageinationCount,
      disputableMarketsLength,
      showPagination,
      showUpcomingPagination,
    } = this.props
    const {
      filteredMarkets,
      filteredUpcomingMarkets,
    } = this.state

    let forkingMarket = null
    let nonForkingMarkets = filteredMarkets
    if (isForking) {
      forkingMarket = markets.find(market => market.id === forkingMarketId)
      nonForkingMarkets = filteredMarkets.filter(market => market.id !== forkingMarketId)
    }
    const nonForkingMarketsCount = filteredMarkets.length

    return (
      <section className={Styles.ReportDisputeContainer}>
        <Helmet>
          <title>Dispute</title>
        </Helmet>
        <section className={Styles.ReportDispute}>
          <ReportingHeader
            heading="Dispute"
            isForking={isForking}
            forkEndTime={forkEndTime}
          />
          { !doesUserHaveRep && !forkEndTime &&
          <ReportDisputeNoRepState
            btnText="Add Funds"
            message="You have 0 REP available. Add funds to dispute markets or purchase participation tokens."
            onClickHandler={navigateToAccountDepositHandler}
          />}
        </section>
        { isForking &&
          <DisputeMarketCard
            key={forkingMarketId}
            market={forkingMarket}
            isMobile={isMobile}
            location={location}
            history={history}
            outcomes={outcomes}
            isForkingMarket
          />
        }
        { nonForkingMarketsCount > 0 && !isForking &&
            nonForkingMarkets.map(market =>
              (<DisputeMarketCard
                key={market.id}
                market={market}
                isMobile={isMobile}
                location={location}
                history={history}
                outcomes={outcomes}
                isForkingMarket={false}
              />))
        }
        { nonForkingMarketsCount > 0 && !isForking && showPagination &&
          <Paginator
            itemsLength={disputableMarketsLength}
            itemsPerPage={pageinationCount}
            location={location}
            history={history}
            setSegment={this.setSegment}
            pageParam={'disputing' || null}
          />
        }
        { nonForkingMarketsCount === 0 && !isForking &&
          <NullStateMessage
            message="There are currently no markets available for dispute."
          />
        }
        <article className={MarketsHeaderStyles.MarketsHeader}>
          <h4 className={MarketsHeaderStyles.MarketsHeader__subheading}>{ isForking ? 'Dispute Paused' : 'Upcoming Dispute Window' }</h4>
        </article>
        { nonForkingMarketsCount > 0 && isForking &&
            nonForkingMarkets.map(market =>
              (<DisputeMarketCard
                key={market.id}
                market={market}
                isMobile={isMobile}
                location={location}
                history={history}
                outcomes={outcomes}
                isForkingMarket={false}
              />))
        }
        {upcomingMarketsCount > 0 &&
            filteredUpcomingMarkets.map(market =>
              (<DisputeMarketCard
                key={market.id}
                market={market}
                isMobile={isMobile}
                location={location}
                history={history}
                outcomes={outcomes}
              />))
        }
        { upcomingMarketsCount > 0 && showUpcomingPagination &&
          <Paginator
            itemsLength={upcomingMarketsCount}
            itemsPerPage={pageinationCount}
            location={location}
            history={history}
            setSegment={this.setSegmentUpcoming}
            pageParam={'upcoming' || null}
          />
        }
        { (upcomingMarketsCount === 0 || ( nonForkingMarketsCount === 0 && upcomingMarketsCount === 0 && isForking )) &&
          <NullStateMessage
            message="There are currently no markets slated for the upcoming dispute window."
          />
        }
      </section>
    )
  }
}
