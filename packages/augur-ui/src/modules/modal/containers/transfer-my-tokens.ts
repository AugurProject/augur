import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { TransferMyTokens } from 'modules/modal/common';
import { formatDaiPrice, formatDai } from 'utils/format-number';
import { updateModal } from '../actions/update-modal';
import {
  MODAL_BUY_DAI,
  MODAL_TRANSFER,
  DAI,
  REP
} from 'modules/common/constants';

interface OwnProps {
  tokenName: string,
  condensed: boolean,
  callBack: Function,
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => ({
  walletType: state.loginAccount?.meta?.accountType,
  tokenAmount:
    ownProps.tokenName === DAI
      ? state.loginAccount?.balances?.signerBalances?.dai
      : ownProps.tokenName === REP
      ? state.loginAccount?.balances?.signerBalances?.rep
      : 0,
  walletStatus: state.appStatus.walletStatus,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  showBuyDaiModal: () => dispatch(updateModal({ type: MODAL_BUY_DAI })),
  transferfunds: (callback, tokenName) =>
    dispatch(
      updateModal({ type: MODAL_TRANSFER, useSigner: true, cb: callback, tokenName })
    ),
});

const mergeProps = (sP: any, dP: any, oP: OwnProps) => ({
  ...sP,
  isCondensed: oP.condensed || false,
  tokenName: oP.tokenName ? oP.tokenName : DAI,
  tokenAmount: formatDai(sP.tokenAmount),
  showTransferModal: () => {
    dP.transferfunds(() => {
      if (oP.callBack) {
        setTimeout(() => oP.callBack());
      }
    }, oP.tokenName);
  },
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(TransferMyTokens)
);
