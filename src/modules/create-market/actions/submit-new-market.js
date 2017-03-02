import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';
import { CATEGORICAL_OUTCOMES_SEPARATOR, CATEGORICAL_OUTCOME_SEPARATOR } from 'modules/markets/constants/market-outcomes';
import { augur } from 'services/augurjs';
import { selectTransactionsLink } from 'modules/link/selectors/links';
import { clearNewMarket } from 'modules/create-market/actions/update-new-market';

export function submitNewMarket(newMarket) {
  console.log('submitNewMarket -- ', newMarket);

  return (dispatch, getState) => {
    const { branch } = getState();

    dispatch(clearNewMarket());
    selectTransactionsLink(dispatch).onClick();

    // General Properties
    const formattedNewMarket = {
      branch: branch.id,
      description: newMarket.description,
      expDate: newMarket.endDate.timestamp / 1000,
      resolution: newMarket.expirySource,
      takerFee: newMarket.takerFee / 100,
      makerFee: newMarket.makerFee / 100,
      extraInfo: newMarket.detailsText,
      tags: [
        newMarket.topic,
        ...(newMarket.keywords || [])
      ]
    };

    // Market Type Specific Properties
    switch (newMarket.type) {
      case CATEGORICAL:
        formattedNewMarket.minValue = 1;
        formattedNewMarket.maxValue = newMarket.outcomes.length;
        formattedNewMarket.numOutcomes = newMarket.outcomes.length;
        formattedNewMarket.description = newMarket.description + CATEGORICAL_OUTCOMES_SEPARATOR + newMarket.outcomes.map(outcome => outcome).join(CATEGORICAL_OUTCOME_SEPARATOR);
        break;
      case SCALAR:
        formattedNewMarket.minValue = newMarket.scalarSmallNum;
        formattedNewMarket.maxValue = newMarket.scalarBigNum;
        formattedNewMarket.numOutcomes = 2;
        break;
      case BINARY:
      default:
        formattedNewMarket.minValue = 1;
        formattedNewMarket.maxValue = 2;
        formattedNewMarket.numOutcomes = 2;
    }

    console.log('creating market -- ', formattedNewMarket);
    augur.createSingleEventMarket({
      ...formattedNewMarket,
      onSent: res => console.log('createSingleEventMarket sent:', res),
      onSuccess: (res) => {
        console.log('createSingleEventMarket success:', res);
        if (Object.keys(newMarket.orderBook).length) {
          console.log('Need to also submit orders');
        }
      },
      onFailed: err => console.error('ERROR createSingleEventMarket failed:', err)
    });
    // console.log('creating market:', newMarket);``
    // augur.createSingleEventMarket({
    //   branch: branch.id,
    //   description: newMarket.formattedDescription,
    //   expDate: newMarket.endDate.value.getTime() / 1000,
    //   minValue: newMarket.minValue,
    //   maxValue: newMarket.maxValue,
    //   numOutcomes: newMarket.numOutcomes,
    //   resolution: newMarket.expirySource,
    //   takerFee: newMarket.takerFee / 100,
    //   tags: newMarket.tags,
    //   makerFee: newMarket.makerFee / 100,
    //   extraInfo: newMarket.detailsText,
    //   onSent: res => console.log('createSingleEventMarket sent:', res),
    //   onSuccess: (res) => {
    //     console.log('createSingleEventMarket success:', res);
    //     dispatch(clearMakeInProgress());
    //     if (newMarket.isCreatingOrderBook) {
    //       dispatch(submitGenerateOrderBook({
    //         ...newMarket,
    //         id: res.callReturn,
    //         tx: res
    //       }));
    //     }
    //   },
    //   onFailed: err => console.error('createSingleEventMarket failed:', err)
    // });
  };
}
