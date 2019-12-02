import { connect } from 'react-redux';

import AccountView from 'modules/account/components/account-view';
import { AppState } from 'store';

const mapStateToProps = (state: AppState) => ({
  isLogged: state.authStatus.isLogged,
});

export default connect(mapStateToProps)(AccountView);
