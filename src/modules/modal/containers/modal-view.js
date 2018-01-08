import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ModalView from 'modules/modal/components/modal-view/modal-view'

const mapStateToProps = state => ({
  isModalVisible: state.isModalVisible
})

export default withRouter(connect(mapStateToProps)(ModalView))
