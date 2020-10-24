import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { ConvertToDai } from 'modules/modal/common';
import { formatDaiPrice, formatDai } from 'utils/format-number';
import { updateModal } from '../actions/update-modal';
import {
  MODAL_BUY_DAI,
  MODAL_ADD_FUNDS,
  ADD_FUNDS_SWAP,
} from 'modules/common/constants';

const mapStateToProps = (state: AppState) => ({
  walletType: state.loginAccount?.meta?.accountType,
  walletStatus: state.appStatus.walletStatus,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  showBuyDaiModal: () => dispatch(updateModal({ type: MODAL_BUY_DAI })),
  showAddFundsModal: (tokenName, callback) =>
    dispatch(
      updateModal({
        type: MODAL_ADD_FUNDS,
        initialSwapToken: tokenName,
        initialAddFundsFlow: ADD_FUNDS_SWAP,
        useSigner: true,
        cb: callback,
      })
    ),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...sP,
  isCondensed: oP.condensed || false,
  balance: formatDai(oP.balance),
  tokenName: oP.tokenName,
  showAddFundsModal: () => {
    dP.showAddFundsModal(oP.tokenName, () => {
      if (oP.callBack) {
        setTimeout(() => oP.callBack());
      }
    });
  },
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(ConvertToDai)
);
