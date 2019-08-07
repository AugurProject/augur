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

    let { provider } = augurSdk.sdk.dependencies;

    if (injectedProvider) {
      provider = injectedProvider;
    }

    try {
      const env = augurSdk.env;
      await augurSdk.destroy();
      await augurSdk.makeApi(
        provider,
        address,
        meta.signer,
        env,
        networkId,
        meta.isWeb3
      );
      const Augur = augurSdk.get();
      // wire up start up events for sdk
      dispatch(listenForStartUpEvents(Augur));
    } catch (error) {
      logError(error);
    }
  };
}
