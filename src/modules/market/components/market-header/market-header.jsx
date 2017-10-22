import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'

import { ChevronLeft, ChevronDown, ChevronUp } from 'modules/common/components/icons/icons'

import Styles from 'modules/market/components/market-header/market-header.styles'

export default class MarketHeader extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    coreProperties: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.any // NOTE -- There is a PR to handle null values, but until then..
  }

  constructor(props) {
    super(props)

    this.state = {
      animationSpeed: parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-normal'), 10),
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
            <button
              className={Styles[`MarketHeader__back-button`]}
              onClick={() => history.goBack()}
            >
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
            addEndListener={node => (
              node.addEventListener(null, null) // NOTE -- intentional to persist classes
            )}
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
