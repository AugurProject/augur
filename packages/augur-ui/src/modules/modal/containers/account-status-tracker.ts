import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AccountStatusTracker } from 'modules/modal/common';
import { WALLET_STATUS_VALUES } from 'modules/common/constants';

const mapStateToProps = (state: AppState) => {
  const { loginAccount, appStatus } = state;
  const balances = loginAccount.balances;
  const { walletStatus } = appStatus;

  let accountStatusTracker = 1;

  if (walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE) {
    accountStatusTracker = 2;
  }
  else if (walletStatus === WALLET_STATUS_VALUES.CREATED) {
    accountStatusTracker = 3;
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
