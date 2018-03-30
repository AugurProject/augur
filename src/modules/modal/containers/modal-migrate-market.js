import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ModalMigrateMarket from 'modules/modal/components/modal-migrate-market/modal-migrate-market'
import { migrateMarketThroughFork } from 'modules/forking/actions/migrate-market-through-fork'

import { closeModal } from 'modules/modal/actions/close-modal'

const mapStateToProps = state => ({
  ...state.modal,
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  migrateMarketThroughFork: (marketId, estimateGas, callback) => dispatch(migrateMarketThroughFork(marketId, estimateGas, callback)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalMigrateMarket))
