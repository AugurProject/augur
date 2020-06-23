import { compose } from 'redux';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import App from 'modules/app/components/app';
import { initAugur } from 'modules/app/actions/init-augur';
import { RewriteUrlParams } from 'modules/app/hocs/rewrite-url-params';
import { windowRef } from 'utils/window-ref';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  initAugur: (overrides, cb) => initAugur(overrides, cb),
});

const AppContainer = compose(
  withRouter,
  RewriteUrlParams(windowRef),
  connect(mapStateToProps, mapDispatchToProps)
)(App);

export default AppContainer;
