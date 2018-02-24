import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import CaretDropdown from 'modules/common/components/caret-dropdown/caret-dropdown'
import Styles from 'modules/market/components/market-additional-details/market-additional-details.styles'

export default class MarketAdditionalDetails extends Component {

  static propTypes = {
    showDetails: PropTypes.bool.isRequired,
    details: PropTypes.string,
    resolutionSource: PropTypes.any,
  }

  constructor(props) {
    super(props)

    this.state = {
      areMarketDetailsVisible: true
    }
  }

  toggleTable(value) {
    this.setState({ areMarketDetailsVisible: !this.state.areMarketDetailsVisible })
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <div className={Styles[`MarketAdditional__details-wrapper`]}>
        <div>
          additional details
          <button
            className={Styles[`MarketAdditional__details-button`]}
            onClick={() => this.toggleTable()}
          >
            <CaretDropdown flipped={s.areMarketDetailsVisible} />
          </button>
        </div>
        <div
          ref={(marketDetails) => { this.marketDetails = marketDetails }}
          className={classNames(Styles[`MarketAdditional__details-container`])}
        >
          { p.details != null && s.areMarketDetailsVisible &&
            <div>
              <div
                className={Styles.MarketAdditional__details}
              >
                <span>
                  {p.details}
                </span>
              </div>
              <div
                className={Styles[`MarketAdditional__resolution-source`]}
              >
                <h4>Resolution Source:</h4>
                <span>{p.resolutionSource || 'Outcome will be determined by news media'}</span>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}
