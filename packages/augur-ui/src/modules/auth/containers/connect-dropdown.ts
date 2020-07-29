import { connect } from 'react-redux';
import ConnectDropdown from 'modules/auth/components/connect-dropdown/connect-dropdown';
import { logout } from 'modules/auth/actions/logout';
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_GAS_PRICE, GAS_SPEED_LABELS, GAS_TIME_LEFT_LABELS, MODAL_ADD_FUNDS, MODAL_UNIVERSE_SELECTOR, FIVE, ONE } from 'modules/common/constants';
import { NULL_ADDRESS } from 'modules/common/constants';
import { FormattedNumber } from 'modules/types';
import { AppState } from 'appStore';
import { createBigNumber } from 'utils/create-big-number';

const mapStateToProps = (state: AppState) => {
  const { fast, average, safeLow, userDefinedGasPrice } = state.gasPriceInfo;
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
    ethToDaiRate: state.appStatus.ethToDaiRate,
    showTransferMyDai: createBigNumber(state.loginAccount.balances.signerBalances.dai).gte(FIVE),
    showTransferMyRep: createBigNumber(state.loginAccount.balances.signerBalances.rep).gte(ONE),
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
