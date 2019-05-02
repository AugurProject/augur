import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { WithdrawForm } from "modules/modal/withdraw-form";

import { closeModal } from "modules/modal/actions/close-modal";
import { formatGasCostToEther, formatEtherEstimate } from "utils/format-number";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { transferFunds } from "modules/auth/actions/transfer-funds";

const TRANSFER_ETH_GAS_COST = 21000;
const TRANSFER_REP_GAS_COST = 80000;

const mapStateToProps = (state: any) => ({
  modal: state.modal,
  loginAccount: state.loginAccount,
  GasCosts: {
    eth: formatEtherEstimate(
      formatGasCostToEther(
        TRANSFER_ETH_GAS_COST,
        { decimalsRounded: 4 },
        getGasPrice(state)
      )
    ),
    rep: formatEtherEstimate(
      formatGasCostToEther(
        TRANSFER_REP_GAS_COST,
        { decimalsRounded: 4 },
        getGasPrice(state)
      )
    )
  }
});

const mapDispatchToProps = (dispatch: Function) => ({
  closeModal: () => dispatch(closeModal()),
  transferFunds: (amount: string, asset: string, to: string) => {
    dispatch(transferFunds(amount, asset, to));
    dispatch(closeModal());
  }
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  GasCosts: sP.GasCosts,
  loginAccount: sP.loginAccount,
  closeAction: () => dP.closeModal(),
  transferFunds: (amount: string, asset: string, to: string) =>
    dP.transferFunds(amount, asset, to)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(WithdrawForm)
);
