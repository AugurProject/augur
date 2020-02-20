import { connect } from 'react-redux';
import Confirm from 'modules/trading/components/confirm';
import { createBigNumber } from 'utils/create-big-number';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';
import { AppState } from 'appStore';
import { totalTradingBalance } from 'modules/auth/selectors/login-account';

const mapStateToProps = (state: AppState, ownProps) => {
  const { authStatus, loginAccount, appStatus, newMarket } = state;
  const {
    gnosisEnabled: Gnosis_ENABLED,
    ethToDaiRate,
    gnosisStatus,
  } = appStatus;

  const hasFunds = Gnosis_ENABLED
    ? !!loginAccount.balances.dai
    : !!loginAccount.balances.eth && !!loginAccount.balances.dai;

  let availableDai = totalTradingBalance(loginAccount)
  if (ownProps.initialLiquidity) {
    availableDai = availableDai.minus(newMarket.initialLiquidityDai);
  }
  return {
    gasPrice: getGasPrice(state),
    availableEth: createBigNumber(loginAccount.balances.eth),
    availableDai,
    hasFunds,
    isLogged: authStatus.isLogged,
    allowanceBigNumber: loginAccount.allowance,
    Gnosis_ENABLED,
    ethToDaiRate,
    gnosisStatus,
  };
};

const mergeProps = (sP, dP, oP) => {
  return {
    ...oP,
    ...sP,
  };
};

const ConfirmContainer = connect(
  mapStateToProps,
  mergeProps
)(Confirm);

export default ConfirmContainer;
