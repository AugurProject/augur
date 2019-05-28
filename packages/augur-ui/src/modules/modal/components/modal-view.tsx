import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ModalSignTransaction from "modules/modal/containers/modal-sign-transaction";
import ModalConfirm from "modules/modal/components/modal-confirm";
import ModalReview from "modules/modal/components/modal-review";
import ModalRepFaucet from "modules/modal/containers/modal-rep-faucet";
import ModalDaiFaucet from "modules/modal/containers/modal-dai-faucet";
import ModalDeposit from "modules/modal/containers/modal-deposit";
import ModalWithdraw from "modules/modal/containers/modal-withdraw";
import ModalNetworkDisabled from "modules/modal/containers/modal-network-disabled";
import ModalTransactions from "modules/modal/containers/modal-transactions";
import ModalUnsignedOrders from "modules/modal/containers/modal-unsigned-orders";
import ModalNetworkMismatch from "modules/modal/containers/modal-mismatch";
import ModalNetworkDisconnected from "modules/modal/containers/modal-network-disconnected";
import ModalApproval from "modules/modal/containers/modal-approval";
import ModalFinalize from "modules/modal/containers/modal-finalize";
import ModalMarketReview from "modules/modal/containers/modal-market-review";
import ModalMarketReviewTrade from "modules/modal/containers/modal-market-review-trade";
import ModalSellCompleteSets from "modules/modal/containers/modal-sell-complete-sets";
import ModalClaimReportingFeesForkedMarket from "modules/modal/containers/modal-claim-reporting-fees-forked-market";
import ModalClaimFees from "modules/modal/containers/modal-claim-fees";
import ModalParticipate from "modules/modal/containers/modal-participate";
import ModalMigrateMarket from "modules/modal/containers/modal-migrate-market";
import ModalNetworkConnect from "modules/modal/containers/modal-network-connect";
import ModalDisclaimer from "modules/modal/containers/modal-disclaimer";
import ModalGasPrice from "modules/modal/containers/modal-gas-price";
import ModalClaimTradingProceeds from "modules/modal/containers/modal-claim-trading-proceeds";
import ModalClaimProceeds from "modules/modal/containers/modal-claim-proceeds";
import ModalTradingOverlay from "modules/modal/components/modal-trading-overlay";
import ModalOpenOrders from "modules/modal/containers/modal-open-orders";

import * as TYPES from "modules/common-elements/constants";

import Styles from "modules/modal/components/common/common.styles";

const ESCAPE_KEYCODE = 27;

function selectModal(type, props, closeModal, modal) {
  switch (type) {
    case TYPES.MODAL_SELL_COMPLETE_SETS:
      return <ModalSellCompleteSets {...props} />;
    case TYPES.MODAL_CLAIM_PROCEEDS:
      return <ModalClaimProceeds {...props} />;
    case TYPES.MODAL_CLAIM_TRADING_PROCEEDS:
      return <ModalClaimTradingProceeds {...props} />;
    case TYPES.MODAL_GAS_PRICE:
      return <ModalGasPrice {...props} />;
    case TYPES.MODAL_UNSIGNED_ORDERS:
      return <ModalUnsignedOrders />;
    case TYPES.MODAL_OPEN_ORDERS:
      return <ModalOpenOrders />;
    case TYPES.MODAL_TRANSACTIONS:
      return <ModalTransactions />;
    case TYPES.MODAL_REP_FAUCET:
      return <ModalRepFaucet />;
    case TYPES.MODAL_DAI_FAUCET:
      return <ModalDaiFaucet />;
    case TYPES.MODAL_DEPOSIT:
      return <ModalDeposit />;
    case TYPES.MODAL_WITHDRAW:
      return <ModalWithdraw />;
    case TYPES.MODAL_CONFIRM:
      return <ModalConfirm {...modal} closeModal={closeModal} />;
    case TYPES.MODAL_REVIEW:
      return <ModalReview {...modal} />;
    case TYPES.MODAL_LEDGER:
    case TYPES.MODAL_TREZOR:
      return <ModalSignTransaction {...modal} />;
    case TYPES.MODAL_PARTICIPATE:
      return <ModalParticipate />;
    case TYPES.MODAL_NETWORK_MISMATCH:
      return <ModalNetworkMismatch {...modal} />;
    case TYPES.MODAL_NETWORK_DISABLED:
      return <ModalNetworkDisabled {...modal} />;
    case TYPES.MODAL_NETWORK_CONNECT:
      return <ModalNetworkConnect />;
    case TYPES.MODAL_NETWORK_DISCONNECTED:
      return <ModalNetworkDisconnected {...props} />;
    case TYPES.MODAL_FINALIZE_MARKET:
      return <ModalFinalize />;
    case TYPES.MODAL_MARKET_REVIEW:
      return <ModalMarketReview {...modal} />;
    case TYPES.MODAL_MARKET_REVIEW_TRADE:
      return <ModalMarketReviewTrade {...modal} />;
    case TYPES.MODAL_ACCOUNT_APPROVAL:
      return <ModalApproval />;
    case TYPES.MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET:
      return <ModalClaimReportingFeesForkedMarket {...modal} />;
    case TYPES.MODAL_CLAIM_FEES:
      return <ModalClaimFees {...modal} />;
    case TYPES.MODAL_MIGRATE_MARKET:
      return <ModalMigrateMarket {...modal} closeModal={closeModal} />;
    case TYPES.MODAL_DISCLAIMER:
      return <ModalDisclaimer {...modal} />;
    case TYPES.MODAL_TRADING_OVERLAY:
      return <ModalTradingOverlay {...modal} closeModal={closeModal} />;
    default:
      return <div />;
  }
}

export default class ModalView extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const { closeModal } = this.props;
    window.onpopstate = () => {
      closeModal();
    };

    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    const { modal, closeModal } = this.props;

    if (e.keyCode === ESCAPE_KEYCODE) {
      if (modal && modal.cb) {
        modal.cb();
      }
      closeModal();
    }
  }

  render() {
    const { closeModal, modal } = this.props;

    const Modal = selectModal(modal.type, this.props, closeModal, modal);

    return (
      <section className={Styles.ModalView}>
        <div
          className={classNames({
            [`${Styles["ModalView__content--taller"]}`]:
              modal.type === TYPES.MODAL_DISCLAIMER,
            [`${Styles["ModalView__content--full"]}`]:
              modal.type === TYPES.MODAL_TRADING_OVERLAY
          })}
        >
          {Modal}
        </div>
      </section>
    );
  }
}
