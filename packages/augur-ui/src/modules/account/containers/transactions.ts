import { connect } from 'react-redux';
import { Transactions } from 'modules/account/components/transactions';
import {
  NETWORK_IDS,
  MODAL_TRANSFER,
  MODAL_CASHOUT,
  MODAL_REP_FAUCET,
  MODAL_DAI_FAUCET,
  MODAL_ADD_FUNDS,
  MODAL_TRANSACTIONS,
  MODAL_ACCOUNT_APPROVAL,
  ZERO,
} from 'modules/common/constants';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { getNetworkId, getLegacyRep } from 'modules/contracts/actions/contractCalls'
import { createBigNumber } from 'utils/create-big-number';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { loginAccount: { meta, balances } } = AppStatus.get();
  const signingWallet = meta.signer?._address;
  const networkId = getNetworkId();
  const showFaucets = networkId !== NETWORK_IDS.Mainnet;

  const localLabel = networkId !== NETWORK_IDS.Kovan ? 'Use flash to transfer ETH to address' : null;
  const targetAddress = signingWallet;
  const signingWalletNoEth = createBigNumber(balances.ethNonSafe || 0).lte(ZERO);

  return {
    isMainnet: networkId === NETWORK_IDS.Mainnet,
    showFaucets,
    targetAddress,
    signingEth: balances.ethNonSafe || 0,
    signingWalletNoEth,
    localLabel
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => {
  const { setModal } = AppStatus.actions;
  return ({
    repFaucet: () => setModal({ type: MODAL_REP_FAUCET }),
    daiFaucet: () => setModal({ type: MODAL_DAI_FAUCET }),
    addFunds: () => setModal({ type: MODAL_ADD_FUNDS }),
    transfer: () => setModal({ type: MODAL_TRANSFER }),
    transactions: () => setModal({ type: MODAL_TRANSACTIONS }),
    approval: () => setModal({ type: MODAL_ACCOUNT_APPROVAL }),
    legacyRepFaucet: () => getLegacyRep(),
    cashOut: () => setModal({ type: MODAL_CASHOUT }),
  });
};
const TransactionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions);

export default TransactionsContainer;
