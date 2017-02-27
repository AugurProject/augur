import React, { PropTypes } from 'react';

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';
import { NEW_MARKET_TYPE, NEW_MARKET_OUTCOMES } from 'modules/create-market/constants/new-market-creation-steps';

const CreateMarketFormType = p => (
  <article className={`create-market-form-part ${p.className || ''}`}>
    <h2>Type</h2>
    <button
      className="unstyled market-type"
      onClick={() => {
        p.addValidationToNewMarket(NEW_MARKET_TYPE);
        p.addValidationToNewMarket(NEW_MARKET_OUTCOMES);
        p.updateNewMarket({
          currentStep: 1,
          type: BINARY
        });
      }}
    >
      <h3>Yes/No</h3>
      <span className="market-type-description">
        Ask a question that has a simple <strong>YES</strong> or <strong>NO</strong> outcome.
      </span>
    </button>
    <button
      className="unstyled market-type"
      onClick={() => {
        p.addValidationToNewMarket(NEW_MARKET_TYPE);
        p.updateNewMarket({
          currentStep: 1,
          type: CATEGORICAL
        });
      }}
    >
      <h3>Multiple Choice</h3>
      <span className="market-type-description">
        Ask a question and provide a set of potential outcomes.
      </span>
    </button>
    <button
      className="unstyled market-type"
      onClick={() => {
        p.addValidationToNewMarket(NEW_MARKET_TYPE);
        p.updateNewMarket({
          currentStep: 1,
          type: SCALAR
        });
      }}
    >
      <h3>Numerical</h3>
      <span className="market-type-description">
        Ask a question that has an outcome within a range of numbers.
      </span>
    </button>
  </article>
);

CreateMarketFormType.propTypes = {
  type: PropTypes.string,
  updateNewMarket: PropTypes.func.isRequired
};

CreateMarketFormType.defaultProps = {
  type: null
};

export default CreateMarketFormType;
