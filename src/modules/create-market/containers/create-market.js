import { connect } from 'react-redux';
import { updateNewMarket } from 'modules/create-market/actions/update-new-market';
import CreateMarketView from 'modules/create-market/components/create-market-view';

const mapStateToProps = state => ({
  newMarket: state.newMarket,
  scalarMarketsShareDenomination: state.scalarMarketsShareDenomination
});

const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data))
});

const CreateMarket = connect(mapStateToProps, mapDispatchToProps)(CreateMarketView);

export default CreateMarket;
