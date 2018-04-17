import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import toggleHeight from 'utils/toggle-height/toggle-height'

import { ChevronLeft, ChevronDown, ChevronUp } from 'modules/common/components/icons'

import { CATEGORICAL } from 'modules/markets/constants/market-types'

import Styles from 'modules/market/components/market-header/market-header.styles'
import ToggleHeightStyles from 'utils/toggle-height/toggle-height.styles'

export default class MarketHeader extends Component {
  static propTypes = {
    clearSelectedOutcome: PropTypes.func,
    coreProperties: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    marketType: PropTypes.string,
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
      coreProperties,
      description,
      details,
      history,
      marketType,
      resolutionSource,
      selectedOutcome,
    } = this.props
    const s = this.state

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
          <h1 className={Styles.MarketHeader__description}>
            {description}
          </h1>
          <div className={Styles.MarketHeader__properties}>
            {!!coreProperties &&
              Object.keys(coreProperties).map(property => (
                <div
                  key={property}
                  className={Styles.MarketHeader__property}
                >
                  <span>{property}</span>
                  <span>{coreProperties[property]}</span>
                </div>
              ))
            }
          </div>
        </div>
        <div className={Styles[`MarketHeader__details-wrapper`]}>
          <button
            className={Styles[`MarketHeader__details-button`]}
            onClick={() => toggleHeight(this.marketDetails, s.areMarketDetailsVisible, () => this.setState({ areMarketDetailsVisible: !s.areMarketDetailsVisible }))}
          >
            additional details {s.areMarketDetailsVisible ? <ChevronUp /> : <ChevronDown />}
          </button>
          <div
            ref={(marketDetails) => { this.marketDetails = marketDetails }}
            className={classNames(Styles[`MarketHeader__details-container`], ToggleHeightStyles['toggle-height-target'])}
          >
            {details != null &&
              <div
                className={Styles.MarketHeader__details}
              >
                <span>
                  {details}
                </span>
              </div>
            }
            <div
              className={Styles[`MarketHeader__resolution-source`]}
            >
              <h4>Resolution Source:</h4>
              <span>{resolutionSource || 'Outcome will be determined by news media'}</span>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
