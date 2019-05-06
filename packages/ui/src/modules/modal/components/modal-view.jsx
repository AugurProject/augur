import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ModalSignTransaction from "modules/modal/containers/modal-sign-transaction";
import ModalConfirm from "modules/modal/components/modal-confirm";
import ModalReview from "modules/modal/components/modal-review";
import ModalRepFaucet from "modules/modal/containers/modal-rep-faucet";
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
    window.onpopstate = () => {
      this.props.closeModal();
    };

    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (e.keyCode === ESCAPE_KEYCODE) {
      if (this.props.modal && this.props.modal.cb) {
        this.props.modal.cb();
      }
      this.props.closeModal();
    }
  }

  render() {
    const { closeModal, modal } = this.props;

    return (
      <section className={Styles.ModalView}>
        <div
          className={classNames(Styles.ModalView__content, {
            [`${Styles["ModalView__content--taller"]}`]:
              modal.type === TYPES.MODAL_DISCLAIMER,
            [`${Styles["ModalView__content--full"]}`]:
              modal.type === TYPES.MODAL_TRADING_OVERLAY
          })}
        >
          {modal.type === TYPES.MODAL_SELL_COMPLETE_SETS && (
            <ModalSellCompleteSets {...this.props} />
          )}
          {modal.type === TYPES.MODAL_CLAIM_PROCEEDS && (
            <ModalClaimProceeds {...this.props} />
          )}
          {modal.type === TYPES.MODAL_CLAIM_TRADING_PROCEEDS && (
            <ModalClaimTradingProceeds {...this.props} />
          )}
          {modal.type === TYPES.MODAL_GAS_PRICE && (
            <ModalGasPrice {...this.props} />
          )}
          {modal.type === TYPES.MODAL_UNSIGNED_ORDERS && (
            <ModalUnsignedOrders />
          )}
          {modal.type === TYPES.MODAL_OPEN_ORDERS && <ModalOpenOrders />}
          {modal.type === TYPES.MODAL_TRANSACTIONS && <ModalTransactions />}
          {modal.type === TYPES.MODAL_REP_FAUCET && <ModalRepFaucet />}
          {modal.type === TYPES.MODAL_DEPOSIT && <ModalDeposit />}
          {modal.type === TYPES.MODAL_WITHDRAW && <ModalWithdraw />}
          {modal.type === TYPES.MODAL_CONFIRM && (
            <ModalConfirm {...modal} closeModal={closeModal} />
          )}
          {modal.type === TYPES.MODAL_REVIEW && <ModalReview {...modal} />}
          {modal.type === (TYPES.MODAL_LEDGER || TYPES.MODAL_TREZOR) && (
            <ModalSignTransaction {...modal} />
          )}
          {modal.type === TYPES.MODAL_PARTICIPATE && <ModalParticipate />}
          {modal.type === TYPES.MODAL_NETWORK_MISMATCH && (
            <ModalNetworkMismatch {...modal} />
          )}
          {modal.type === TYPES.MODAL_NETWORK_DISABLED && (
            <ModalNetworkDisabled {...modal} />
          )}
          {modal.type === TYPES.MODAL_NETWORK_CONNECT && (
            <ModalNetworkConnect />
          )}
          {modal.type === TYPES.MODAL_NETWORK_DISCONNECTED && (
            <ModalNetworkDisconnected {...this.props} />
          )}
          {modal.type === TYPES.MODAL_FINALIZE_MARKET && <ModalFinalize />}
          {modal.type === TYPES.MODAL_MARKET_REVIEW && (
            <ModalMarketReview {...modal} />
          )}
          {modal.type === TYPES.MODAL_MARKET_REVIEW_TRADE && (
            <ModalMarketReviewTrade {...modal} />
          )}
          {modal.type === TYPES.MODAL_ACCOUNT_APPROVAL && <ModalApproval />}
          {modal.type === TYPES.MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET && (
            <ModalClaimReportingFeesForkedMarket {...modal} />
          )}
          {modal.type === TYPES.MODAL_CLAIM_FEES && (
            <ModalClaimFees {...modal} />
          )}
          {modal.type === TYPES.MODAL_MIGRATE_MARKET && (
            <ModalMigrateMarket {...modal} closeModal={closeModal} />
          )}
          {modal.type === TYPES.MODAL_DISCLAIMER && (
            <ModalDisclaimer {...modal} />
          )}
          {modal.type === TYPES.MODAL_TRADING_OVERLAY && (
            <ModalTradingOverlay {...modal} closeModal={closeModal} />
          )}
        </div>
      </section>
    );
  }
}
