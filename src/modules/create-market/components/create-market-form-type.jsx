import React from 'react';

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';

const CreateMarketFormType = p => (
  <article className={`create-market-form-part ${p.className || ''}`}>
    <h2>Market Type</h2>
    <button
      className="unstyled market-type"
      onClick={() => {
        console.log('p -- ', p);
        p.updateNewMarket({ type: BINARY });
        p.progressToNextStep();
      }}
    >
      <h3>Yes/No</h3>
      <span className="market-type-description">
        Ask a question that has a simple <strong>YES</strong> or <strong>NO</strong> outcome.
      </span>
    </button>
    <button
      className="unstyled market-type"
      onClick={() => p.updateNewMarket({
        step: 2,
        type: CATEGORICAL
      })}
    >
      <h3>Multiple Choice</h3>
      <span className="market-type-description">
        Ask a question and provide a set of potential outcomes.
      </span>
    </button>
    <button
      className="unstyled market-type"
      onClick={() => p.updateNewMarket({
        step: 2,
        type: SCALAR
      })}
    >
      <h3>Numerical</h3>
      <span className="market-type-description">
        Ask a question that has an outcome within a range of numbers.
      </span>
    </button>
  </article>
);

export default CreateMarketFormType;
