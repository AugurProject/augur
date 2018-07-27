import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { SCALAR } from 'modules/markets/constants/market-types'

import toggleHeight from 'utils/toggle-height/toggle-height'

import { ChevronLeft, ChevronDown, ChevronUp, Hint } from 'modules/common/components/icons'

import { CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { BigNumber } from 'bignumber.js'
import Styles from 'modules/market/components/market-header/market-header.styles'
import ToggleHeightStyles from 'utils/toggle-height/toggle-height.styles'
import ReactTooltip from 'react-tooltip'
import TooltipStyles from 'modules/common/less/tooltip'

export default class MarketHeader extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    currentTimestamp: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {
      market,
      currentTimestamo
    } = this.props
    return (
      {!!coreProperties &&
        Object.keys(coreProperties).map(property => (
          coreProperties[property].value !== null &&
          <div
            key={property}
            className={classNames(
              Styles.MarketHeader__property,
              {
                [Styles['MarketHeader__scalar-property']]: (marketType === SCALAR),
              },
            )}
          >
            <span className={Styles[`MarketHeader__property-name`]}>
              <div>
                {property}
              </div>
              {coreProperties[property].tooltip &&
                <div>
                  <label
                    className={classNames(TooltipStyles.TooltipHint, Styles['MarketHeader__property-tooltip'])}
                    data-tip
                    data-for="tooltip--market-fees"
                  >
                    { Hint }
                  </label>
                  <ReactTooltip
                    id="tooltip--market-fees"
                    className={TooltipStyles.Tooltip}
                    effect="solid"
                    place="bottom"
                    type="light"
                  >
                    <h4>{coreProperties[property].tooltipHeader}</h4>
                    <p>
                      The trading settlement fee is a combination of the Market Creator Fee (<b>{coreProperties[property].marketCreatorFee}</b>) and the Reporting Fee (<b>{coreProperties[property].reportingFee}</b>)
                    </p>
                  </ReactTooltip>
                </div>
              }
            </span>
            <span>{coreProperties[property].value}</span>
          </div>
        ))
      }     
    )
  }
}
