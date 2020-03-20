import { augurSdk } from 'services/augursdk';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { updateGasPriceInfo } from 'modules/app/actions/update-gas-price-info';
import { GWEI_CONVERSION } from 'modules/common/constants';

export const registerUserDefinedGasPriceFunction = () => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  const Augur = augurSdk.get();
  const reccomendedGasPrice = createBigNumber(Augur.dependencies.gasPrice);

  dispatch(
    updateGasPriceInfo({
      userDefinedGasPrice: reccomendedGasPrice.dividedBy(GWEI_CONVERSION).toNumber(),
    })
  );
};
