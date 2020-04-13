import { connect } from 'react-redux';
import ConnectDropdown from 'modules/auth/components/connect-dropdown/connect-dropdown';
import { logout } from 'modules/auth/actions/logout';
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_GAS_PRICE, GAS_SPEED_LABELS, GAS_TIME_LEFT_LABELS, MODAL_ADD_FUNDS, MODAL_UNIVERSE_SELECTOR } from 'modules/common/constants';
import { NULL_ADDRESS } from '@augurproject/sdk/src/state/getter/types';
import { FormattedNumber } from 'modules/types';
import { DESIRED_SIGNER_ETH_BALANCE } from 'contract-dependencies-gsn/src/ContractDependenciesGSN';
import { formatAttoEth, formatEther } from 'utils/format-number';
import { AppState } from 'appStore';
import { createBigNumber } from 'utils/create-big-number';

const mapStateToProps = (state: AppState) => {
  const { fast, average, safeLow, userDefinedGasPrice } = state.gasPriceInfo;
  const { loginAccount } = state;
  const { balances } = loginAccount;
  const ethNonSafeBN = createBigNumber(balances.ethNonSafe);
  const userDefined = userDefinedGasPrice || average || 0;
  let gasPriceSpeed = GAS_SPEED_LABELS.STANDARD;
  let gasPriceTime = GAS_TIME_LEFT_LABELS.STANDARD
  if (userDefined >=  fast && fast !== 0) {
    gasPriceSpeed = GAS_SPEED_LABELS.FAST;
    gasPriceTime = GAS_TIME_LEFT_LABELS.FAST;
  } else if (userDefined < average && userDefined >= safeLow && safeLow !== 0) {
    gasPriceSpeed = GAS_SPEED_LABELS.SLOW;
    gasPriceTime = GAS_TIME_LEFT_LABELS.SAFELOW;
  } else if (userDefined < safeLow && safeLow !== 0) {
    gasPriceTime = GAS_TIME_LEFT_LABELS.SLOW;
    gasPriceSpeed = GAS_SPEED_LABELS.SLOW;
  }

  let desiredSignerEthBalance = createBigNumber(formatAttoEth(Number(DESIRED_SIGNER_ETH_BALANCE)).value);
  if (ethNonSafeBN.lt(desiredSignerEthBalance)) desiredSignerEthBalance = ethNonSafeBN;
  const reserveEthAmount: FormattedNumber = formatEther(desiredSignerEthBalance, {
    zeroStyled: false,
    decimalsRounded: 4,
  });

  return {
    universeOutcomeName: state.universe.outcomeName ? state.universe.outcomeName : null,
    parentUniverseId: state.universe.parentUniverseId !== NULL_ADDRESS ? state.universe.parentUniverseId : null,
    universeHasChildren: !!state.universe.forkingInfo,
    loginAccountAddress: state.loginAccount.address,
    averageGasPrice: average,
    userDefinedGasPrice: userDefined,
    gasPriceSpeed,
    gasPriceTime,
    isLogged: state.authStatus.isLogged,
    restoredAccount: state.authStatus.restoredAccount,
    accountMeta:
      state.loginAccount &&
      state.loginAccount.meta,
    balances: state.loginAccount && state.loginAccount.balances,
    GsnEnabled: state.appStatus.gsnEnabled,
    ethToDaiRate: state.appStatus.ethToDaiRate,
    reserveEthAmount,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  gasModal: () => dispatch(updateModal({ type: MODAL_GAS_PRICE })),
  universeSelectorModal: () => dispatch(updateModal({ type: MODAL_UNIVERSE_SELECTOR })),
  showAddFundsModal: () => dispatch(updateModal({ type: MODAL_ADD_FUNDS })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectDropdown);
