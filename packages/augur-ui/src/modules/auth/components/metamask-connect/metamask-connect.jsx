import React from "react";
import PropTypes from "prop-types";

import Styles from "modules/auth/components/metamask-connect/metamask-connect.styles";

const MetaMask = ({ connectMetaMask, isMetaMaskPresent }) => (
  <section className={Styles.MetaMask__connect}>
    {isMetaMaskPresent && (
      <div className={Styles.MetaMask__content}>
        <button
          onClick={() => connectMetaMask()}
          className={Styles.MetaMask__button}
        >
          Connect to MetaMask
        </button>
      </div>
    )}

    {!isMetaMaskPresent && (
      <div className={Styles.MetaMask__content}>
        <span>
          MetaMask is a secure identity vault that allows you to manage your
          identities across different dApps.
        </span>
        <span>
          Install the browser plugin at{" "}
          <a
            href="https://metamask.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            metamask.io
          </a>
          .
        </span>
        <hr />
        <span>
          Note: If MetaMask is installed & unlocked, you will be logged in
          automatically.
        </span>
      </div>
    )}
  </section>
);

MetaMask.propTypes = {
  connectMetaMask: PropTypes.func.isRequired,
  isMetaMaskPresent: PropTypes.bool.isRequired
};

export default MetaMask;
