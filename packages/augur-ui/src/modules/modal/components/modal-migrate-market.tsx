import React, { Component } from "react";

import { formatEther } from "utils/format-number";
import Styles from "modules/modal/components/common/common.styles.less";
import ModalReview from "modules/modal/components/modal-review";

interface ModalMigrateMarketProps {
  marketId: string;
  marketDescription: string;
  migrateMarketThroughFork: Function;
  closeModal: Function;
  type: string;
}

interface ModalMigrateMarketState {
  gasEstimate: string;
}

export default class ModalMigrateMarket extends Component<ModalMigrateMarketProps, ModalMigrateMarketState> {
  constructor(props) {
    super(props);

    this.state = {
      gasEstimate: "0.0023",
    };

    this.submitForm = this.submitForm.bind(this);
  }

  componentWillMount() {
    const { marketId, migrateMarketThroughFork } = this.props;
    migrateMarketThroughFork(marketId, true, (err, gasEstimate) => {
      if (!err && !!gasEstimate) this.setState({ gasEstimate });
    });
  }

  submitForm() {
    const { marketId, migrateMarketThroughFork } = this.props;
    migrateMarketThroughFork(marketId, false, (err, res) => {
      console.log("onSuccess for migrateMarketThroughFork", err, res);
    });
  }

  render() {
    const { closeModal, marketDescription, type } = this.props;
    const { gasEstimate } = this.state;
    const reviewDetails = {
      title: "Migrate Market",
      type,
      items: [
        {
          label: "Market",
          value: marketDescription,
          denomination: "",
        },
        {
          label: "gas",
          value: formatEther(Number(gasEstimate)).fullPrecision,
          denomination: "ETH",
        },
      ],
      buttons: [
        {
          label: "back",
          action: closeModal,
          type: "gray",
        },
        {
          label: "submit",
          action: this.submitForm,
          type: "purple",
        },
      ],
    };
    return (
      <section className={Styles.ModalContainer}>
        <ModalReview {...reviewDetails} />
      </section>
    );
  }
}
