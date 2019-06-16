import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Transactions } from "modules/modal/transactions";
import { augur } from "services/augurjs";
import { AppState } from "store";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  now: state.blockchain.currentAugurTimestamp,
  account: state.loginAccount.address,
  universe: state.universe.id,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
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
    cb: NodeStyleCallback,
  ) => {
    augur.augurNode.submitRequest(
      "getAccountTransactionHistory",
      {
        universe: sP.universe,
        account: sP.account,
        coin,
        action,
        earliestTransactionTime: startTime,
        latestTransactionTime: endTime,
      },
      // @ts-ignore
      cb,
    );
  },
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Transactions),
);
