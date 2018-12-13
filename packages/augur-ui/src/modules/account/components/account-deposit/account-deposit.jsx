import React, { Component } from "react";

import PropTypes from "prop-types";
import QRCode from "qrcode.react";
import Clipboard from "clipboard";
import TextFit from "react-textfit";

import { NETWORK_IDS } from "modules/app/constants/network";
import {
  Deposit as DepositIcon,
  Copy as CopyIcon
} from "modules/common/components/icons";

import Styles from "modules/account/components/account-deposit/account-deposit.styles";

export default class AccountDeposit extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    openZeroExInstant: PropTypes.func.isRequired,
    augurNodeNetworkId: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      animateCopy: false
    };

    this.copyClicked = this.copyClicked.bind(this);
    this.copyTimeout = null;
  }

  componentDidMount() {
    const clipboard = new Clipboard("#copy_address"); // eslint-disable-line
  }

  copyClicked() {
    clearTimeout(this.copyTimeout);
    this.setState({ animateCopy: true });
    this.copyTimeout = setTimeout(() => {
      if (this.componentWrapper) this.setState({ animateCopy: false });
    }, 1000);
  }

  render() {
    const { address, openZeroExInstant, augurNodeNetworkId } = this.props;
    const styleQR = {
      height: "auto",
      width: "100%"
    };
    const show0xInstant = [NETWORK_IDS.Mainnet, NETWORK_IDS.Kovan].includes(
      augurNodeNetworkId
    );
    return (
      <section
        className={Styles.AccountDeposit}
        ref={componentWrapper => {
          this.componentWrapper = componentWrapper;
        }}
      >
        <div className={Styles.AccountDeposit__heading}>
          <h1>Account: Deposit</h1>
          {DepositIcon}
        </div>
        <div className={Styles.AccountDeposit__main}>
          <div className={Styles.AccountDeposit__description}>
            {show0xInstant && (
              <div className={Styles.AccountDeposit__0xInstantButton}>
                <button onClick={openZeroExInstant}>
                  Buy REP using 0x instant
                </button>
              </div>
            )}
            {!show0xInstant && (
              <div className={Styles.AccountDeposit__0xInstantButton}>
                Deposits via 0x Instant are only available on the Ethereum main
                network and Kovan test network.
              </div>
            )}
          </div>
          <div className={Styles.AccountDeposit__address}>
            <h3 className={Styles.AccountDeposit__addressLabel}>
              Public Account Address
            </h3>
            <TextFit mode="single" max={18}>
              <button
                id="copy_address"
                className={Styles.AccountDeposit__copyButtonElement}
                data-clipboard-text={address}
                onClick={this.copyClicked}
              >
                <span className={Styles.AccountDeposit__addressString}>
                  {address}
                </span>
                <span className={Styles.AccountDeposit__copyButtonContent}>
                  {this.state.animateCopy ? (
                    "Copied!"
                  ) : (
                    <span className={Styles.AccountDeposit__copyButtonSvg}>
                      {CopyIcon}
                    </span>
                  )}
                </span>
              </button>
            </TextFit>
          </div>
          <div>
            <QRCode value={address} style={styleQR} />
          </div>
        </div>
      </section>
    );
  }
}
