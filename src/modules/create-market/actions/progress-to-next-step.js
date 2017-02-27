export const PROGRESS_TO_NEXT_STEP = 'PROGRESS_TO_NEXT_STEP';

import { updateNewMarket } from 'modules/create-market/actions/update-new-market';

import { newMarketCreationOrder } from 'modules/create-market/constants/new-market-creation-order';

export function progressToNextStep() {
  return (dispatch, getState) => {
    const { newMarket } = getState();

    dispatch(updateNewMarket({
      currentStep: newMarket.nextStep,
      nextStep: newMarket.nextStep < newMarketCreationOrder.length - 1 ?
        newMarket.nextStep + 1 :
        newMarket.nextStep
    }));
  };
}
