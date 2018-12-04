import React, { Component } from "react";
import PropTypes from "prop-types";

import { formatGasCostToEther } from "utils/format-number";

import Styles from "modules/modal/components/common/common.styles";
import ModalReview from "modules/modal/components/modal-review";

export default class ModalClaimReportingFeesNonforkedMarkets extends Component {
  static propTypes = {
    claimReportingFeesNonforkedMarkets: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    recipient: PropTypes.string.isRequired,
    feeWindows: PropTypes.array.isRequired,
    forkedMarket: PropTypes.object,
    nonforkedMarkets: PropTypes.array.isRequired,
    unclaimedEth: PropTypes.object.isRequired,
    unclaimedRep: PropTypes.object.isRequired,
    modalCallback: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    gasPrice: PropTypes.number.isRequired
  };

  static defaultProps = {
    forkedMarket: null
  };

  constructor(props) {
    super(props);

    this.state = {
      ClaimReportingFeesNonforkedMarketsGasEstimate: "0"
    };

    this.handleClaimReportingFeesNonforkedMarkets = this.handleClaimReportingFeesNonforkedMarkets.bind(
      this
    );
  }

  componentWillMount() {
    const {
      feeWindows,
      forkedMarket,
      nonforkedMarkets,
      claimReportingFeesNonforkedMarkets
    } = this.props;
    const ClaimReportingFeesNonforkedMarketsOptions = {
      feeWindows,
      forkedMarket,
      nonforkedMarkets,
      estimateGas: true,
      onSent: () => {},
      onSuccess: result => {
        const ClaimReportingFeesNonforkedMarketsGasEstimate = result.gasEstimates.totals.all.toString();
        this.setState({
          ClaimReportingFeesNonforkedMarketsGasEstimate: formatGasCostToEther(
            ClaimReportingFeesNonforkedMarketsGasEstimate,
            { decimalsRounded: 4 },
            this.props.gasPrice
          )
        });
      },
      onFailed: err => {
        // Default to 0 for now if we recieve an error.
        const ClaimReportingFeesNonforkedMarketsGasEstimate = "0";
        this.setState({
          ClaimReportingFeesNonforkedMarketsGasEstimate: formatGasCostToEther(
            ClaimReportingFeesNonforkedMarketsGasEstimate,
            { decimalsRounded: 4 },
            this.props.gasPrice
          )
        });
      }
    };
    claimReportingFeesNonforkedMarkets(
      ClaimReportingFeesNonforkedMarketsOptions
    );
  }

  handleClaimReportingFeesNonforkedMarkets(e) {
    const {
      feeWindows,
      forkedMarket,
      nonforkedMarkets,
      claimReportingFeesNonforkedMarkets,
      modalCallback,
      closeModal
    } = this.props;
    const ClaimReportingFeesNonforkedMarketsOptions = {
      feeWindows,
      forkedMarket,
      nonforkedMarkets,
      estimateGas: false,
      onSent: () => {},
      onSuccess: result => {
        modalCallback(result);
        closeModal();
      },
      onFailed: closeModal
    };
    claimReportingFeesNonforkedMarkets(
      ClaimReportingFeesNonforkedMarketsOptions
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
    let disableClaimReportingFeesNonforkedMarketsButton = false;
    if (unclaimedRep.formatted === "-" && unclaimedEth.formatted === "-") {
      disableClaimReportingFeesNonforkedMarketsButton = true;
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
          value: s.ClaimReportingFeesNonforkedMarketsGasEstimate,
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
          action: this.handleClaimReportingFeesNonforkedMarkets,
          type: "purple",
          isDisabled: disableClaimReportingFeesNonforkedMarketsButton
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
