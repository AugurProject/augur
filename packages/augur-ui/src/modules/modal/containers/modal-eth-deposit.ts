import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  MODAL_AUGUR_USES_DAI,
  MODAL_TOKEN_SELECT,
} from 'modules/common/constants';
import { closeModal } from '../actions/close-modal';

const mapStateToProps = (state: AppState) => {
  return {
    address: state.loginAccount.address,
    balances: state.loginAccount.balances,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  tokenSelectModala: () => dispatch(updateModal({ type: MODAL_TOKEN_SELECT })),
  goBack: () => dispatch(updateModal({ type: MODAL_AUGUR_USES_DAI })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...sP,
  title: 'First you need to deposit ETH to pay for transaction fees.',
  showDeposit: true,
  showSkipButton: true,
  closeModal: dP.closeModal,
  address: sP.address,
  currentStep: 2,
  goBack: dP.goBack,
  content: [
    {
      content:
        'Before you can start trading, you need to fund your wallet with ETH to process transactions on the Ethereum network.',
    },
  ],
  buttons: [
    {
      text: 'Next',
      disabled: !(Number(sP.balances?.signerBalances?.eth) > 0),
      action: () => {
        dP.tokenSelectModala();
      },
    },
  ],
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
