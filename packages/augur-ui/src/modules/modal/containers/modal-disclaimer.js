import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalDisclaimer from "modules/modal/components/modal-disclaimer";
import { closeModal } from "modules/modal/actions/close-modal";
import { DISCLAIMER_SEEN } from "src/modules/common-elements/constants";

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    const localStorageRef =
      typeof window !== "undefined" && window.localStorage;
    if (localStorageRef && localStorageRef.setItem) {
      localStorageRef.setItem(DISCLAIMER_SEEN, true);
    }
    dispatch(closeModal());
  }
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalDisclaimer)
);
