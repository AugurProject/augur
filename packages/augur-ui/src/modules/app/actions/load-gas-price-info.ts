import logError from 'utils/log-error';
import { createBigNumber } from 'utils/create-big-number';
import { formatGasCost } from 'utils/format-number';
import { updateGasPriceInfo } from 'modules/app/actions/update-gas-price-info';
import { getGasPrice, getNetworkId } from 'modules/contracts/actions/contractCalls';
import { AppState } from 'store';
import { DataCallback, NodeStyleCallback } from 'modules/types';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { GWEI_CONVERSION, NETWORK_IDS, GAS_PRICE_API_ENDPOINT } from 'modules/common/constants';
import { augurSdk } from 'services/augursdk';


export function loadGasPriceInfo(callback: NodeStyleCallback = logError): ThunkAction<any, any, any, any> {
  return (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
    const { loginAccount } = getState();
    if (!loginAccount.address) return callback(null);
    const networkId = getNetworkId();

    if (networkId === NETWORK_IDS.Mainnet || networkId === NETWORK_IDS.Kovan) {
      getGasPriceRanges((result) => {
        dispatch(
          updateGasPriceInfo({
            ...result,
          })
        );
      });
    }
  };
}

async function getGasPriceRanges(callback: DataCallback) {
  const defaultGasPrice = setDefaultGasInfo();

  try {
    const relayerGasStation = await augurSdk.sdk.gnosis.gasStation();
    const relayerGasStationResults = {
      average: formatGasCost(
        createBigNumber(relayerGasStation.standard).dividedBy(
          createBigNumber(GWEI_CONVERSION)
        ),
        {}
      ).value,
      fast: formatGasCost(
        createBigNumber(relayerGasStation.fast).dividedBy(
          createBigNumber(GWEI_CONVERSION)
        ),
        {}
      ).value,
      safeLow: formatGasCost(
        createBigNumber(relayerGasStation.safeLow).dividedBy(
          createBigNumber(GWEI_CONVERSION)
        ),
        {}
      ).value,
    };
    callback(relayerGasStationResults);
  } catch (error) {
    console.error("Couldn't get gas: Using fallback", error);

    getGasPriceValues(defaultGasPrice, async (result) => {
      callback(result);
    });
  }
}

function getGasPriceValues(defaultGasPrice: any, callback: DataCallback) {
  fetch(GAS_PRICE_API_ENDPOINT)
    .then(
      res => res.json()
      // values are off, need to divide by 10
      // {"average": 112.0, "fastestWait": 0.6, "fastWait": 0.7, "fast": 160.0, "safeLowWait": 1.0, "blockNum": 6416833, "avgWait": 1.0, "block_time": 15.785714285714286, "speed": 0.8870789882818058, "fastest": 520.0, "safeLow": 112.0}
    )
    .then(json => {
      const average = json.average
        ? formatGasCost(json.average / 10, {}).value
        : defaultGasPrice.average;
      const fast = json.fast ? formatGasCost(json.fast / 10, {}).value : 0;
      const safeLow = json.safeLow ? formatGasCost(json.safeLow / 10, {}).value : 0;
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

async function setDefaultGasInfo() {
  const gasPrice = await getGasPrice();
  const inGwei = gasPrice.dividedBy(createBigNumber(GWEI_CONVERSION));
  const gasPriceValue = formatGasCost(inGwei, {}).value;

  return {
    average: gasPriceValue,
    fast: gasPriceValue,
    safeLow: gasPriceValue
  };
}
