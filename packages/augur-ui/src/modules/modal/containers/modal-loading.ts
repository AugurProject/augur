import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Loading } from 'modules/modal/loading';
import { AppState } from 'store';

const mapStateToProps = (state: AppState) => ({
  isLogged: state.authStatus.isLogged,
  modal: state.modal,
});

const mapDispatchToProps = () => ({});

const mergeProps = (sP: any) => ({
  shouldClose: sP.isLogged,
  message: sP.modal.message,
  callback: sP.modal.callback
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Loading)
);
