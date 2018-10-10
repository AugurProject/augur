import React from "react";
import PropTypes from "prop-types";

import ModalSignTransaction from "modules/modal/containers/modal-sign-transaction";
import ModalConfirm from "modules/modal/components/modal-confirm";
import ModalReview from "modules/modal/components/modal-review";
import ModalNetworkDisabled from "modules/modal/containers/modal-network-disabled";
import ModalNetworkMismatch from "modules/modal/containers/modal-mismatch";
import ModalNetworkDisconnected from "modules/modal/containers/modal-network-disconnected";
import ModalApproval from "modules/modal/containers/modal-approval";
import ModalClaimReportingFeesForkedMarket from "modules/modal/containers/modal-claim-reporting-fees-forked-market";
import ModalClaimReportingFeesNonforkedMarkets from "modules/modal/containers/modal-claim-reporting-fees-nonforked-markets";
import ModalParticipate from "modules/modal/containers/modal-participate";
import ModalMigrateMarket from "modules/modal/containers/modal-migrate-market";
import ModalNetworkConnect from "modules/modal/containers/modal-network-connect";
import ModalDisclaimer from "modules/modal/containers/modal-disclaimer";
import ModalGasPrice from "modules/modal/containers/modal-gas-price";

import * as TYPES from "modules/modal/constants/modal-types";

import Styles from "modules/modal/components/common/common.styles";

const ModalView = p => {
  const { closeModal, modal } = p;

  return (
    <section className={Styles.ModalView}>
      <div className={Styles.ModalView__content}>
        {modal.type === TYPES.MODAL_GAS_PRICE && <ModalGasPrice {...p} />}
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
        {modal.type === TYPES.MODAL_NETWORK_CONNECT && <ModalNetworkConnect />}
        {modal.type === TYPES.MODAL_NETWORK_DISCONNECTED && (
          <ModalNetworkDisconnected {...p} />
        )}
        {modal.type === TYPES.MODAL_ACCOUNT_APPROVAL && <ModalApproval />}
        {modal.type === TYPES.MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET && (
          <ModalClaimReportingFeesForkedMarket {...modal} />
        )}
        {modal.type === TYPES.MODAL_CLAIM_REPORTING_FEES_NONFORKED_MARKETS && (
          <ModalClaimReportingFeesNonforkedMarkets {...modal} />
        )}
        {modal.type === TYPES.MODAL_MIGRATE_MARKET && (
          <ModalMigrateMarket {...modal} closeModal={closeModal} />
        )}
        {modal.type === TYPES.MODAL_DISCLAIMER && (
          <ModalDisclaimer {...modal} />
        )}
      </div>
    </section>
  );
};

ModalView.propTypes = {
  modal: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default ModalView;
