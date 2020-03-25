import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  updateNewMarket,
  clearNewMarket
} from "modules/markets/actions/update-new-market";
import { SubCategories } from "modules/create-market/components/sub-categories";
import { AppState } from "appStore";

const mapStateToProps = (state: AppState) => ({
  categoryStats: state.categoryStats,
  newMarket: state.newMarket,
  currentTimestamp: state.blockchain.currentAugurTimestamp,
  address: state.loginAccount.address,
});

const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
});

const SubCategoriesContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubCategories)
);

export default SubCategoriesContainer;
