import { windowRef } from "utils/window-ref";
import { getNetworkId } from "modules/contracts/actions/contractCalls";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "appStore";
import { WindowApp } from "modules/types";
import { augurSdk } from "services/augursdk";

export const setSelectedUniverse = (selectedUniverseId: string | null = null) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, env, connection } = getState();
  const { address } = loginAccount;
  const networkId = getNetworkId();
  const Augur = augurSdk.get();
  const defaultUniverseId =
    env.universe ||
    Augur.contracts.universe.address;
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
