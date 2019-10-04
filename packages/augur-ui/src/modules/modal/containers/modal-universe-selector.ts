import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalUniverseSelector } from 'modules/modal/components/modal-universe-selector';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = (state: AppState) => {
  return {
    modal: state.modal,
    universeDetails: state.universe
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  return {
    ...sP,
    ...dP,
    ...oP,
    title: 'Augur Universe Picker',
    description: ['A few lines of copy explaining what Augur universes are.'],
    closeModal: () => dP.closeModal(),
    buttons: [
      {
        text: 'Close',
        action: () => dP.closeModal(),
      },
    ],
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(ModalUniverseSelector)
);
