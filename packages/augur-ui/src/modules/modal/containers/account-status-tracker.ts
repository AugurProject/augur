import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { AccountStatusTracker } from 'modules/modal/common';
import { WALLET_STATUS_VALUES, ON_BORDING_STATUS_STEP } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { walletStatus } = AppStatus.get();
  let accountStatusTracker = ON_BORDING_STATUS_STEP.ONE;

  if (walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE) {
    accountStatusTracker = ON_BORDING_STATUS_STEP.TWO;
  }
  else if (walletStatus === WALLET_STATUS_VALUES.CREATED) {
    accountStatusTracker = ON_BORDING_STATUS_STEP.THREE;
  }

  return {
    accountStatusTracker,
  }
};

export default withRouter(
  connect(
    mapStateToProps,
  )(AccountStatusTracker)
);
