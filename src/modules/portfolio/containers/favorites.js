import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Favorites from 'modules/portfolio/components/favorites/favorites'
import { toggleFavorite } from 'modules/markets/actions/update-favorites'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import selectAllMarkets from 'modules/markets/selectors/markets-all'
import { updateModal } from 'modules/modal/actions/update-modal'

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
    hasAllTransactionsLoaded: state.transactionsOldestLoadedBlock === state.loginAccount.registerBlockNumber, // FIXME
    isForking: state.universe.isForking,
    isForkingMarketFinalized: state.universe.isForkingMarketFinalized,
    forkingMarket: state.universe.forkingMarket,
  }
}

const mapDispatchToProps = dispatch => ({
  loadMarketsInfo: marketIds => dispatch(loadMarketsInfo(marketIds)),
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  updateModal: modal => dispatch(updateModal(modal)),
})

const FavoritesContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Favorites))

export default FavoritesContainer
