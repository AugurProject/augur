import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { submitNewMarket } from 'modules/markets/actions/submit-new-market';
import { updateNewMarket } from 'modules/markets/actions/update-new-market';
import SavedDrafts from 'modules/create-market/saved-drafts';
import getValue from 'utils/get-value';
import {
  addDraft,
  updateDraft,
  removeDraft,
} from 'modules/create-market/actions/update-drafts';
import { NewMarket } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import { ZERO, ONE } from 'modules/common/constants';

const mapStateToProps = state => ({
  drafts: state.drafts,
  currentTimestamp: getValue(state, 'blockchain.currentAugurTimestamp'),
  address: getValue(state, 'loginAccount.address'),
});

const mapDispatchToProps = dispatch => ({
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
  addDraft: (key, data) => dispatch(addDraft(key, data)),
  updateDraft: (key, data) => dispatch(updateDraft(key, data)),
  removeDraft: key => dispatch(removeDraft(key)),
});

const SavedDraftsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SavedDrafts)
);

export default SavedDraftsContainer;
