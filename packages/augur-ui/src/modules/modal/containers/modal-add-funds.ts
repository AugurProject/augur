import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AddFunds } from 'modules/modal/add-funds';
import { AppState } from 'store';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import getValue from 'utils/get-value';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  address: getValue(state, 'loginAccount.address'),
  isGnosis: getValue(state, 'loginAccount.isGnosis'),
  accountMeta: getValue(state, 'loginAccount.meta'),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP, dP, oP) => {
  return {
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    ...oP,
    ...sP,
  };
};


export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(AddFunds)
);
