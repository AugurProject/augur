import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import toggleHeight from 'utils/toggle-height/toggle-height'

import { ChevronLeft, ChevronDown, ChevronUp } from 'modules/common/components/icons'

import Styles from 'modules/market/components/market-header/market-header.styles'
import ToggleHeightStyles from 'utils/toggle-height/toggle-height.styles'

export default class MarketHeader extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    coreProperties: PropTypes.object.isRequired,
    resolutionSource: PropTypes.any,
    selectedOutcomes: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.state = {
      areMarketDetailsVisible: false
    }
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section className={Styles.MarketHeader}>
        <div className={Styles.MarketHeader__nav}>
          {p.selectedOutcomes.length === 0 ?
            <button
              className={Styles[`MarketHeader__back-button`]}
              onClick={() => p.history.goBack()}
            >
              {ChevronLeft}<span> back</span>
            </button> :
            <button
              className={Styles[`MarketHeader__back-button`]}
              onClick={() => p.clearSelectedOutcomes()}
            >
              {ChevronLeft}<span> view all outcomes</span>
            </button>
          }
        </div>
        <div className={Styles[`MarketHeader__main-values`]}>
          <h1 className={Styles.MarketHeader__description}>
            {p.description}
          </h1>
          <div className={Styles.MarketHeader__properties}>
            {!!p.coreProperties &&
              Object.keys(p.coreProperties).map(property => (
                <div
                  key={property}
                  className={Styles.MarketHeader__property}
                >
                  <span>{property}</span>
                  <span>{p.coreProperties[property]}</span>
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
            {p.details != null &&
              <div
                className={Styles.MarketHeader__details}
              >
                <span>
                  {p.details}
                </span>
              </div>
            }
            <div
              className={Styles[`MarketHeader__resolution-source`]}
            >
              <h4>Resolution Source:</h4>
              <span>{p.resolutionSource || 'Outcome will be determined by news media'}</span>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
