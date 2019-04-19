import { augur } from "services/augurjs";
import { updateBlockchain } from "modules/app/actions/update-blockchain";
import { updateAssets } from "modules/auth/actions/update-assets";
import { createBigNumber } from "utils/create-big-number";
import { loadGasPriceInfo } from "modules/app/actions/load-gas-price-info";
import debounce from "utils/debounce";

const GET_GAS_BLOCK_LIMIT = 100;
const MAINNET_ID = "1";
const EST_BLOCK_TIME = 1000 * 5;

export const syncBlockchain = cb => (dispatch, getState) => {
  const networkId = augur.rpc.getNetworkID();
  const { gasPriceInfo } = getState();
  const blockNumber = parseInt(augur.rpc.getCurrentBlock().number, 16);
  augur.api.Controller.getTimestamp((err, augurTimestamp) => {
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

  debounce(
    augur.augurNode.getSyncData((err, res) => {
      if (!err && res) {
        dispatch(
          updateBlockchain({
            highestBlock: res.highestBlock.number,
            lastProcessedBlock: res.lastProcessedBlock.number
          })
        );
      }
    }),
    EST_BLOCK_TIME
  );
  dispatch(updateAssets());
};
