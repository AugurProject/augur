
import { clearLoginAccount } from "modules/account/actions/login-account";
import { clearUserTx } from "modules/contracts/actions/contractCalls";

export function logout() {
  return (dispatch: Function) => {
    const localStorageRef =
      typeof window !== "undefined" && window.localStorage;
    clearUserTx();
    if (localStorageRef && localStorageRef.removeItem) {
      localStorageRef.removeItem("airbitz.current_user");
      localStorageRef.removeItem("airbitz.users");
      localStorageRef.removeItem("loggedInAccount");
    }
    dispatch(clearLoginAccount());
  };
}
