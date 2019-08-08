import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";
import { AppState } from "store";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { createMarket } from 'modules/contracts/actions/contractCalls';
import getValue from "utils/get-value";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  newMarket: state.newMarket,
  address: getValue(state, "loginAccount.address"),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "Final confirmation",
  subheader: {
    header: "Are you sure you want to proceeed?",
    subheaders: ["Once you create the market you can’t make any changes to the market or resolution details. Ensure that all market details are accurate before proceeding."]
  },
  subheader_2: {
    header: "Ready to proceed? Here’s what happens next, you will:",
    numbered: true,
    subheaders: [
      "Be taken to the portfolio page where your market will be listed as “Pending”",
      "Receive an alert when the market has been processed",
      "Receive a notification in your Account Summary to submit any initial liquidity previously entered"
    ]
  },
  closeAction: () => dP.closeModal(),
  buttons: [
    {
      text: "Confirm",
      action: () => {
        const { newMarket, address } = sP;
        createMarket({
          outcomes: newMarket.outcomes,
          scalarSmallNum: newMarket.minPrice,
          scalarBigNum: newMarket.maxPrice,
          scalarDenomination: newMarket.scalarDenomination,
          description: newMarket.description,
          expirySource: newMarket.expirySource,
          designatedReporterAddress:
            newMarket.designatedReporterAddress === ''
              ? address
              : newMarket.designatedReporterAddress,
          minPrice: newMarket.minPrice,
          maxPrice: newMarket.maxPrice,
          endTime: newMarket.endTimeFormatted.timestamp,
          tickSize: newMarket.tickSize,
          marketType: newMarket.marketType,
          detailsText: newMarket.detailsText,
          categories: newMarket.categories,
          settlementFee: newMarket.settlementFee,
          affiliateFee: newMarket.affiliateFee,
          offsetName: newMarket.offsetName,
        });
        if (sP.modal.cb) {
          sP.modal.cb();
        }
        dP.closeModal();
      },
    },
    {
      text: "Cancel",
      action: () => dP.closeModal(),
    },
  ],
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Message),
);
