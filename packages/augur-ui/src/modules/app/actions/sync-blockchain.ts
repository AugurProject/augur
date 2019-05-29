import { augur } from "services/augurjs";
import { updateBlockchain } from "modules/app/actions/update-blockchain";
import { updateAssets } from "modules/auth/actions/update-assets";
import { createBigNumber } from "utils/create-big-number";
import { loadGasPriceInfo } from "modules/app/actions/load-gas-price-info";
import { getNetworkId, getTimestamp, getCurrentBlock } from "modules/contracts/actions/contractCalls";

const GET_GAS_BLOCK_LIMIT = 100;
const MAINNET_ID = "1";

export const syncBlockchain = (cb: Function) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: Function,
) => {
  const networkId = getNetworkId();
  const { gasPriceInfo } = getState();
  const currentBlockNumber = getCurrentBlock();
  const currentAugurTimestamp = getTimestamp();

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

  cb && cb();

  augur.augurNode.getSyncData((err: any, res: any) => {
    if (!err && res) {
      dispatch(
        updateBlockchain({
          highestBlock: res.highestBlock.number,
          lastProcessedBlock: res.lastProcessedBlock.number,
        }),
      );
    }
  });

  dispatch(updateAssets());
};
