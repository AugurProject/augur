import { connect } from 'react-redux'
import AuthLander from 'modules/auth/components/lander/lander'

const mapStateToProps = state => ({
  isMobile: state.isMobile,
})

export default connect(mapStateToProps)(AuthLander)
