import { augur } from "services/augurjs";
import { updateBlockchain } from "modules/app/actions/update-blockchain";
import { updateAssets } from "modules/auth/actions/update-assets";
import { createBigNumber } from "utils/create-big-number";
import { loadGasPriceInfo } from "modules/app/actions/load-gas-price-info";

const GET_GAS_BLOCK_LIMIT = 100;
const MAINNET_ID = "1";

export const syncBlockchain = (cb: Function) => (
  dispatch: Function,
  getState: Function
) => {
  const networkId = augur.rpc.getNetworkID();
  const { gasPriceInfo } = getState();
  const blockNumber = parseInt(augur.rpc.getCurrentBlock().number, 16);
  augur.api.Controller.getTimestamp((err: any, augurTimestamp: any) => {
    if (err) console.error(err);
    dispatch(
      updateBlockchain({
        currentBlockNumber: blockNumber,
        currentBlockTimestamp: parseInt(
          augur.rpc.getCurrentBlock().timestamp,
          16
        ),
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
  });

  augur.augurNode.getSyncData((err: any, res: any) => {
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
