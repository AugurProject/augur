import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { createBigNumber } from "utils/create-big-number";
import { formatGasCost } from "utils/format-number";
import { updateGasPriceInfo } from "modules/app/actions/update-gas-price-info";

const GAS_PRICE_API_ENDPOINT = "https://ethgasstation.info/json/ethgasAPI.json";
const GWEI_CONVERSION = 1000000000;
const MAINNET_ID = "102"; // "1";

export function loadGasPriceInfo(callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState();
    if (!loginAccount.address) return callback(null);
    const networkId = augur.rpc.getNetworkID();
    if (augur.getGasPrice) {
      augur.getGasPrice(gasPrice =>
        getGasPriceRanges(networkId, gasPrice, result => {
          dispatch(updateGasPriceInfo(result));
        })
      );
    } else {
      const gasPrice = augur.rpc.getGasPrice();
      return getGasPriceRanges(networkId, gasPrice, result => {
        dispatch(updateGasPriceInfo(result));
      });
    }
  };
}

function getGasPriceRanges(networkId, gasPrice, callback) {
  const defaultGasPrice = setDefaultGasInfo(gasPrice);
  if (networkId === MAINNET_ID) {
    getGasPriceValues(defaultGasPrice, result => callback(result));
  } else {
    // no gas api for testnets
    return callback(defaultGasPrice);
  }
}

function getGasPriceValues(defaultGasPrice, callback) {
  fetch(GAS_PRICE_API_ENDPOINT)
    .then(
      res => res.json()
      // values are off, need to divide by 10
      // {"average": 112.0, "fastestWait": 0.6, "fastWait": 0.7, "fast": 160.0, "safeLowWait": 1.0, "blockNum": 6416833, "avgWait": 1.0, "block_time": 15.785714285714286, "speed": 0.8870789882818058, "fastest": 520.0, "safeLow": 112.0}
    )
    .then(json => {
      const average = json.average
        ? formatGasCost(json.average / 10).value
        : defaultGasPrice.average;
      const fast = json.fast ? formatGasCost(json.fast / 10).value : 0;
      const safeLow = json.safeLow ? formatGasCost(json.safeLow / 10).value : 0;
      callback({
        average,
        fast,
        safeLow
      });
    })
    .catch(() =>
      callback({
        average: defaultGasPrice.average,
        fast: 0,
        safeLow: 0
      })
    );
}

function setDefaultGasInfo(gasPrice) {
  const inGwei = createBigNumber(gasPrice).dividedBy(
    createBigNumber(GWEI_CONVERSION)
  );
  const highValue = formatGasCost(inGwei.times("1.1")).value;
  const lowValue = formatGasCost(inGwei.times("0.9")).value;
  const gasPriceValue = formatGasCost(inGwei).value;

  return {
    average: gasPriceValue,
    fast: highValue,
    safeLow: lowValue
  };
}
