import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { CreateMarket } from "modules/modal/create-market";
import { closeModal } from "modules/modal/actions/close-modal";
import { AppState } from "appStore";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal())
});
// TODO: fill out with real content later
const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "Market Type Help & Examples",
  content: [
    {
      header: "Market Type",
      paragraphs: ["A categorical market can have up to 8 possible choices for answers, and the answers are defined by the market creator. Each potential answer has its own order book, so it is more complicated to trade. Note that Augur can only resolve one answer as the correct result. So if the question is worded in such a way that more than one answer is correct, the market should resolve as Invalid."]
    }
  ],
  examples: {
    header: "Examples",
    previews: [
      {
        title: "Who will win between [Team A] versus [Team B] on [Date]",
        description: "Example: Who will win between Liverpool versus Arsenal on May 21, 2019?"
      },
      {
        title: "Who will win between [Team A] versus [Team B] on [Date]",
        description: "Example: Who will win between Liverpool versus Arsenal on May 21, 2019? "
      },
      {
        title: "Who will win between [Team A] versus [Team B] on [Date]",
        description: "Example: Who will win between Liverpool versus Arsenal on May 21, 2019? "
      }
    ]
  },
  closeAction: () => {
    dP.closeModal();
  },
  buttons: [
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
