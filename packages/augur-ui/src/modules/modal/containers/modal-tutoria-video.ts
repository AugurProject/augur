import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ModalTutorialVideo from 'modules/modal/components/modal-tutorial-video'
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = (state: AppState) => {
  return {
    modal: state.modal,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: 'Trading Tutorial Video',
  closeAction: () => {
    dP.closeModal();
  },
  buttons: [
    {
      text: 'Ok',
      action: () => {
        dP.closeModal();
      },
    },
  ],
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ModalTutorialVideo)
);
