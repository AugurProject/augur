import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import MarketOutcomesList from "modules/market/containers/market-outcomes-list";
import { Close } from "modules/common/components/icons";

import Styles from "modules/modal/components/common/common.styles.less";

interface ModalTradingOverlayProps {
  marketId: string;
  market: object;
  selectedOrderProperties: object;
  selectedOutcome?: string;
  updateSelectedOrderProperties: Function;
  updateSelectedOutcome: Function;
  outcomes?: Array<any>;
  closeModal: Function;
}

export default class ModalTradingOverlay extends Component<ModalTradingOverlayProps> {
  static defaultProps = {
    outcomes: [],
    selectedOutcome: null,
  };

  constructor(props) {
    super(props);

    this.updateSelectedOutcome = this.updateSelectedOutcome.bind(this);
  }

  updateSelectedOutcome(outcome) {
    this.props.closeModal();
    this.props.updateSelectedOutcome(outcome);
  }

  render() {
    const {
      closeModal,
      marketId,
      outcomes,
      selectedOutcome,
    } = this.props;

    return (
      <section
        className={classNames(
          Styles.ModalContainer,
          Styles.ModalContainer__full,
        )}
      >
        <section>
          <div className={Styles.Modal__overlayHeader}>
            // @ts-ignore
            <span role="button" tabIndex={-1} onClick={closeModal}>
              {Close}
            </span>
            <div>Select an Outcome</div>
          </div>
          // @ts-ignore
          <MarketOutcomesList
            marketId={marketId}
            outcomes={outcomes}
            selectedOutcome={selectedOutcome}
            updateSelectedOutcome={this.updateSelectedOutcome}
            popUp
          />
        </section>
      </section>
    );
  }
}
