import React from 'react'
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'

import CreateMarketFormOutcomesCategorical from 'modules/create-market/components/create-market-form-outcomes-categorical'
import CreateMarketFormOutcomesScalar from 'modules/create-market/components/create-market-form-outcomes-scalar'

import { CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'


const CreateMarketFormOutcomes = p => (
  <article className={`create-market-form-part ${p.className || ''}`}>
    {p.type === CATEGORICAL &&
      <CreateMarketFormOutcomesCategorical
        currentStep={p.currentStep}
        outcomes={p.outcomes}
        updateValidity={p.updateValidity}
        updateNewMarket={p.updateNewMarket}
      />
    }
    {p.type === SCALAR &&
      <CreateMarketFormOutcomesScalar
        currentStep={p.currentStep}
        scalarSmallNum={p.scalarSmallNum}
        scalarBigNum={p.scalarBigNum}
        updateValidity={p.updateValidity}
        updateNewMarket={p.updateNewMarket}
      />
    }
  </article>
)

CreateMarketFormOutcomes.propTypes = {
  type: PropTypes.string.isRequired,
  outcomes: PropTypes.array.isRequired,
  scalarSmallNum: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(BigNumber)
  ]).isRequired,
  scalarBigNum: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(BigNumber)
  ]).isRequired,
  currentStep: PropTypes.number.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
}

export default CreateMarketFormOutcomes
