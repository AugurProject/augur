import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AccountStatusTracker } from 'modules/modal/common';
import { WALLET_STATUS_VALUES, ON_BORDING_STATUS_STEP } from 'modules/common/constants';

const mapStateToProps = (state: AppState) => {
  const { appStatus } = state;
  const { walletStatus } = appStatus;

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

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
});

const mergeProps = (sP: any, dP: any) => ({
  ...sP,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(AccountStatusTracker)
);
