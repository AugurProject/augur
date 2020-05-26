import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { TransferMyDai } from 'modules/modal/common';
import { formatDai } from 'utils/format-number';
import { updateModal } from '../actions/update-modal';
import {
  MODAL_BUY_DAI,
  MODAL_TRANSFER,
} from 'modules/common/constants';

const mapStateToProps = (state: AppState) => ({
  walletType: state.loginAccount?.meta?.accountType,
  daiAmount: state.loginAccount?.balances?.signerBalances?.dai || 0,
  walletStatus: state.appStatus.walletStatus,

});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  showBuyDaiModal: () => dispatch(updateModal({ type: MODAL_BUY_DAI })),
  transferfunds: callback =>
    dispatch(
      updateModal({ type: MODAL_TRANSFER, useSigner: true, cb: callback })
    ),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...sP,
  isCondensed: oP.condensed || false,
  daiAmount: formatDai(sP.daiAmount),
  showTransferModal: () => {
    dP.transferfunds(() => {
      if (oP.callBack) {
        setTimeout(() => oP.callBack());
      }
    });
  },
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(TransferMyDai)
);
