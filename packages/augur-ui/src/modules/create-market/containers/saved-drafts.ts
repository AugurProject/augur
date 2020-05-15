import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { submitNewMarket } from 'modules/markets/actions/submit-new-market';
import { updateNewMarket } from 'modules/markets/actions/update-new-market';
import SavedDrafts from 'modules/create-market/saved-drafts';
import { NewMarket } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import { ZERO, ONE } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = state => {
  const {
    drafts,
  } = AppStatus.get();
  return {
    drafts,
  };
};

const mapDispatchToProps = dispatch => {
  const { addUpdateDraft, removeDraft } = AppStatus.actions;
  return ({
    updateNewMarket: (data: NewMarket) => {
      // convert strings to BigNumber for BigNumber fields
      data.initialLiquidityDai = data.initialLiquidityDai
        ? createBigNumber(data.initialLiquidityDai)
        : ZERO;
      data.initialLiquidityGas = data.initialLiquidityGas
        ? createBigNumber(data.initialLiquidityGas)
        : ZERO;
      data.maxPriceBigNumber = data.maxPriceBigNumber
        ? createBigNumber(data.maxPriceBigNumber)
        : ONE;
      data.minPriceBigNumber = data.minPriceBigNumber
        ? createBigNumber(data.minPriceBigNumber)
        : ZERO;
      dispatch(updateNewMarket(data));
    },
    submitNewMarket: (data, cb) => dispatch(submitNewMarket(data, cb)),
    addDraft: (key, data) => addUpdateDraft(key, data),
    updateDraft: (key, data) => addUpdateDraft(key, data),
    removeDraft: key => removeDraft(key),
  });
}
const SavedDraftsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SavedDrafts)
);

export default SavedDraftsContainer;
