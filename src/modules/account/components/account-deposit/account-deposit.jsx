import React, { Component } from "react";

import PropTypes from "prop-types";
import QRCode from "qrcode.react";
import Clipboard from "clipboard";
import TextFit from "react-textfit";

import { NETWORK_IDS } from "modules/common-elements/constants";
import {
  Deposit as DepositIcon,
  Copy as CopyIcon
} from "modules/common/components/icons";

import { augur } from "services/augurjs";

import { PrimaryButton } from "modules/common-elements/buttons";

import Styles from "modules/account/components/account-deposit/account-deposit.styles";

function airSwapOnClick(e) {
  const env =
    parseInt(augur.rpc.getNetworkID(), 10) === 1 ? "production" : "sandbox";
  e.preventDefault();
  // The widget will offer swaps for REP <-> ETH on mainnet
  // It can still be tested on rinkeby, but only AST <-> ETH is offered
  window.AirSwap.Trader.render(
    {
      env,
      mode: "buy",
      token:
        env === "production"
          ? "0x1985365e9f78359a9b6ad760e32412f4a445e862"
          : "0xcc1cbd4f67cceb7c001bd4adf98451237a193ff8",
      onCancel() {
        console.info("AirSwap trade cancelled");
      },
      onComplete(txid) {
        console.info("AirSwap trade complete", txid);
      }
    },
    document.getElementById("app")
  );
}

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
    const showAirSwap = NETWORK_IDS.Mainnet === augurNodeNetworkId;

    return (
      <section
        className={Styles.AccountDeposit}
        ref={componentWrapper => {
          this.componentWrapper = componentWrapper;
        }}
      >
        <div className={Styles.AccountDeposit__heading}>
          <h1>
            Account: <span>Deposit</span>
          </h1>
          {DepositIcon}
        </div>
        <div className={Styles.AccountDeposit__main}>
          <div className={Styles.AccountDeposit__description}>
            <p>1. Click on your public address to copy it</p>
            <p>2. Purchase ETH / REP and deposit into your public address</p>
            <p>3. Check back here to see your updated balances</p>
          </div>
          <div>
            <h3 className={Styles.AccountDeposit__addressLabel}>
              ETH is used for Trading
            </h3>
            <div className={Styles.AccountDeposit__0xInstantButton}>
              <PrimaryButton
                text="Buy ETH using Wyre"
                action={() => window.open("http://www.sendwyre.com/")}
              />
            </div>
            <div className={Styles.AccountDeposit__0xInstantButton}>
              <PrimaryButton
                text="Buy ETH on Coinbase"
                action={() => window.open("https://www.coinbase.com/buy/ETH")}
              />
            </div>
            <br />
            <h3 className={Styles.AccountDeposit__addressLabel}>
              REP is used for Reporting
            </h3>
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
            {showAirSwap && (
              <div className={Styles.AccountDeposit__0xInstantButton}>
                <PrimaryButton
                  text="Buy REP using AirSwap"
                  action={airSwapOnClick}
                />
              </div>
            )}
          </div>
          <div className={Styles.AccountDeposit__address}>
            <h3 className={Styles.AccountDeposit__addressLabel}>
              My Public Address
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
              <QRCode value={address} style={styleQR} />
            </TextFit>
          </div>
        </div>
      </section>
    );
  }
}
