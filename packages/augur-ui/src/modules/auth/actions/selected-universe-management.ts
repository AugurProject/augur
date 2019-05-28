import { windowRef } from "utils/window-ref";
import { augur } from "services/augurjs";
import { getNetworkId } from "modules/contracts/actions/contractCalls";

export const setSelectedUniverse = (selectedUniverseId: string) => (
  dispatch: Function,
  getState: Function
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
