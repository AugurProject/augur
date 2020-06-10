import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Message } from 'modules/modal/message';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';

const mapStateToProps = (state: AppState) => ({
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => AppStatus.actions.closeModal(),
});

const mergeProps = (sP, dP, oP) => {
  return {
    showHelp: true,
    title: 'Popular help resources',
    closeAction: () => {
        dP.closeModal();
      },
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Message)
);
