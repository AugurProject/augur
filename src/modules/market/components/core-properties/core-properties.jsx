import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { SCALAR } from 'modules/markets/constants/market-types'

import Styles from 'modules/market/components/core-properties/core-properties.styles'
import ReactTooltip from 'react-tooltip'
import TooltipStyles from 'modules/common/less/tooltip'

import getValue from 'utils/get-value'
import { dateHasPassed } from 'utils/format-date'
import { constants } from 'services/augurjs'
import { Hint } from 'modules/common/components/icons'

export default class CoreProperties extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    currentTimestamp: PropTypes.number.isRequired,
  }

  determinePhase() {
    const { reportingState } = this.props.market
    switch (reportingState) {

      case constants.REPORTING_STATE.PRE_REPORTING:
        return 'Open'

      case constants.REPORTING_STATE.DESIGNATED_REPORTING:
      case constants.REPORTING_STATE.OPEN_REPORTING:
      case constants.REPORTING_STATE.CROWDSOURCING_DISPUTE:
      case constants.REPORTING_STATE.AWAITING_NEXT_WINDOW:
        return 'Reporting'

      case constants.REPORTING_STATE.AWAITING_FINALIZATION:
      case constants.REPORTING_STATE.FINALIZED:
        return 'Resolved'

      case constants.FORKING:
        return 'Forking'

      case constants.REPORTING_STATE.AWAITING_NO_REPORT_MIGRATIO:
        return 'Awaiting No Report Migrated'

      case constants.REPORTING_STATE.AWAITING_FORK_MIGRATION:
        return 'Awaiting Fork Migration'

      default:
        return ''
    }
  }

  render() {
    const {
      market,
      currentTimestamp,
    } = this.props

    const volume = getValue(market, 'volume.full')
    const fee = getValue(market, 'settlementFeePercent.full')
    const marketCreatorFee = getValue(market, 'marketCreatorFeeRatePercent.full')
    const reportingFee = getValue(market, 'reportingFeeRatePercent.full')
    const endTime = getValue(market, 'endTime.formattedLocal')
    const expires = dateHasPassed(currentTimestamp, getValue(market, 'endTime.timestamp')) ? 'expired' : 'expires'
    const min = market.marketType === SCALAR ? getValue(market, 'minPrice').toString() : null
    const max = market.marketType === SCALAR ? getValue(market, 'maxPrice').toString() : null
    const phase = this.determinePhase()
    const creationTime = getValue(market, 'creationTime.formattedLocal')
    const isScalar = market.marketType === SCALAR
    const consensus = getValue(market, isScalar ? 'consensus.winningOutcome' : 'consensus.outcomeName')

    return (
      <div className={Styles.CoreProperties__coreContainer}>
        {consensus &&
          <div className={Styles.CoreProperties__row}>
            <div className={Styles.CoreProperties__property}>
              <span className={Styles[`CoreProperties__property-name`]}>
                <div>
                  Winning Outcome:
                </div>
              </span>
              <span className={Styles[`CoreProperties__property-winningOutcome`]}>{consensus}</span>
            </div>
          </div>
        }
        { consensus &&
          <div className={Styles.CoreProperties__lineBreak} />
        }
        <div className={Styles.CoreProperties__row}>
          <div className={Styles.CoreProperties__property}>
            <span className={Styles[`CoreProperties__property-name`]}>
              <div>
                volume
              </div>
            </span>
            <span>{volume}</span>
          </div>
          <div className={Styles.CoreProperties__property}>
            <span className={Styles[`CoreProperties__property-name`]}>
              <div>
                fee
              </div>
              <div>
                <label
                  className={classNames(TooltipStyles.TooltipHint, Styles['CoreProperties__property-tooltip'])}
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
                  <h4>Trading Settlement Fee</h4>
                  <p>
                    The trading settlement fee is a combination of the Market Creator Fee (<b>{marketCreatorFee}</b>) and the Reporting Fee (<b>{reportingFee}</b>)
                  </p>
                </ReactTooltip>
              </div>
            </span>
            <span>{fee}</span>
          </div>
          <div className={Styles.CoreProperties__property}>
            <span className={Styles[`CoreProperties__property-name`]}>
              <div>
                Phase
              </div>
            </span>
            <span>{phase && phase.toLowerCase()}</span>
          </div>
        </div>
        <div className={Styles.CoreProperties__lineBreak} />
        <div className={Styles.CoreProperties__row}>
          <div className={Styles.CoreProperties__propertySmall}>
            <span className={Styles[`CoreProperties__property-name`]} style={{ minWidth: '210px' }}>
              <div>
                created
              </div>
            </span>
            <span>{creationTime}</span>
          </div>
          <div className={Styles.CoreProperties__propertySmall}>
            <span className={Styles[`CoreProperties__property-name`]}>
              <div>
                Type
              </div>
            </span>
            <span>{market.marketType}</span>
          </div>
          {min &&
            <div className={Styles.CoreProperties__propertySmall}>
              <span className={Styles[`CoreProperties__property-name`]}>
                <div>
                  Min
                </div>
              </span>
              <span>{min}</span>
            </div>
          }
        </div>
        <div className={Styles.CoreProperties__row}>
          <div className={Styles.CoreProperties__propertySmall}>
            <span className={Styles[`CoreProperties__property-name`]} style={{ minWidth: '210px' }}>
              <div>
                {expires}
              </div>
            </span>
            <span>{endTime}</span>
          </div>
          {market.scalarDenomination &&
            <div className={Styles.CoreProperties__propertySmall}>
              <span className={Styles[`CoreProperties__property-name`]}>
                <div>
                  Denominated In
                </div>
              </span>
              <span style={{ textTransform: 'none' }}>{market.scalarDenomination}</span>
            </div>
          }
          {max &&
            <div className={Styles.CoreProperties__propertySmall}>
              <span className={Styles[`CoreProperties__property-name`]}>
                <div>
                  Max
                </div>
              </span>
              <span>{max}</span>
            </div>
          }
        </div>
      </div>
    )
  }
}
