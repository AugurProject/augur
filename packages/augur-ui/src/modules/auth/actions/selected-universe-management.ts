import { windowRef } from "utils/window-ref";
import { augur } from "services/augurjs";
import { getNetworkId } from "modules/contracts/actions/contractCalls";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";
import { WindowApp } from "modules/types";

export const setSelectedUniverse = (selectedUniverseId: string | null = null) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, env, connection } = getState();
  const { address } = loginAccount;
  const networkId = getNetworkId();
  const defaultUniverseId =
    env.universe ||
    augur.contracts.addresses[getNetworkId()].Universe;
    const windowApp = windowRef as WindowApp;
  if (windowApp && windowApp.localStorage) {
    const { localStorage } = windowApp;
    const localAccount = localStorage.getItem(address) || "{}";
    const accountStorage = JSON.parse(localAccount);
    if (accountStorage) {
      localStorage.setItem(
        address,
        JSON.stringify({
          ...accountStorage,
          selectedUniverse: {
            ...accountStorage.selectedUniverse,
            [networkId]: selectedUniverseId || defaultUniverseId
          }
        })
      );
    }
  }
};
