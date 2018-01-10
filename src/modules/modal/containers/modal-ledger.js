import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ModalLedger from 'modules/modal/components/modal-ledger/modal-ledger'

const mapDispatchToProps = dispatch => ({})

export default withRouter(connect(null, mapDispatchToProps)(ModalLedger))
