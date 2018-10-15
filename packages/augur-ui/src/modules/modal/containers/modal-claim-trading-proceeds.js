import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalReview from "modules/modal/components/modal-review";
import { selectMarket } from "modules/markets/selectors/market";
import claimTradingProceeds, {
  CLAIM_SHARES_GAS_COST
} from "modules/positions/actions/claim-trading-proceeds";
import { closeModal } from "modules/modal/actions/close-modal";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { formatGasCostToEther } from "utils/format-number";
import { MODAL_REVIEW } from "modules/modal/constants/modal-types";

const mapStateToProps = state => ({
  modal: state.modal,
  gasCost: formatGasCostToEther(
    CLAIM_SHARES_GAS_COST,
    { decimalsRounded: 4 },
    getGasPrice(state)
  )
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  claimTradingProceeds: (marketId, callback) =>
    dispatch(claimTradingProceeds(marketId, callback))
});

const mergeProps = (sP, dP, oP) => {
  const { marketId } = sP.modal;
  const market = selectMarket(marketId);
  const { description, outstandingReturns } = market;
  const { gasCost } = sP;
  const { closeModal, claimTradingProceeds } = dP;

  return {
    buttons: [
      {
        label: "cancel",
        action: closeModal,
        type: "gray"
      },
      {
        label: "confirm",
        action: () => {
          closeModal();
          claimTradingProceeds(marketId);
        }
      }
    ],
    items: [
      {
        label: "Market",
        value: description,
        denomination: ""
      },
      {
        label: "Returns",
        value: outstandingReturns,
        denomination: "ETH"
      },
      {
        label: "Gas Cost",
        value: gasCost,
        denomination: "ETH"
      }
    ],
    title: "Claim Outstanding Returns",
    type: MODAL_REVIEW
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ModalReview)
);
