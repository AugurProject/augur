import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { TransferMyDai } from 'modules/modal/common';
import { formatDai } from 'utils/format-number';
import { updateModal } from '../actions/update-modal';
import {
  MODAL_ADD_FUNDS,
  MODAL_BUY_DAI,
} from 'modules/common/constants';

const mapStateToProps = (state: AppState) => ({
  walletType: state.loginAccount?.meta?.accountType,
  daiAmount: state.loginAccount?.balances?.daiNonSafe || 0,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  showBuyDaiModal: () => dispatch(updateModal({ type: MODAL_BUY_DAI })),
  addFunds: callback =>
    dispatch(
      updateModal({ type: MODAL_ADD_FUNDS, showTransfer: true, cb: callback })
    ),
});

const mergeProps = (sP: any, dP: any) => ({
  ...sP,
  daiAmount: formatDai(sP.daiAmount),
  showTransferModal: () => {
    dP.addFunds(() => setTimeout(() => dP.showBuyDaiModal()));
  },
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(TransferMyDai)
);
