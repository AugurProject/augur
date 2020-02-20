import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalUniverseSelector } from 'modules/modal/components/modal-universe-selector';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = (state: AppState) => {
  const universe = state.universe;
  return {
    modal: state.modal,
    universeDetails: universe,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  return {
    closeAction: () => {
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
  )(ModalUniverseSelector)
);
