import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Transactions } from "modules/modal/transactions";
import { AppState } from "appStore";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { augurSdk } from "services/augursdk";
import { Getters } from "@augurproject/sdk";
import { Action } from "redux";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = (state: AppState) => {
  const { modal, blockchain: { currentAugurTimestamp: now }} = AppStatus.get();
  return ({
    modal,
    now,
    account: state.loginAccount.address,
    universe: state.universe.id,
  });
}
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
    cb: Function,
  ) => {
    const Augur = augurSdk.get();
    const result = await Augur.getAccountTransactionHistory({
        universe: sP.universe,
        account: sP.account,
        coin: coin as Getters.Accounts.Coin,
        action: action as Getters.Accounts.Action,
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
