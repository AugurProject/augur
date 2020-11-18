import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Onboarding } from 'modules/modal/onboarding';
import { updateModal } from 'modules/modal/actions/update-modal';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  HELP_CENTER_WHAT_IS_DAI,
  MODAL_ETH_DEPOSIT,
  MODAL_APPROVALS,
  MODAL_TOKEN_SELECT,
} from 'modules/common/constants';
import { OnboardingDollarDaiIcon, EthIcon } from 'modules/common/icons';
import { updateLoginAccount } from 'modules/account/actions/login-account';

const mapStateToProps = (state: AppState) => ({
  balances: state.loginAccount.balances,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  gotoApprovals: () => dispatch(updateModal({ type: MODAL_APPROVALS })),
  gotoTokenSelect: () => dispatch(updateModal({ type: MODAL_TOKEN_SELECT })),
  gotoDeposit: () => dispatch(updateModal({ type: MODAL_ETH_DEPOSIT })),
  setCurrentOnboardingStep: (currentOnboardingStep) => dispatch(updateLoginAccount({ currentOnboardingStep })),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  icon: OnboardingDollarDaiIcon,
  title: 'Augur requires both DAI & ETH ',
  content: [
    {
      icon: OnboardingDollarDaiIcon,
      header: 'Augur uses DAI for betting',
      content:
        'DAI is a pegged currency that mirrors the value of the US dollar. This means that ‘1 DAI’ is equivalent to ‘1 USD’. DAI is referred to with $ symbol.',
    },
    {
      icon: EthIcon,
      header: 'ETH is used for transaction costs',
      content:
        'Gas costs are transaction fees which are payed in ETH. These are required to process any transactions on the Ethereum network.',
    },
  ],
  currentStep: 1,
  setCurrentOnboardingStep: dP.setCurrentOnboardingStep,
  gotoApprovals: dP.gotoApprovals,
  gotoTokenSelect: dP.gotoTokenSelect,
  gotoDeposit: dP.gotoDeposit,
  balances: sP.balances,
  linkContent: [
    {
      content:
        'DAI is a pegged currency that mirrors the value of the US dollar. This means that ‘1 DAI’ is equivalent to ‘1 USD’. DAI is referred to with $ symbol.',
    },
    {
      content: 'Learn more about DAI',
      link: HELP_CENTER_WHAT_IS_DAI,
    },
  ],
  buttons: [
    {
      text: 'Next',
      disabled: false,
      action: () => dP.gotoDeposit(),
    },
  ],
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Onboarding)
);
