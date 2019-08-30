import logError from "utils/log-error";
import { LoginAccount } from "modules/types";
import { augurSdk } from "services/augursdk";
import { JsonRpcProvider } from "ethers/providers";
import { listenForStartUpEvents } from "modules/events/actions/listen-to-updates";

export function updateSdk(loginAccount: LoginAccount, networkId: string, injectedProvider: JsonRpcProvider | null) {
  return async (dispatch) => {
    const { address, meta }  = loginAccount;
    if (!meta || !address) return;

    if (!augurSdk.sdk) return;

    try {
      const Augur = augurSdk.get();
      Augur.syncUserData(address);
    } catch (error) {
      logError(error);
    }
  };
}
