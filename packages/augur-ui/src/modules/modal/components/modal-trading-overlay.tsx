import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import MarketOutcomesList from "modules/market/containers/market-outcomes-list";
import { Close } from "modules/common/components/icons";

import Styles from "modules/modal/components/common/common.styles";

export default class ModalTradingOverlay extends Component {
  static propTypes = {
    marketId: PropTypes.string.isRequired,
    market: PropTypes.object.isRequired,
    selectedOrderProperties: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.string,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
    updateSelectedOutcome: PropTypes.func.isRequired,
    outcomes: PropTypes.array,
    closeModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    outcomes: [],
    selectedOutcome: null
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
      market,
      selectedOrderProperties,
      selectedOutcome,
      updateSelectedOutcome,
      updateSelectedOrderProperties,
    } = this.props;

    return (
      <section
        className={classNames(
          Styles.ModalContainer,
          Styles.ModalContainer__full
        )}
      >
        <section>
          <div className={Styles.Modal__overlayHeader}>
            <span role="button" tabIndex="-1" onClick={closeModal}>
              {Close}
            </span>
            <div>Select an Outcome</div>
          </div>
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
