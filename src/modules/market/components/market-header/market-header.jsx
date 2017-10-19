import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ChevronLeft, ChevronDown, ChevronUp } from 'modules/common/components/icons/icons'

export default class MarketHeader extends Component {
  static propTypes = {
    description: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    coreProperties: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      detailsExpanded: false
    }
  }

  render() {

    console.log('props -- ', this.props)

    const s = this.state
    const p = this.props

    return (
      <section>
        <div>
          <span>{ChevronLeft} back to list</span>
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
