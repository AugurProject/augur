import logError from "utils/log-error";
import { LoginAccount } from "modules/types";
import { augurSdk } from "services/augursdk";
import { JsonRpcProvider } from "ethers/providers";

export function updateSdk(loginAccount: LoginAccount, injectedProvider: JsonRpcProvider | null) {
  return async () => {
    const { address, meta }  = loginAccount;
    if (!meta || !address) return;

    if (!augurSdk.sdk) return;

    let { provider } = augurSdk.sdk.dependencies;

    if (injectedProvider) {
      provider = injectedProvider;
    }

    try {
      await augurSdk.destroy();
      await augurSdk.makeApi(
        provider,
        address,
        meta.signer,
        meta.isWeb3
      );
    } catch (error) {
      logError(error);
    }
  };
}
