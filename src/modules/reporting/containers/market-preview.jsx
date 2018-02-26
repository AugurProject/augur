import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketPreview from 'src/modules/market/components/market-preview/market-preview'

const mapStateToProps = state => ({
  isLogged: state.isLogged
})

const ConnectedMarketPreview = connect(mapStateToProps)(withRouter(MarketPreview))
export default ConnectedMarketPreview
