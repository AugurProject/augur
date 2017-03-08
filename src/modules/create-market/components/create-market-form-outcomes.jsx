import React, { PropTypes } from 'react';

import CreateMarketFormOutcomesCategorical from 'modules/create-market/components/create-market-form-outcomes-categorical';
import CreateMarketFormOutcomesScalar from 'modules/create-market/components/create-market-form-outcomes-scalar';

import { CATEGORICAL } from 'modules/markets/constants/market-types';


const CreateMarketFormOutcomes = p => (
  <article className={`create-market-form-part ${p.className || ''}`}>
    {p.type === CATEGORICAL ?
      <CreateMarketFormOutcomesCategorical
        currentStep={p.currentStep}
        outcomes={p.outcomes}
        updateValidity={p.updateValidity}
        updateNewMarket={p.updateNewMarket}
      /> :
      <CreateMarketFormOutcomesScalar
        currentStep={p.currentStep}
        scalarBigNum={p.scalarBigNum}
        scalarSmallNum={p.scalarSmallNum}
        updateNewMarket={p.updateNewMarket}
      />
    }
  </article>
);

CreateMarketFormOutcomes.propTypes = {
  type: PropTypes.string.isRequired,
  outcomes: PropTypes.array.isRequired,
  scalarSmallNum: PropTypes.string.isRequired,
  scalarBigNum: PropTypes.string.isRequired,
  currentStep: PropTypes.number.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};

export default CreateMarketFormOutcomes;
