import React, { Component } from "react";
import PropTypes from "prop-types";

import Styles from "modules/modal/components/common/common.styles";

import ModalActions from "modules/modal/components/common/modal-actions";
import Checkbox from "src/modules/common/components/checkbox/checkbox";

const EST_HEIGHT_PERCENT = 0.98;

export default class ModalDisclaimer extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      didScroll: false,
      didCheck: false
    };

    this.checkScroll = this.checkScroll.bind(this);
    this.checkCheckbox = this.checkCheckbox.bind(this);
  }

  checkScroll(e) {
    this.setState({
      didScroll:
        this.refs.containerText.scrollTop +
          this.refs.containerText.clientHeight >=
        this.refs.containerText.scrollHeight * EST_HEIGHT_PERCENT
    });
  }

  checkCheckbox(didCheck) {
    if (this.state.didScroll) this.setState({ didCheck });
  }

  render() {
    const { closeModal } = this.props;
    const { didScroll, didCheck } = this.state;

    return (
      <section className={Styles.ModalDisclaimer}>
        <h1>Attention</h1>
        <div
          ref="containerText"
          className={Styles.ModalDisclaimer__TextBox}
          onScroll={e => this.checkScroll(e)}
        >
          <p>
            Augur is a decentralized oracle and peer to peer protocol for
            prediction markets. Augur is free, public, open source software and
            a set of smart contracts written in Solidity that can be deployed to
            the Ethereum blockchain (the “<b>Augur Protocol</b>
            ”). Before using the Augur Protocol, please review the{" "}
            <a
              href="https://augur.net/faq"
              target="_blank"
              rel="noopener noreferrer"
            >
              FAQs
            </a>{" "}
            and{" "}
            <a
              href="https://docs.augur.net/"
              target="_blank"
              rel="noopener noreferrer"
            >
              documentation
            </a>{" "}
            (the “<b>Documentation</b>
            ”) for a detailed explanation on how the Augur Protocol works.
          </p>

          <p>
            The Forecast Foundation OU (the “<b>Foundation</b>
            ”) is a not-for-profit entity. It does not own or lead Augur, but
            rather supports and develops the free, open-source protocol that is
            Augur. Portions of the Augur Protocol are made available under the
            GNU General Public License and portions under the MIT license -- and
            the disclaimers contained therein apply including that the Augur
            Protocol is provided “AS IS”, “WITH ALL FAULTS” and “AT YOUR OWN
            RISK”. The Foundation will not be liable for any liability or
            damages whatsoever associated with your use, inability to use, or
            your interaction with other users of, the Augur Protocol, including
            any direct, indirect, incidental, special, exemplary or
            consequential damages, loss of profits, Reputation (REP) tokens,
            Ether (ETH) tokens, any other cryptocurrencies or data.
          </p>

          <p>
            You acknowledge that the current version of the Augur Protocol is a
            beta version and as such has not been fully-tested and may not
            perform as designed. On the Augur Protocol, Reputation (REP) and
            Ether (ETH) may be used respectively for staking on outcomes and
            trading, and in the future, other tokens or cryptocurrencies may be
            used. While you should always be thoughtful about the REP, ETH or
            other tokens/cryptocurrencies you stake and trade (and can lose)
            through the Augur Protocol, the concerns regarding loss of these
            tokens or cryptocurrencies is particularly acute with beta software
            that may not perform as designed, including that the beta version of
            the Augur Protocol may not accurately reflect the intent of the
            smart contracts, the FAQs or the Documentation. Your use of the
            Augur Protocol involves various risks, including, but not limited to
            losing tokens/cryptocurrencies due to invalidation. Careful due
            diligence should be undertaken as to the amount of REP, ETH or other
            tokens/cryptocurrencies you stake and trade using the Augur Protocol
            in beta format with full understanding that any staking and trading
            of these tokens/cryptocurrencies could be subject to total loss. You
            assume any and all risk associated with your use of the Augur
            Protocol.
          </p>

          <p>
            Although the Foundation has not sought to list REP on cryptocurrency
            exchanges, it is aware that REP has been listed on certain exchanges
            and in the future it may be delisted on these exchanges and/or
            listed on others. The Foundation disavows any obligation with
            respect to the listing of REP on exchanges and it disavows any
            responsibility with respect to the value or trading of REP on
            exchanges. Persons trading REP or otherwise engaged in activities
            involving REP on exchanges assume any and all risk, including that
            of total loss, associated with such activities.
          </p>

          <p>
            You are solely responsible for compliance with all laws that may
            apply to your particular use of the Augur Protocol. Cryptocurrencies
            and blockchain technologies have been the subject of scrutiny by
            various regulatory bodies around the world. The Foundation makes no
            representation regarding the application of any laws, including but
            by no means limited to those relating to gaming, options,
            derivatives or securities, to your use of the Augur Protocol.
            Indeed, depending on the jurisdiction and the contemplated use of
            the Augur Protocol (whether yours or another’s), that use may be
            considered illegal. You agree that the Foundation is not responsible
            for determining whether or which laws may apply to your use of the
            Augur Protocol. You may modify the Augur Protocol under the terms of
            the applicable open source license to effectuate your compliance
            with any applicable laws.
          </p>
        </div>
        <div className={Styles.ModalDisclaimer__helperText}>
          <label>
            Read the full disclaimer above. When you&apos;ve scrolled to the
            bottom, click the checkbox below to mark that you understand and
            agree.
          </label>
        </div>
        <div className={Styles.ModalDisclaimer__checkbox}>
          <label htmlFor="i_have_read_disclaimer">
            <Checkbox
              id="i_have_read_disclaimer"
              type="checkbox"
              value={didCheck && didScroll}
              isChecked={didCheck && didScroll}
              disabled={!didScroll}
              onClick={e => {
                e.preventDefault();
                this.checkCheckbox(!didCheck);
              }}
            />
            I have read and understood the above.
          </label>
        </div>
        <ModalActions
          buttons={[
            {
              label: "I Agree and Accept the above",
              type: "purple",
              isDisabled: !didScroll || !didCheck,
              action: closeModal
            }
          ]}
        />
      </section>
    );
  }
}
