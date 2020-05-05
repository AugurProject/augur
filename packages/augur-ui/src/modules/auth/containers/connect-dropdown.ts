import { connect } from 'react-redux';
import ConnectDropdown from 'modules/auth/components/connect-dropdown/connect-dropdown';
import { logout } from 'modules/auth/actions/logout';
import {
  MODAL_GAS_PRICE,
  GAS_SPEED_LABELS,
  GAS_TIME_LEFT_LABELS,
  MODAL_ADD_FUNDS,
  MODAL_UNIVERSE_SELECTOR,
} from 'modules/common/constants';
import { NULL_ADDRESS } from '@augurproject/sdk/src/state/getter/types';
import { FormattedNumber } from 'modules/types';
import { AppState } from 'appStore';
import { getEthReserve } from 'modules/auth/selectors/get-eth-reserve';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const {
    universe: { parentUniverseId, outcomeName, forkingInfo },
    gasPriceInfo: { fast, average, safeLow, userDefinedGasPrice },
  } = AppStatus.get();

  const userDefined = userDefinedGasPrice || average || 0;
  let gasPriceSpeed = GAS_SPEED_LABELS.STANDARD;
  let gasPriceTime = GAS_TIME_LEFT_LABELS.STANDARD;
  if (userDefined >= fast && fast !== 0) {
    gasPriceSpeed = GAS_SPEED_LABELS.FAST;
    gasPriceTime = GAS_TIME_LEFT_LABELS.FAST;
  } else if (userDefined < average && userDefined >= safeLow && safeLow !== 0) {
    gasPriceSpeed = GAS_SPEED_LABELS.SLOW;
    gasPriceTime = GAS_TIME_LEFT_LABELS.SAFELOW;
  } else if (userDefined < safeLow && safeLow !== 0) {
    gasPriceTime = GAS_TIME_LEFT_LABELS.SLOW;
    gasPriceSpeed = GAS_SPEED_LABELS.SLOW;
  }

  const reserveEthAmount: FormattedNumber = getEthReserve(state);

  return {
    universeOutcomeName: outcomeName
      ? outcomeName
      : null,
    parentUniverseId:
      parentUniverseId !== NULL_ADDRESS
        ? parentUniverseId
        : null,
    universeHasChildren: !!forkingInfo,
    loginAccountAddress: state.loginAccount.address,
    averageGasPrice: average,
    userDefinedGasPrice: userDefined,
    gasPriceSpeed,
    gasPriceTime,
    accountMeta: state.loginAccount?.meta,
    balances: state.loginAccount?.balances,
    reserveEthAmount,
  };
};

const mapDispatchToProps = dispatch => {
  const { setModal } = AppStatus.actions;
  return {
    logout: () => dispatch(logout()),
    gasModal: () => setModal({ type: MODAL_GAS_PRICE }),
    universeSelectorModal: () => setModal({ type: MODAL_UNIVERSE_SELECTOR }),
    showAddFundsModal: () => setModal({ type: MODAL_ADD_FUNDS }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ConnectDropdown);
