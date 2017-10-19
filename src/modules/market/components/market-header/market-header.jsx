import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'

import { ChevronLeft, ChevronDown, ChevronUp } from 'modules/common/components/icons/icons'

import Styles from 'modules/market/components/market-header/market-header.styles'

export default class MarketHeader extends Component {
  static propTypes = {
    description: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    coreProperties: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.any // FIXME -- There is a PR to handle null values, but until then..
  }

  constructor(props) {
    super(props)

    this.state = {
      animationSpeed: parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-fast'), 10),
      detailsExpanded: false
    }
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section className={Styles.MarketHeader}>
        <div className={Styles.MarketHeader__nav}>
          {p.selectedOutcome === null ?
            <button className={Styles[`MarketHeader__back-button`]}>
              {ChevronLeft}<span> back to list</span>
            </button> :
            <button className={Styles[`MarketHeader__back-button`]}>
              {ChevronLeft}<span> view all outcomes</span>
            </button>
          }
        </div>
        <div className={Styles[`MarketHeader__main-values`]}>
          <span className={Styles.MarketHeader__description}>
            {p.description}
          </span>
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
            onClick={() => this.setState({ detailsExpanded: !s.detailsExpanded })}
          >
            additional details {s.detailsExpanded ? ChevronUp : ChevronDown}
          </button>
          <CSSTransition
            in={s.detailsExpanded}
            classNames="market-details"
          >
            <div className={Styles.MarketHeader__details}>
              <span>{p.details}</span>
            </div>
          </CSSTransition>
        </div>
      </section>
    )
  }
}
