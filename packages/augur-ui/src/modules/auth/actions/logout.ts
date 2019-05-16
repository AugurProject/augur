import { clearLoginAccount } from "modules/auth/actions/update-login-account";
import { clearOrphanedOrderData } from "modules/orders/actions/orphaned-orders";
import { clearUserTx } from "modules/contracts/actions/contractCalls";

export function logout() {
  return (dispatch: Function, getState: Function) => {
    const localStorageRef =
      typeof window !== "undefined" && window.localStorage;
    clearUserTx();
    if (localStorageRef && localStorageRef.removeItem) {
      localStorageRef.removeItem("airbitz.current_user");
      localStorageRef.removeItem("airbitz.users");
      localStorageRef.removeItem("loggedInAccount");
    }
    dispatch(clearOrphanedOrderData());
    dispatch(clearLoginAccount());
  };
}
