import React, { Component } from "react";
import PropTypes from "prop-types";

import { formatGasCostToEther } from "utils/format-number";

import Styles from "modules/modal/components/common/common.styles";
import ModalReview from "modules/modal/components/modal-review";

export default class ModalClaimReportingFeesForkedMarket extends Component {
  static propTypes = {
    claimReportingFeesForkedMarket: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    recipient: PropTypes.string.isRequired,
    forkedMarket: PropTypes.object.isRequired,
    unclaimedEth: PropTypes.object.isRequired,
    unclaimedRep: PropTypes.object.isRequired,
    modalCallback: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    gasPrice: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      ClaimReportingFeesForkedMarketGasEstimate: "0"
    };

    this.handleClaimReportingFeesForkedMarket = this.handleClaimReportingFeesForkedMarket.bind(
      this
    );
  }

  componentWillMount() {
    const ClaimReportingFeesForkedMarketOptions = {
      forkedMarket: this.props.forkedMarket,
      estimateGas: true,
      onSent: () => {},
      onSuccess: result => {
        const ClaimReportingFeesForkedMarketGasEstimate = result.gasEstimates.totals.all.toString();
        this.setState({
          ClaimReportingFeesForkedMarketGasEstimate: formatGasCostToEther(
            ClaimReportingFeesForkedMarketGasEstimate,
            { decimalsRounded: 4 },
            this.props.gasPrice
          )
        });
      },
      onFailed: err => {
        // Default to 0 for now if we recieve an error.
        const ClaimReportingFeesForkedMarketGasEstimate = "0";
        this.setState({
          ClaimReportingFeesForkedMarketGasEstimate: formatGasCostToEther(
            ClaimReportingFeesForkedMarketGasEstimate,
            { decimalsRounded: 4 },
            this.props.gasPrice
          )
        });
      }
    };
    this.props.claimReportingFeesForkedMarket(
      ClaimReportingFeesForkedMarketOptions
    );
  }

  handleClaimReportingFeesForkedMarket(e) {
    const ClaimReportingFeesForkedMarketOptions = {
      forkedMarket: this.props.forkedMarket,
      estimateGas: false,
      onSent: () => {},
      onSuccess: result => {
        this.props.modalCallback(result);
        this.props.closeModal();
      },
      onFailed: err => {
        this.props.closeModal();
      }
    };
    this.props.claimReportingFeesForkedMarket(
      ClaimReportingFeesForkedMarketOptions
    );
  }

  render() {
    const {
      recipient,
      unclaimedRep,
      unclaimedEth,
      closeModal,
      type
    } = this.props;
    const s = this.state;

    // In theory, this modal should never be shown if there is no unclaimed ETH/REP, but check whether button should be disabled anyway.
    let disableClaimReportingFeesForkedMarketButton = false;
    if (unclaimedRep.formatted === "-" && unclaimedEth.formatted === "-") {
      disableClaimReportingFeesForkedMarketButton = true;
    }

    const reviewDetails = {
      title: "Review Withdrawal",
      type,
      items: [
        {
          label: "Recipient",
          value: recipient,
          denomination: ""
        },
        {
          label: "REP",
          value: unclaimedRep.formatted,
          denomination: "REP"
        },
        {
          label: "ETH",
          value: unclaimedEth.formatted,
          denomination: "ETH"
        },
        {
          label: "GAS",
          value: s.ClaimReportingFeesForkedMarketGasEstimate,
          denomination: "ETH"
        }
      ],
      description: [
        "Transferring all funds may require multiple signed transactions."
      ],
      buttons: [
        {
          label: "cancel",
          action: closeModal,
          type: "gray"
        },
        {
          label: "submit",
          action: this.handleClaimReportingFeesForkedMarket,
          type: "purple",
          isDisabled: disableClaimReportingFeesForkedMarketButton
        }
      ]
    };

    return (
      <section className={Styles.ModalContainer}>
        <ModalReview {...reviewDetails} />
      </section>
    );
  }
}
