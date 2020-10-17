import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import StakingPool from "modules/account/components/staking-pool";

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({

});

const StakingPoolContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(StakingPool),
);

export default StakingPoolContainer;
