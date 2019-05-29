import { windowRef } from "utils/window-ref";
import { augur } from "services/augurjs";
import { getNetworkId } from "modules/contracts/actions/contractCalls";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";

export const setSelectedUniverse = (selectedUniverseId: string) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, env, connection } = getState();
  const { address } = loginAccount;
  const { augurNodeNetworkId } = connection;
  const defaultUniverseId =
    env.universe ||
    augur.contracts.addresses[getNetworkId()].Universe;
  if (windowRef && windowRef.localStorage) {
    const { localStorage } = windowRef;
    const accountStorage = JSON.parse(localStorage.getItem(address));
    if (accountStorage) {
      localStorage.setItem(
        address,
        JSON.stringify({
          ...accountStorage,
          selectedUniverse: {
            ...accountStorage.selectedUniverse,
            [augurNodeNetworkId]: selectedUniverseId || defaultUniverseId
          }
        })
      );
    }
  }
};
