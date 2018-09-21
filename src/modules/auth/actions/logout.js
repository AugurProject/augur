import { augur } from "services/augurjs";
import { clearLoginAccount } from "modules/auth/actions/update-login-account";
import { clearOrphanedOrderData } from "modules/orders/actions/orphaned-orders";

export function logout() {
  return (dispatch, getState) => {
    const localStorageRef =
      typeof window !== "undefined" && window.localStorage;
    augur.rpc.clear();
    if (localStorageRef && localStorageRef.removeItem) {
      localStorageRef.removeItem("airbitz.current_user");
      localStorageRef.removeItem("airbitz.users");
    }
    dispatch(clearOrphanedOrderData());
    dispatch(clearLoginAccount());
  };
}
