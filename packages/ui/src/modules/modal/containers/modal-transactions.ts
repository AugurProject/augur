import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Transactions } from "modules/modal/transactions";
import { augur } from "services/augurjs";

import { closeModal } from "modules/modal/actions/close-modal";

const mapStateToProps = (state: any) => ({
  modal: state.modal,
  now: state.blockchain.currentAugurTimestamp,
  account: state.loginAccount.address,
  universe: state.universe.id
});

const mapDispatchToProps = (dispatch: Function) => ({
  closeModal: () => dispatch(closeModal())
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "Transactions History",
  closeAction: () => dP.closeModal(),
  currentTimestamp: sP.now,
  getTransactionsHistory: (
    startTime: number,
    endTime: number,
    coin: string,
    action: string,
    cb: Function
  ) => {
    augur.augurNode.submitRequest(
      "getAccountTransactionHistory",
      {
        universe: sP.universe,
        account: sP.account,
        coin,
        action,
        earliestTransactionTime: startTime,
        latestTransactionTime: endTime
      },
      cb
    );
  }
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Transactions)
);
