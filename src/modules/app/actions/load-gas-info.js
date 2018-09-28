import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { createBigNumber } from "utils/create-big-number";
import { formatGasCost } from "utils/format-number";
import { updateGasInfo } from "modules/app/actions/update-gas-info";

const GWEI_CONVERSION = 1000000000;
const MAINNET_ID = 1;

export function loadGasInfo(callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount, networkId } = getState();
    if (!loginAccount.address) return callback(null);
    // todo: use augur.getGasPrice(callback) function
    if (augur.getGasPrice) {
      augur.getGasPrice(gasPrice =>
        getGasPriceRanges(networkId, gasPrice, result => {
          dispatch(updateGasInfo(result));
        })
      );
    } else {
      const gasPrice = augur.rpc.getGasPrice();
      return getGasPriceRanges(networkId, gasPrice, result => {
        dispatch(updateGasInfo(result));
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
  fetch("https://ethgasstation.info/json/ethgasAPI.json")
    .then(res => {
      // values are off, need to divide by 10
      // {"average": 112.0, "fastestWait": 0.6, "fastWait": 0.7, "fast": 160.0, "safeLowWait": 1.0, "blockNum": 6416833, "avgWait": 1.0, "block_time": 15.785714285714286, "speed": 0.8870789882818058, "fastest": 520.0, "safeLow": 112.0}
      const json = res.json();
      const average = json.average
        ? (json.average / 10).toString()
        : defaultGasPrice.average;
      const fast = json.fast ? (json.fast / 10).toString() : "0";
      const safeLow = json.safeLow ? (json.safeLow / 10).toString() : "0";
      callback({
        average,
        fast,
        safeLow
      });
    })
    .catch(() =>
      callback({
        average: defaultGasPrice.average,
        fast: "0",
        safeLow: "0"
      })
    );
}

function setDefaultGasInfo(gasPrice) {
  const inGwei = createBigNumber(gasPrice).dividedBy(
    createBigNumber(GWEI_CONVERSION)
  );
  const highValue = formatGasCost(inGwei.times("1.1")).rounded;
  const lowValue = formatGasCost(inGwei.times("0.9")).rounded;
  const gasPriceValue = formatGasCost(inGwei).rounded;
  return {
    average: gasPriceValue,
    fast: highValue,
    safeLow: lowValue
  };
}
