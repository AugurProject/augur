import { connect } from 'react-redux';
import ConnectDropdown from 'modules/auth/components/connect-dropdown/connect-dropdown';
import { logout } from 'modules/auth/actions/logout';
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_GAS_PRICE, GAS_SPEED_LABELS } from 'modules/common/constants';

const mapStateToProps = state => {
  const { fast, average, safeLow, userDefinedGasPrice } = state.gasPriceInfo;

  const userDefined = userDefinedGasPrice || average || 0;
  let gasPriceSpeed = GAS_SPEED_LABELS.STANDARD;
  if (userDefined > fast && fast !== 0) {
    gasPriceSpeed = GAS_SPEED_LABELS.FAST;
  } else if (userDefined < safeLow && safeLow !== 0) {
    gasPriceSpeed = GAS_SPEED_LABELS.SLOW;
  }

  return {
    userDefinedGasPrice: userDefined,
    gasPriceSpeed,
    isLogged: state.authStatus.isLogged,
    accountMeta:
      state.loginAccount &&
      state.loginAccount.meta,
    balances: state.loginAccount && state.loginAccount.balances,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  gasModal: () => dispatch(updateModal({ type: MODAL_GAS_PRICE })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectDropdown);
