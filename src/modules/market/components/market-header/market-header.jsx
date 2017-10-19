import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ChevronLeft, ChevronDown, ChevronUp } from 'modules/common/components/icons/icons'

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
      detailsExpanded: false
    }
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section>
        <div>
          {p.selectedOutcome === null ?
            <span>{ChevronLeft} back to list</span> :
            <span>{ChevronLeft} view all outcomes</span>
          }
        </div>
        <div>
          <span>{p.description}</span>
          {!!p.coreProperties &&
            Object.keys(p.coreProperties).map(property => (
              <div>
                <span>{property}</span>
                <span>{p.coreProperties[property]}</span>
              </div>
            ))
          }
        </div>
        <div>
          <button>additional details {s.detailsExpanded ? ChevronUp : ChevronDown}</button>
        </div>
      </section>
    )
  }
}
