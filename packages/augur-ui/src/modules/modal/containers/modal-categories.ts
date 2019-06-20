import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { CreateMarket } from "modules/modal/create-market";
import { closeModal } from "modules/modal/actions/close-modal";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal())
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "CHOOSE A SUB-CATEGORY",
  categorySelection: {
    categoriesList: ["Politics", "Sports", "Crypto", "Finance", "Other"],
    save: (cat) => console.log("CategorySelection save from container", cat)
  },
  closeAction: () => {
    dP.closeModal();
  },
  buttons: [
    {
      text: "Save",
      action: (category) => {
        sP.modal.save(category)
        dP.closeModal();
      }
    },
    {
      text: "Close",
      action: () => {
        dP.closeModal();
      }
    }
  ]
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(CreateMarket),
);
