import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket,
} from 'modules/markets/actions/update-new-market';
import FormDetails from 'modules/create-market/components/form-details';
import getGasPrice from 'modules/auth/selectors/get-gas-price';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = state => {
  const {
    loginAccount: {
      address,
      meta,
      balances: { eth: availableEth, rep: availableRep },
    },
    universe,
    blockchain: { currentAugurTimestamp: currentTimestamp },
  } = AppStatus.get();
  return {
    universe,
    availableEth,
    availableRep,
    meta,
    newMarket: state.newMarket,
    categories: state.categories,
    gasPrice: getGasPrice(),
    address,
    currentTimestamp,
  };
};

const mapDispatchToProps = dispatch => ({
  addOrderToNewMarket: data => dispatch(addOrderToNewMarket(data)),
  removeOrderFromNewMarket: data => dispatch(removeOrderFromNewMarket(data)),
  updateNewMarket: data => dispatch(updateNewMarket(data)),
});

const FormDetailsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FormDetails)
);

export default FormDetailsContainer;
