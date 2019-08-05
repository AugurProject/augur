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
  title: "Create Market",
  description: ["Create Market"],
  closeAction: () => dP.closeModal(),
  buttons: [
    {
      text: "Create",
      action: () => {
        const { newMarket, address } = sP;
        createMarket({
          isValid: true,
          validations: newMarket.validations,
          currentStep: newMarket.currentStep,
          outcomes: [],
          scalarSmallNum: newMarket.minPrice,
          scalarBigNum: newMarket.maxPrice,
          scalarDenomination: newMarket.scalarDenomination,
          description: newMarket.description,
          expirySourceType: newMarket.expirySourceType,
          expirySource: newMarket.expirySource,
          designatedReporterType: newMarket.designatedReporterType,
          designatedReporterAddress:
            newMarket.designatedReporterAddress === ''
              ? address
              : newMarket.designatedReporterAddress,
          minPrice: newMarket.minPrice,
          maxPrice: newMarket.maxPrice,
          endTime: newMarket.endTime.timestamp,
          tickSize: newMarket.tickSize,
          hour: newMarket.hour,
          minute: newMarket.minute,
          meridiem: newMarket.meridiem,
          marketType: newMarket.marketType,
          detailsText: newMarket.detailsText,
          categories: ['', '', ''],
          settlementFee: 0,
          affiliateFee: 0,
          orderBook: {},
          orderBookSorted: {},
          orderBookSeries: {},
          initialLiquidityDai: 0,
          initialLiquidityGas: 0,
          creationError: '',
        });
        dP.closeModal();
        if (sP.modal.cb) {
          sP.modal.cb();
        }
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
