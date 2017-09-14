import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Input from 'modules/common/components/input/input'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import { NEW_MARKET_EXPIRY_SOURCE } from 'modules/create-market/constants/new-market-creation-steps'
import { EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC } from 'modules/create-market/constants/new-market-constraints'

export default class CreateMarketFormExpirySource extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    expirySourceType: PropTypes.string.isRequired,
    expirySource: PropTypes.string.isRequired,
    updateValidity: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.validateForm = this.validateForm.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep && nextProps.currentStep === newMarketCreationOrder.indexOf[NEW_MARKET_EXPIRY_SOURCE]) this.validateForm(nextProps.expirySourceType, nextProps.expirySource)
  }

  validateForm(expirySourceType, expirySource = '') {
    if (expirySourceType === EXPIRY_SOURCE_SPECIFIC && expirySource === '') {
      this.props.updateValidity(false)
    } else {
      this.props.updateValidity(true)
    }

    this.props.updateNewMarket({
      expirySourceType,
      expirySource
    })
  }

  render() {
    const p = this.props

    return (
      <article className={`create-market-form-part create-market-form-part-expiry-source ${p.className || ''}`}>
        <div className="create-market-form-part-content">
          <div className="create-market-form-part-input">
            <aside>
              <h3>Expiration Source</h3>
              <span>Where will reporters and traders be able to learn more details about the resolution of this market?</span>
            </aside>
            <div className="vertical-form-divider" />
            <form onSubmit={e => e.preventDefault()} >
              <label htmlFor="expiry_generic">
                <input
                  id="expiry_generic"
                  value={EXPIRY_SOURCE_GENERIC}
                  type="radio"
                  checked={p.expirySourceType === EXPIRY_SOURCE_GENERIC}
                  onChange={() => {
                    this.validateForm(EXPIRY_SOURCE_GENERIC)
                  }}
                />
                Outcome will be covered by local, national or international news media.
              </label>
              <label htmlFor="expiry_specific">
                <input
                  id="expiry_specific"
                  value={EXPIRY_SOURCE_SPECIFIC}
                  type="radio"
                  checked={p.expirySourceType === EXPIRY_SOURCE_SPECIFIC}
                  onChange={() => {
                    this.validateForm(EXPIRY_SOURCE_SPECIFIC)
                  }}
                />
                Outcome will be detailed on a specific publicly available website:
              </label>
              <Input
                className={classNames({ 'hide-field': p.expirySourceType !== EXPIRY_SOURCE_SPECIFIC })}
                type="text"
                debounceMS={0}
                value={p.expirySource}
                onChange={(expirySource) => {
                  this.validateForm(EXPIRY_SOURCE_SPECIFIC, expirySource)
                }}
              />
            </form>
          </div>
        </div>
      </article>
    )
  }
}
