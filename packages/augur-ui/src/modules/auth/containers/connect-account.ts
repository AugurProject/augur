import { connect } from 'react-redux';
import ConnectAccount from 'modules/auth/components/connect-account/connect-account';
import { updateMobileMenuState } from 'modules/app/actions/update-sidebar-status';

const mapStateToProps = state => ({
  universeId: state.universe.id,
  userInfo: state.loginAccount.meta,
  balances: state.loginAccount.balances,
  mobileMenuState: state.sidebarStatus.mobileMenuState,
});

const mapDispatchToProps = dispatch => ({
  updateMobileMenuState: data => dispatch(updateMobileMenuState(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectAccount);
