import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { updateModal } from "modules/modal/actions/update-modal";
import GasPriceEdit from "modules/app/components/gas-price-edit/gas-price-edit";

const mapStateToProps = state => {
  const { fast, average, safeLow, userDefinedGasPrice } = state.gasPriceInfo;

  const userDefined = userDefinedGasPrice || average || 0;
  let gasPriceSpeed = "Standard";
  if (userDefined > fast && fast !== 0) {
    gasPriceSpeed = "Fast";
  } else if (userDefined < safeLow && safeLow !== 0) {
    gasPriceSpeed = "Slow";
  }

  return {
    modal: state.modal,
    userDefinedGasPrice: userDefined,
    gasPriceSpeed
  };
};

const mapDispatchToProps = dispatch => ({
  updateModal: modal => dispatch(updateModal(modal))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GasPriceEdit)
);
