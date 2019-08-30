import React, { Component } from "react";
import classNames from "classnames";

import ModalSignTransaction from "modules/modal/containers/modal-sign-transaction";
import ModalReporting from "modules/modal/containers/modal-reporting";
import ModalConfirm from "modules/modal/components/modal-confirm";
import ModalReview from "modules/modal/components/modal-review";
import ModalRepFaucet from "modules/modal/containers/modal-rep-faucet";
import ModalCreateMarket from "modules/modal/containers/modal-create-market";
import ModalDaiFaucet from "modules/modal/containers/modal-dai-faucet";
import ModalCreationHelp from "modules/modal/containers/modal-creation-help";
import ModalDeposit from "modules/modal/containers/modal-deposit";
import ModalWithdraw from "modules/modal/containers/modal-withdraw";
import ModalNetworkDisabled from "modules/modal/containers/modal-network-disabled";
import ModalTransactions from "modules/modal/containers/modal-transactions";
import ModalUnsignedOrders from "modules/modal/containers/modal-unsigned-orders";
import ModalNetworkMismatch from "modules/modal/containers/modal-mismatch";
import ModalNetworkDisconnected from "modules/modal/containers/modal-network-disconnected";
import ModalApproval from "modules/modal/containers/modal-approval";
import ModalFinalize from "modules/modal/containers/modal-finalize";
import ModalDiscard from "modules/modal/containers/modal-discard";
import ModalMarketReview from "modules/modal/containers/modal-market-review";
import ModalMarketReviewTrade from "modules/modal/containers/modal-market-review-trade";
import ModalClaimFees from "modules/modal/containers/modal-claim-fees";
import ModalParticipate from "modules/modal/containers/modal-participate";
import ModalNetworkConnect from "modules/modal/containers/modal-network-connect";
import ModalDisclaimer from "modules/modal/containers/modal-disclaimer";
import ModalGasPrice from "modules/modal/containers/modal-gas-price";
import ModalClaimTradingProceeds from "modules/modal/containers/modal-claim-trading-proceeds";
import ModalClaimProceeds from "modules/modal/containers/modal-claim-proceeds";
import ModalTradingOverlay from "modules/modal/components/modal-trading-overlay";
import ModalOpenOrders from "modules/modal/containers/modal-open-orders";
import ModalMarketLoading from "modules/modal/containers/modal-market-loading";
import ModalContent from "modules/modal/containers/modal-content";
import ModalCategories from "modules/modal/containers/modal-categories";
import ModalMarketType from "modules/modal/containers/modal-market-type";
import ModalDrQuickGuide from "modules/modal/containers/modal-dr-quick-guide";

import * as TYPES from "modules/common/constants";

import Styles from "modules/modal/components/common/common.styles.less";

const ESCAPE_KEYCODE = 27;

function selectModal(type, props, closeModal, modal) {
  switch (type) {
    case TYPES.MODAL_MARKET_TYPE:
      return <ModalMarketType {...props} />;
    case TYPES.MODAL_CATEGORIES:
      return <ModalCategories {...props} />;
    case TYPES.MODAL_CONTENT:
      return <ModalContent {...props} />;
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
    case TYPES.MODAL_CREATE_MARKET:
      return <ModalCreateMarket />;
    case TYPES.MODAL_DAI_FAUCET:
      return <ModalDaiFaucet />;
    case TYPES.MODAL_CREATION_HELP:
      return <ModalCreationHelp />;
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
    case TYPES.MODAL_REPORTING:
      return <ModalReporting {...modal} />;
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
    case TYPES.MODAL_DISCARD:
      return <ModalDiscard />;
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
    case TYPES.MODAL_DISCLAIMER:
      return <ModalDisclaimer {...modal} />;
    case TYPES.MODAL_TRADING_OVERLAY:
      return <ModalTradingOverlay {...modal} closeModal={closeModal} />;
    case TYPES.MODAL_MARKET_LOADING:
      return <ModalMarketLoading />;
    case TYPES.MODAL_DR_QUICK_GUIDE:
      return <ModalDrQuickGuide />;
    default:
      return <div />;
  }
}

interface ModalViewProps {
  modal: {
    cb: Function;
    type: string;
  };
  closeModal: Function;
}

export default class ModalView extends Component<ModalViewProps> {
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
              modal.type === TYPES.MODAL_TRADING_OVERLAY,
          })}
        >
          {Modal}
        </div>
      </section>
    );
  }
}
