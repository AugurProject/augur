import { augurSdk } from 'services/augursdk';
import { createBigNumber } from 'utils/create-big-number';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { updateGasPriceInfo } from 'modules/app/actions/update-gas-price-info';
import { GWEI_CONVERSION } from 'modules/common/constants';

export const registerUserDefinedGasPriceFunction = (
  userDefinedGasPrice: number,
  average: number
) => async (dispatch: ThunkDispatch<void, any, Action>) => {
  const Augur = augurSdk.get();
  const gasPrice = createBigNumber(GWEI_CONVERSION).multipliedBy(
    userDefinedGasPrice || 1
  );
  Augur.dependencies.setGasPrice(gasPrice);

  dispatch(
    updateGasPriceInfo({
      userDefinedGasPrice: userDefinedGasPrice ? userDefinedGasPrice : average,
    })
  );
};
