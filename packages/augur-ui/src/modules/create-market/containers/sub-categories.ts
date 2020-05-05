import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  updateNewMarket,
  clearNewMarket,
} from 'modules/markets/actions/update-new-market';
import { SubCategories } from 'modules/create-market/components/sub-categories';
import { AppState } from 'appStore';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const {
    categoryStats,
    blockchain: { currentAugurTimestamp: currentTimestamp },
  } = AppStatus.get();
  return {
    categoryStats,
    newMarket: state.newMarket,
    currentTimestamp,
    address: state.loginAccount.address,
  };
};
const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
});

const SubCategoriesContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SubCategories)
);

export default SubCategoriesContainer;
