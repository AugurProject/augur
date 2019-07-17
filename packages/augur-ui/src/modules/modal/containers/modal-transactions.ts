import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Transactions } from "modules/modal/transactions";
import { AppState } from "store";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { NodeStyleCallback } from "modules/types";
import { augurSdk } from "services/augursdk";
import { Coin, Action } from "@augurproject/sdk/src/state/getter/Accounts";

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
  getTransactionsHistory: async (
    startTime: number,
    endTime: number,
    coin: string,
    action: string,
    cb: NodeStyleCallback,
  ) => {
    const Augur = augurSdk.get();
    const result = await Augur.getAccountTransactionHistory({
        universe: sP.universe,
        account: sP.account,
        coin: coin as Coin,
        action: action as Action,
        earliestTransactionTime: startTime,
        latestTransactionTime: endTime,
      });
      // TODO: verify this when working on account summary
      cb(result);
  },
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Transactions),
);
