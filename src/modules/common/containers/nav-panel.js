import { connect } from 'react-redux'

import NavPanel from 'modules/common/components/nav-panel/nav-panel'

const mapStateToProps = state => ({
  isMobile: state.isMobile
})

export default connect(mapStateToProps)(NavPanel)
