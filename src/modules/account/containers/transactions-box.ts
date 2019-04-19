import { connect } from "react-redux";
import { updateModal } from "modules/modal/actions/update-modal";
import { selectLoginAccount } from "modules/auth/selectors/login-account";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { TransactionsBox } from "modules/account/components/transactions/transactions-box";
import {
  NETWORK_IDS,
  MODAL_WITHDRAW,
  MODAL_REP_FAUCET,
  MODAL_DEPOSIT,
  MODAL_TRANSACTIONS
} from "modules/common-elements/constants";
// made state an ANY for now.
const mapStateToProps = (state: any) => {
  const loginAccount = selectLoginAccount(state);

  return {
    isMainnet: state.connection.augurNodeNetworkId === NETWORK_IDS.Mainnet,
    eth: loginAccount.eth,
    rep: loginAccount.rep,
    gasPrice: getGasPrice(state)
  };
};

const mapDispatchToProps = (dispatch: Function) => ({
  repFaucet: () => dispatch(updateModal({ type: MODAL_REP_FAUCET })),
  deposit: () => dispatch(updateModal({ type: MODAL_DEPOSIT })),
  withdraw: () => dispatch(updateModal({ type: MODAL_WITHDRAW })),
  transactions: () => dispatch(updateModal({ type: MODAL_TRANSACTIONS }))
});

const TransactionsBoxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionsBox);

export default TransactionsBoxContainer;
