import React, { Component, PropTypes } from 'react';

import Input from 'modules/common/components/input';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import { NEW_MARKET_DETAILS } from 'modules/create-market/constants/new-market-creation-steps';

export default class CreateMarketFormDetails extends Component {
  componentWillReceiveProps(nextProps) {
    // Optional step -- update validity to true by default
    if (this.props.currentStep !== nextProps.currentStep &&
        newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_DETAILS
    ) {
      nextProps.updateValidity(true);
    }
  }

  render() {
    const p = this.props;

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        <h2>Additional Details</h2>
        <Input
          type="text"
          value={p.detailsText}
          onChange={detailsText => p.updateNewMarket({ detailsText })}
        />
      </article>
    );
  }
}

CreateMarketFormDetails.propTypes = {
  currentStep: PropTypes.number.isRequired,
  detailsText: PropTypes.string.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};
