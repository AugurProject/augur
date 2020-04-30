import { connect } from 'react-redux';
import ConnectAccount from 'modules/auth/components/connect-account/connect-account';

const mapStateToProps = state => ({
  universeId: state.universe.id,
  userInfo: state.loginAccount.meta,
  balances: state.loginAccount.balances,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectAccount);
