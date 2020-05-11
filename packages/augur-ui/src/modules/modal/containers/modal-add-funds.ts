import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AddFunds } from 'modules/modal/add-funds';
import { AppState } from 'appStore';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { ADD_FUNDS, track } from 'services/analytics/helpers';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { loginAccount, modal } = AppStatus.get();
  return {
    modal,
    loginAccount,
    isRelayDown: false, // TODO XXX Need to have some suitable status update for when relayer is down. No longer related to wallets
  }
};

const addFundsPortis = async (amount) => {
  // TODO
}

const addFundsFortmatic = async (amount, crypto, address) => {
  await fm.user.deposit({
    amount: amount.toNumber(),
    crypto,
    address,
  });
}

const addFundsTorus = async (amount, address) => {
  await window.torus.initiateTopup('wyre', {
    selectedCurrency: 'USD',
    selectedAddress: address,
    fiatValue: amount.toNumber(),
    selectedCryptoCurrency: 'DAI'
  });
}

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  track: (eventName, payload) => dispatch(track(eventName, payload)),
  addFundsTorus: (amount, address) => addFundsTorus(amount, address),
  addFundsFortmatic: (amount, crypto, address) => addFundsFortmatic(amount, crypto, address),
});

const mergeProps = (sP, dP, oP) => {
  return {
    fundType: sP.modal.fundType,
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
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(AddFunds)
);
