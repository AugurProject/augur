import { connect } from 'react-redux';
import { submitNewMarket } from 'modules/create-market/actions/submit-new-market';
import {
  addValidationToNewMarket,
  removeValidationFromNewMarket,
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket,
  clearNewMarket
} from 'modules/create-market/actions/update-new-market';
import CreateMarketView from 'modules/create-market/components/create-market-view';

const mapStateToProps = state => ({
  newMarket: state.newMarket
});

const mapDispatchToProps = dispatch => ({
  addValidationToNewMarket: data => dispatch(addValidationToNewMarket(data)),
  removeValidationFromNewMarket: data => dispatch(removeValidationFromNewMarket(data)),
  addOrderToNewMarket: data => dispatch(addOrderToNewMarket(data)),
  removeOrderFromNewMarket: data => dispatch(removeOrderFromNewMarket(data)),
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
  submitNewMarket: data => dispatch(submitNewMarket(data))
});

const CreateMarket = connect(mapStateToProps, mapDispatchToProps)(CreateMarketView);

export default CreateMarket;
