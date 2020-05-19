import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket,
  clearNewMarket,
} from 'modules/markets/actions/update-new-market';
import FeesLiquidity from 'modules/create-market/fees-liquidity';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = state => {
  const {
    newMarket,
    loginAccount: { address },
    blockchain: { currentAugurTimestamp: currentTimestamp },
  } = AppStatus.get();
  return {
    newMarket,
    currentTimestamp,
    address,
  };
};

const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
  addOrderToNewMarket: data => dispatch(addOrderToNewMarket(data)),
  removeOrderFromNewMarket: data => dispatch(removeOrderFromNewMarket(data)),
});

const FeesLiquidityContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FeesLiquidity)
);

export default FeesLiquidityContainer;
