import React from 'react'
import PropTypes from 'prop-types'

import EmDash from 'modules/common/components/em-dash'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

const CreateMarketMainTitle = (p) => {
  const initialTitleClass = () => {
    if (p.currentStep === 0) {
      if (p.validations.length) {
        return 'display-title'
      }

      return ''
    }

    return 'hide-title'
  }

  const previewTitleClass = () => {
    if (p.currentStep === 0) {
      if (p.validations.length) {
        return 'hide-title'
      }

      return ''
    }

    return 'display-title'
  }

  const marketType = () => {
    switch (p.type) {
      case BINARY:
        return 'Yes/No'
      case CATEGORICAL:
        return 'Multiple Choice'
      case SCALAR:
        return 'Numerical'
      default:
        return ''
    }
  }

  return (
    <article className="create-market-main-title">
      <h1 className={`title-animation-helper ${previewTitleClass()}`}>{}</h1>
      <h1 className={`initial-title ${initialTitleClass()}`}>Create Market</h1>
      <button
        className="unstyled"
        onClick={() => p.updateNewMarket({ currentStep: 0 })}
      >
        <h1 className={`preview-title ${previewTitleClass()}`}>
          Market Preview <EmDash /> {marketType()}
        </h1>
      </button>
      <button
        className={`unstyled clear-new-market ${previewTitleClass()}`}
        onClick={() => p.clearNewMarket()}
      >
        Clear New Market
      </button>
    </article>
  )
}

CreateMarketMainTitle.propTypes = {
  type: PropTypes.string.isRequired,
  currentStep: PropTypes.number.isRequired,
  clearNewMarket: PropTypes.func.isRequired
}

export default CreateMarketMainTitle
