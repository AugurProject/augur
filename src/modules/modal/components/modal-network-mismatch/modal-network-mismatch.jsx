import React from "react";
import PropTypes from "prop-types";
import isMetaMask from "modules/auth/helpers/is-meta-mask";
import Styles from "modules/modal/components/modal-network-mismatch/modal-network-mismatch.styles";

const ModalNetworkMismatch = p => (
  <section className={Styles.ModalNetworkMismatch}>
    <h1>Network Mismatch</h1>
    {isMetaMask() ? (
      <section className={Styles.NetworkMismatchMessage}>
        <span>MetaMask is connected to the wrong Ethereum network.</span>
        <span>Please set the MetaMask network to: {p.expectedNetwork}</span>
      </section>
    ) : (
      <section className={Styles.NetworkMismatchMessage}>
        <span>
          Your Ethereum node and Augur node are connected to different networks.
        </span>
        <span>Please connect to a {p.expectedNetwork} Ethereum node.</span>
      </section>
    )}
  </section>
);

ModalNetworkMismatch.propTypes = {
  expectedNetwork: PropTypes.string.isRequired
};

export default ModalNetworkMismatch;
