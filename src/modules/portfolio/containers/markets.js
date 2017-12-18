import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MyMarkets from 'modules/portfolio/components/markets/markets'
import getMyMarkets from 'modules/my-markets/selectors/my-markets'
// import { loadAccountHistory } from 'modules/auth/actions/load-account-history'
// import { triggerTransactionsExport } from 'modules/transactions/actions/trigger-transactions-export'
import { toggleFavorite } from 'modules/markets/actions/update-favorites'
import loadMarkets from 'modules/markets/actions/load-markets'
import loadUserMarkets from 'modules/markets/actions/load-user-markets'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination'

const mapStateToProps = state =>
  // getMyMarkets or it's equivalent will need a way of calculating the outstanding returns for a market and attaching it to each market object. Currently I've just added a key/value pair to the market objects im using below.
  ({
    isLogged: state.isLogged,
    myMarkets: getMyMarkets(),
    transactionsLoading: state.transactionsLoading,
    scalarShareDenomination: getScalarShareDenomination(),
    hasAllTransactionsLoaded: state.transactionsOldestLoadedBlock === state.loginAccount.registerBlockNumber // FIXME
  })

const mapDispatchToProps = dispatch => ({
  loadMarkets: () => dispatch(loadUserMarkets((err, marketIDs) => {
    if (err) return logError(err)
    // if we have marketIDs back, lets load the info so that we can properly display myMarkets.
    dispatch(loadMarketsInfo(marketIDs))
  })),
  loadMarketsInfo: marketIDs => dispatch(loadMarketsInfo(marketIDs)),
  toggleFavorite: marketID => dispatch(toggleFavorite(marketID)),
})

const MyMarketsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(MyMarkets))

export default MyMarketsContainer
