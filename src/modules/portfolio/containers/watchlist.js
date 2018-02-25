import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Watchlist from 'modules/portfolio/components/watchlist/watchlist'
import { toggleFavorite } from 'modules/markets/actions/update-favorites'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import selectAllMarkets from 'modules/markets/selectors/markets-all'

const mapStateToProps = (state) => {
  // basically just create the filtered markets based on what IDs we find in the favorites object
  const markets = []
  const filteredMarkets = []
  const allMarkets = selectAllMarkets()
  // TODO: potentially move this into it's own function
  allMarkets.forEach((market) => {
    if (state.favorites[market.id]) {
      filteredMarkets.push(market.id)
      markets.push(market)
    }
  })

  return {
    isLogged: state.isLogged,
    markets,
    filteredMarkets,
    transactionsLoading: state.transactionsLoading,
    hasAllTransactionsLoaded: state.transactionsOldestLoadedBlock === state.loginAccount.registerBlockNumber // FIXME
  }
}

const mapDispatchToProps = dispatch => ({
  loadMarketsInfo: marketIds => dispatch(loadMarketsInfo(marketIds)),
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
})

const WatchListContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Watchlist))

export default WatchListContainer
