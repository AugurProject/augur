import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AddFunds } from 'modules/modal/add-funds';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { ADD_FUNDS, track } from 'services/analytics/helpers';
import { createBigNumber } from 'utils/create-big-number';
import { DAI } from 'modules/common/constants';



const mapStateToProps = (state: AppState) => {
  const ethToDaiRate = state.appStatus.ethToDaiRate;
  const repToDaiRate = state.appStatus.repToDaiRate;
  const usdtToDaiRate = state.appStatus.usdtToDaiRate;
  const usdcToDaiRate = state.appStatus.usdcToDaiRate;
  const ETH_RATE = createBigNumber(1).dividedBy(
    ethToDaiRate?.value || createBigNumber(1)
  );
  const REP_RATE = createBigNumber(ETH_RATE).times (
    repToDaiRate?.value || createBigNumber(1)
  );

  return {
    modal: state.modal,
    loginAccount: state.loginAccount,
    address: state.loginAccount.address,
    balances: {
      ...state.loginAccount.balances.signerBalances,
    },
    ETH_RATE,
    REP_RATE,
    config: state.env,
    ethToDaiRate,
    repToDaiRate,
    usdtToDaiRate,
    usdcToDaiRate,
    gasPrice: state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
  };
};

export const addFundsFortmatic = async (amount, crypto, address) => {
  await fm.user.deposit({
    amount: amount.toNumber(),
    crypto,
    address,
  });
};

export const addFundsTorus = async (amount, address, crypto = DAI) => {
  await torus.showWallet('topup', {
    selectedAddress: address,
    fiatValue: amount.toNumber(),
    selectedCryptoCurrency: crypto,
  });
};


const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  track: (eventName, payload) => dispatch(track(eventName, payload)),
  addFundsTorus: (amount, address) => addFundsTorus(amount, address),
  addFundsFortmatic: (amount, crypto, address) =>
    addFundsFortmatic(amount, crypto, address),
});

const mergeProps = (sP, dP, oP) => {
  return {
    tokenToAdd: sP.modal.tokenToAdd,
    initialAddFundsFlow: sP.modal.initialAddFundsFlow,
    initialSwapToken: sP.modal.initialSwapToken,
    addFundsTorus: dP.addFundsTorus,
    addFundsFortmatic: dP.addFundsFortmatic,
    analyticsEvent: () => dP.track(ADD_FUNDS, {}),
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    ...oP,
    ...sP,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(AddFunds)
);
