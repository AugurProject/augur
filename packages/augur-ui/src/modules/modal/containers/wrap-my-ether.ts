import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { WrapMyEtherNotice } from 'modules/modal/common';
import { formatEther } from 'utils/format-number';
import { updateModal } from '../actions/update-modal';
import { MODAL_ADD_FUNDS, ETH, WETH } from 'modules/common/constants';

interface OwnProps {
  condensed: boolean;
  callBack: Function;
  autoClose?: boolean;
}

const mapStateToProps = (state: AppState) => ({
  walletType: state.loginAccount?.meta?.accountType,
  tokenAmount: state.loginAccount?.balances?.signerBalances?.eth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  showWrapMyEtherModal: () => dispatch(updateModal({ type: MODAL_ADD_FUNDS, toToken: WETH, fromToken: ETH })),
});

const mergeProps = (sP: any, dP: any, oP: OwnProps) => ({
  ...sP,
  ...dP,
  isCondensed: oP.condensed || false,
  tokenName: ETH,
  tokenAmount: formatEther(sP.tokenAmount),
  autoClose: oP.autoClose,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(WrapMyEtherNotice)
);
