import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalUniverseSelector } from 'modules/modal/components/modal-universe-selector';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { universe: universeDetails, modal } = AppStatus.get();
  return {
    modal,
    universeDetails,
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
