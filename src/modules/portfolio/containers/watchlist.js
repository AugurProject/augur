import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Watchlist from 'modules/portfolio/components/watchlist/watchlist'
import { toggleFavorite } from 'modules/markets/actions/update-favorites'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination'

const mapStateToProps = (state) => {
  // basically just create the filtered markets based on what IDs we find in the favorites object
  const favoritesIDs = Object.keys(state.favorites)
  const watchedMarketsDataArray = []
  const filteredMarkets = []
  // TODO: potentially move this into it's own function
  favoritesIDs.forEach((ID, Index) => {
    // make sure there is market data to display, otherwise don't add it to the view
    if (state.marketsData[ID] !== undefined) {
      watchedMarketsDataArray.push(state.marketsData[ID])
      filteredMarkets.push(Index)
    }
  })

  return {
    isLogged: state.isLogged,
    markets: watchedMarketsDataArray,
    filteredMarkets,
    transactionsLoading: state.transactionsLoading,
    scalarShareDenomination: getScalarShareDenomination(),
    hasAllTransactionsLoaded: state.transactionsOldestLoadedBlock === state.loginAccount.registerBlockNumber // FIXME
  }
}

const mapDispatchToProps = dispatch => ({
  loadMarketsInfo: marketIDs => dispatch(loadMarketsInfo(marketIDs)),
  toggleFavorite: marketID => dispatch(toggleFavorite(marketID)),
})

const WatchListContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Watchlist))

export default WatchListContainer
