import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { TransferMyDai } from 'modules/modal/common';
import { formatDai } from 'utils/format-number';
import { MODAL_BUY_DAI, MODAL_TRANSFER } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const {
    loginAccount: {
      meta: { accountType: walletType },
      balances: {
        signerBalances: { dai },
      },
    },
    walletStatus,
  } = AppStatus.get();
  return {
    walletType,
    daiAmount: dai || 0,
    walletStatus,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => {
  const { setModal } = AppStatus.actions;
  return {
    showBuyDaiModal: () => setModal({ type: MODAL_BUY_DAI }),
    transferfunds: callback =>
      setModal({ type: MODAL_TRANSFER, useSigner: true, cb: callback }),
  };
};
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
