import { augur } from "services/augurjs";
import { updateBlockchain } from "modules/app/actions/update-blockchain";
import { updateAssets } from "modules/auth/actions/update-assets";
import { createBigNumber } from "utils/create-big-number";
import { loadGasPriceInfo } from "modules/app/actions/load-gas-price-info";
import {
  getTimestamp,
  getCurrentBlock
} from "modules/contracts/actions/contractCalls";

const GET_GAS_BLOCK_LIMIT = 100;
const MAINNET_ID = "1";

export const syncBlockchain = cb => async (dispatch, getState) => {
  const networkId = augur.rpc.getNetworkID();
  const { gasPriceInfo } = getState();
  // const blockNumber = parseInt(augur.rpc.getCurrentBlock().number, 16);
  const augurTimestamp = await getTimestamp();
  const blockNumber = await getCurrentBlock();
  dispatch(
    updateBlockchain({
      currentBlockNumber: blockNumber,
      currentAugurTimestamp: parseInt(augurTimestamp, 10)
    })
  );
  const BNblockNumber = createBigNumber(blockNumber);
  const BNGasBlockNumberLimit = createBigNumber(
    gasPriceInfo.blockNumber || "0"
  ).plus(GET_GAS_BLOCK_LIMIT);

  if (
    (!gasPriceInfo.blockNumber || BNblockNumber.gte(BNGasBlockNumberLimit)) &&
    networkId === MAINNET_ID
  ) {
    dispatch(loadGasPriceInfo());
  }

  cb && cb();

  augur.augurNode.getSyncData((err, res) => {
    if (!err && res) {
      dispatch(
        updateBlockchain({
          highestBlock: res.highestBlock.number,
          lastProcessedBlock: res.lastProcessedBlock.number
        })
      );
    }
  });

  dispatch(updateAssets());
};
