import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { MigrateRep } from 'modules/modal/migrate-rep';
import { AppState } from 'store';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { convertV1ToV2 } from 'modules/contracts/actions/contractCalls';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  loginAccount: state.loginAccount,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  convertV1ToV2: () => dispatch(convertV1ToV2()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...dP,
  loginAccount: sP.loginAccount,
  closeAction: () => dP.closeModal(),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(MigrateRep)
);
