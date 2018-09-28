import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { updateModal } from "modules/modal/actions/update-modal";
import GasPriceEdit from "modules/app/components/gas-price-edit/gas-price-edit";


const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({
  updateModal: modal => dispatch(updateModal(modal)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GasPriceEdit)
);
