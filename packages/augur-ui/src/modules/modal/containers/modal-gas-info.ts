import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { Message } from 'modules/modal/message';
import { GAS_INFO_MODAL_SEEN } from 'modules/common/constants';

const mapStateToProps = (state: AppState, ownProps) => {
  const { appStatus } = state;
  const { isMobile } = appStatus;
  return {
    isMobile,
    ...ownProps.modal,
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeAction: (callback) => {
    const localStorageRef =
    typeof window !== 'undefined' && window.localStorage;
  if (localStorageRef && localStorageRef.setItem) {
    localStorageRef.setItem(GAS_INFO_MODAL_SEEN, 'true');
  }
    dispatch(closeModal());
    if (callback) callback();
  },
});

const mergeProps = (sP: any, dP: any) => {
  let image = 'gas-info.png';
  if (sP.isMobile)  image = 'gas-info-mb.png'

  return {
    title: 'Transaction fees',
    description: 'If you want to set your transaction fee to something different than default, you should do so via your account settings at the top right of the app',
    footer: 'Do not try to set the gas fee in your wallet as it will cause your trade to fail',
    image,
    ...sP,
    closeAction: () => dP.closeAction(sP.callback),
  }
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Message)
);
