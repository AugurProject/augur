import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MarketPreview from 'modules/market/components/market-preview/market-preview'
import Paginator from 'modules/common/components/paginator/paginator'
import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'
import { TYPE_TRADE } from 'modules/market/constants/link-types'
import isEqual from 'lodash/isEqual'

import debounce from 'utils/debounce'

export default class MarketsList extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    isLogged: PropTypes.bool.isRequired,
    markets: PropTypes.array.isRequired,
    filteredMarkets: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfoIfNotLoaded: PropTypes.func.isRequired,
    paginationPageParam: PropTypes.string,
    linkType: PropTypes.string,
    showPagination: PropTypes.bool,
    collectMarketCreatorFees: PropTypes.func,
    isMobile: PropTypes.bool,
  }

  static defaultProps = {
    showPagination: true,
  }

  constructor(props) {
    super(props)

    this.state = {
      lowerBound: this.props.showPagination ? null : 1,
      boundedLength: this.props.showPagination ? null : this.props.filteredMarkets.length,
      marketIdsMissingInfo: [], // This is ONLY the currently displayed markets that are missing info
    }

    this.setSegment = this.setSegment.bind(this)
    this.setMarketIDsMissingInfo = this.setMarketIDsMissingInfo.bind(this)
    this.loadMarketsInfoIfNotLoaded = debounce(this.loadMarketsInfoIfNotLoaded.bind(this))
  }

  componentWillMount() {
    const { filteredMarkets } = this.props
    this.loadMarketsInfoIfNotLoaded(filteredMarkets)
  }

  componentWillUpdate(nextProps, nextState) {
    const { filteredMarkets } = this.props
    if (
      this.state.lowerBound !== nextState.lowerBound ||
      this.state.boundedLength !== nextState.boundedLength ||
      !isEqual(filteredMarkets, nextProps.filteredMarkets)
    ) {
      this.setMarketIDsMissingInfo(nextProps.markets, nextProps.filteredMarkets, nextState.lowerBound, nextState.boundedLength)
    }

    if (!isEqual(this.state.marketIdsMissingInfo, nextState.marketIdsMissingInfo)) this.loadMarketsInfoIfNotLoaded(nextState.marketIdsMissingInfo)
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, boundedLength })
  }

  setMarketIDsMissingInfo(markets, filteredMarkets, lowerBound, boundedLength) {
    const marketIdsMissingInfo = []
    if (filteredMarkets.length && boundedLength) {
      [...Array(boundedLength)].forEach((unused, i) => {
        const item = filteredMarkets[(lowerBound - 1) + i]
        const market = markets.find(market => market.id === item)
        if (market && !market.hasLoadedMarketInfo) marketIdsMissingInfo.push(market.id)
      })
    }

    this.setState({ marketIdsMissingInfo })
  }

  // debounced call
  loadMarketsInfoIfNotLoaded() {
    const { loadMarketsInfoIfNotLoaded } = this.props
    loadMarketsInfoIfNotLoaded(this.state.marketIdsMissingInfo)
  }

  // NOTE -- You'll notice the odd method used for rendering the previews, this is done for optimization reasons
  render() {
    const {
      collectMarketCreatorFees,
      filteredMarkets,
      history,
      isLogged,
      isMobile,
      location,
      markets,
      paginationPageParam,
      showPagination,
      toggleFavorite,
    } = this.props
    const s = this.state

    const marketsLength = filteredMarkets.length

    return (
      <article className="markets-list">
        {marketsLength && s.boundedLength ?
          [...Array(s.boundedLength)].map((unused, i) => {
            const id = filteredMarkets[(s.lowerBound - 1) + i]
            const market = markets.find(market => market.id === id)

            if (market && market.id) {
              return (
                <MarketPreview
                  {...market}
                  key={`${market.id} - ${market.outcomes}`}
                  isLogged={isLogged}
                  toggleFavorite={toggleFavorite}
                  location={location}
                  history={history}
                  collectMarketCreatorFees={collectMarketCreatorFees}
                  isMobile={isMobile}
                  linkType={TYPE_TRADE}
                />
              )
            }

            return null
          }) :
          <NullStateMessage message="No Markets Available" /> }
        {!!marketsLength && showPagination &&
          <Paginator
            itemsLength={marketsLength}
            itemsPerPage={10}
            location={location}
            history={history}
            setSegment={this.setSegment}
            pageParam={paginationPageParam || null}
          />
        }
      </article>
    )
  }
}
