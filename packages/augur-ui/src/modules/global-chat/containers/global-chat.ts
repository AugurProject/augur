import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import GlobalChat from 'modules/common/global-chat';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = (state: AppState) => ({
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
});

const mergeProps = (sP: any, dP: any, oP: any) => {
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(GlobalChat)
);
