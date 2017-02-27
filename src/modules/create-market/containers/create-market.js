import { connect } from 'react-redux';
import { addValidationToNewMarket, removeValidationFromNewMarket, updateNewMarket } from 'modules/create-market/actions/update-new-market';
import CreateMarketView from 'modules/create-market/components/create-market-view';

const mapStateToProps = state => ({
  newMarket: state.newMarket
});

const mapDispatchToProps = dispatch => ({
  addValidationToNewMarket: data => dispatch(addValidationToNewMarket(data)),
  removeValidationFromNewMarket: data => dispatch(removeValidationFromNewMarket(data)),
  updateNewMarket: data => dispatch(updateNewMarket(data)),

});

const CreateMarket = connect(mapStateToProps, mapDispatchToProps)(CreateMarketView);

export default CreateMarket;
