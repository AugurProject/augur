import { augurSdk } from "services/augursdk";
import { updateBlockchain } from "modules/app/actions/update-blockchain";
import { updateAssets } from "modules/auth/actions/update-assets";
import { createBigNumber } from "utils/create-big-number";
import { loadGasPriceInfo } from "modules/app/actions/load-gas-price-info";
import { getNetworkId, getTimestamp, getCurrentBlock } from "modules/contracts/actions/contractCalls";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const GET_GAS_BLOCK_LIMIT = 100;
const MAINNET_ID = 1;

export const syncBlockchain = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  const networkId = getNetworkId();
  const { gasPriceInfo } = getState();
  const currentBlockNumber = getCurrentBlock();
  const currentAugurTimestamp = getTimestamp();
  const augur = augurSdk.get();

  dispatch(
      updateBlockchain({
        currentBlockNumber,
        currentAugurTimestamp,
      }));

  const BNblockNumber = createBigNumber(currentBlockNumber);
  const BNGasBlockNumberLimit = createBigNumber(
      gasPriceInfo.blockNumber || "0",
    ).plus(GET_GAS_BLOCK_LIMIT);

  if (
      (!gasPriceInfo.blockNumber || BNblockNumber.gte(BNGasBlockNumberLimit)) &&
      networkId === MAINNET_ID
    ) {
      dispatch(loadGasPriceInfo());
    }

  const { highestAvailableBlockNumber, lastSyncedBlockNumber } = await augur.getSyncData();
  dispatch(
    updateBlockchain({
      highestBlock: highestAvailableBlockNumber,
      lastProcessedBlock: lastSyncedBlockNumber,
    }),
  );

  dispatch(updateAssets());
};
