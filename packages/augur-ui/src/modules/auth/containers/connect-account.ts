import { connect } from 'react-redux';
import ConnectAccount from 'modules/auth/components/connect-account/connect-account';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = state => ({
  universeId: AppStatus.get().universe.id,
  userInfo: state.loginAccount.meta,
  balances: state.loginAccount.balances,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectAccount);
