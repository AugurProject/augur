import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Message } from 'modules/modal/message';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { DISPUTING_GUIDE, REPORTING_GUIDE } from 'modules/common/constants';

const mapStateToProps = (state: AppState) => {
  return {
    modal: state.modal,
    guide: state.modal.whichGuide === 'reporting' ? REPORTING_GUIDE : DISPUTING_GUIDE
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal())
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: sP.guide.title,
  content: sP.guide.content,
  closeAction: () => {
    dP.closeModal();
  },
  buttons: [
    {
      text: sP.guide.learnMoreButtonText,
      action: () => {
        dP.closeModal();
      },
    },
    {
      text: sP.guide.closeButtonText,
      action: () => {
        dP.closeModal();
      }
    }
  ],
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Message),
);
