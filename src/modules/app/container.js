import { connect } from 'react-redux';
import App from 'modules/app/components/app';

import getValue from 'utils/get-value';

const mapStateToProps = state => ({
  logged: getValue(state, 'loginAccount.address'),
  activeView: state.activeView
});

const mapDispatchToProps = dispatch => ({
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
