import React from 'react'
import PropTypes from 'prop-types'

import BinaryIcon from 'modules/common/components/binary-icon'
import CategoricalIcon from 'modules/common/components/categorical-icon'
import ScalarIcon from 'modules/common/components/scalar-icon'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { NEW_MARKET_TYPE, NEW_MARKET_OUTCOMES } from 'modules/create-market/constants/new-market-creation-steps'

const CreateMarketFormType = p => (
  <article className={`create-market-form-part create-market-form-type ${p.className || ''}`}>
    <div className="create-market-type-buttons">
      <button
        className="unstyled market-type"
        onClick={() => {
          p.addValidationToNewMarket(NEW_MARKET_TYPE)
          p.addValidationToNewMarket(NEW_MARKET_OUTCOMES)
          p.updateNewMarket({
            currentStep: 1,
            type: BINARY,
            outcomes: ['Yes'], // Not Shown, but required for order book population
            scalarSmallNum: '',
            scalarBigNum: '',
            orderBook: {},
            orderBookSorted: {},
            orderBookSeries: {}
          })
        }}
      >
        <BinaryIcon />
        <h3>Yes/No</h3>
        <span className="market-type-description">
          Ask a question that has a simple <strong>YES</strong> or <strong>NO</strong> outcome.
        </span>
      </button>
      <button
        className="unstyled market-type"
        onClick={() => {
          p.addValidationToNewMarket(NEW_MARKET_TYPE)
          p.removeValidationFromNewMarket(NEW_MARKET_OUTCOMES)
          p.updateNewMarket({
            currentStep: 1,
            type: CATEGORICAL,
            outcomes: [],
            scalarSmallNum: '',
            scalarBigNum: '',
            orderBook: {},
            orderBookSorted: {},
            orderBookSeries: {}
          })
        }}
      >
        <CategoricalIcon />
        <h3>Multiple Choice</h3>
        <span className="market-type-description">
          Ask a question and provide a set of potential outcomes.
        </span>
      </button>
      <button
        className="unstyled market-type"
        onClick={() => {
          p.addValidationToNewMarket(NEW_MARKET_TYPE)
          p.removeValidationFromNewMarket(NEW_MARKET_OUTCOMES)
          p.updateNewMarket({
            currentStep: 1,
            type: SCALAR,
            outcomes: [],
            scalarSmallNum: '',
            scalarBigNum: '',
            orderBook: {},
            orderBookSorted: {},
            orderBookSeries: {}
          })
        }}
      >
        <ScalarIcon />
        <h3>Numerical Range</h3>
        <span className="market-type-description">
          Ask a question that has an outcome within a range of numbers.
        </span>
      </button>
    </div>
  </article>
)

CreateMarketFormType.propTypes = {
  type: PropTypes.string.isRequired,
  addValidationToNewMarket: PropTypes.func.isRequired,
  removeValidationFromNewMarket: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
}

export default CreateMarketFormType
