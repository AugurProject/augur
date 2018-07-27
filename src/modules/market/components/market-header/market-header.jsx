import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import toggleHeight from 'utils/toggle-height/toggle-height'

import { ChevronLeft, ChevronDown, ChevronUp, Hint } from 'modules/common/components/icons'

import { CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { BigNumber } from 'bignumber.js'
import Styles from 'modules/market/components/market-header/market-header.styles'
import ToggleHeightStyles from 'utils/toggle-height/toggle-height.styles'
import ReactTooltip from 'react-tooltip'
import TooltipStyles from 'modules/common/less/tooltip'
import CoreProperties from 'modules/market/components/market-header/core-properties'

export default class MarketHeader extends Component {
  static propTypes = {
    clearSelectedOutcome: PropTypes.func,
    description: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    maxPrice: PropTypes.instanceOf(BigNumber).isRequired,
    minPrice: PropTypes.instanceOf(BigNumber).isRequired,
    market: PropTypes.object.isRequired,
    currentTimestamp: PropTypes.number.isRequired,
    marketType: PropTypes.string,
    scalarDenomination: PropTypes.string,
    resolutionSource: PropTypes.any,
    selectedOutcome: PropTypes.any,
  }

  constructor(props) {
    super(props)

    this.state = {
      areMarketDetailsVisible: false,
    }
  }

  render() {
    const {
      clearSelectedOutcome,
      description,
      details,
      history,
      marketType,
      resolutionSource,
      selectedOutcome,
      minPrice,
      maxPrice,
      scalarDenomination,
      market,
      currentTimestamp,
    } = this.props
    const s = this.state
    const detailsPresent = (details != null && details.length > 0) || (marketType === SCALAR)
    const denomination = scalarDenomination ? ' ' + scalarDenomination : ''
    if (this.additionalDetails && this.additionalDetails.scrollHeight) {
      this.additionalDetails.style.height = `${this.additionalDetails.scrollHeight}px`
    }
    return (
      <section className={Styles.MarketHeader}>
        <div className={Styles.MarketHeader__nav}>
          {selectedOutcome !== null && marketType === CATEGORICAL ?
            <button
              className={Styles[`MarketHeader__back-button`]}
              onClick={() => clearSelectedOutcome()}
            >
              {ChevronLeft}<span> view all outcomes</span>
            </button> :
            <button
              className={Styles[`MarketHeader__back-button`]}
              onClick={() => history.goBack()}
            >
              {ChevronLeft}<span> back</span>
            </button>
          }
        </div>
        <div className={Styles[`MarketHeader__main-values`]}>
          <div className={Styles[`MarketHeader__descContainer`]}>
            <h1 className={Styles.MarketHeader__description}>
              {description}
            </h1>
            <div className={Styles.MarketHeader__descriptionContainer}>
              <div className={classNames(Styles[`MarketHeader__details`])} style={{marginBottom: '20px'}}>
                <h4>Resolution Source</h4>
                <span>{resolutionSource || 'General knowledge'}</span>
              </div>
              <div className={classNames(Styles[`MarketHeader__details`])}>
                <h4>Additional Details</h4>
                <textarea
                  ref={(additionalDetails) => { this.additionalDetails = additionalDetails }}
                  className={Styles['MarketHeader__AdditionalDetails-text']}
                  disabled
                  readOnly
                  value={details}
                />
                { marketType === SCALAR &&
                  <span>
                  If the real-world outcome for this market is above this market&#39;s maximum value, the maximum value ({maxPrice.toNumber()}{denomination}) should be reported. If the real-world outcome for this market is below this market&#39;s minimum value, the minimum value ({minPrice.toNumber()}{denomination}) should be reported.
                  </span>
                }
              </div>
            </div>
          </div>
          <div
            className={classNames(
              Styles.MarketHeader__properties,
              {
                [Styles['MarketHeader__scalar-properties']]: (marketType === SCALAR),
              },
            )}
          >
            <CoreProperties market={market} currentTimestamp={currentTimestamp} />
          </div>
        </div>
      </section>
    )
  }
}
