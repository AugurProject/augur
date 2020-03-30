import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ModalDisclaimer from 'modules/modal/components/modal-disclaimer';
import { closeModal } from 'modules/modal/actions/close-modal';
import { DISCLAIMER_SEEN } from 'modules/common/constants';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';

const mapStateToProps = (state: AppState) => ({
  onApprove: state.modal.onApprove,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => {
    const localStorageRef =
      typeof window !== 'undefined' && window.localStorage;
    if (localStorageRef && localStorageRef.setItem) {
      localStorageRef.setItem(DISCLAIMER_SEEN, 'true');
    }
    dispatch(closeModal());
  },
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalDisclaimer)
);
