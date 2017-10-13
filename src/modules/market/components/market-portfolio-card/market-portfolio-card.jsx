import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import getValue from 'utils/get-value'

import MarketStatusIcon from 'modules/market/components/common/market-status-icon/market-status-icon'
import MarketTable from 'modules/market/components/market-tables/market-tables'
import CaretDropdown from 'modules/common/components/caret-dropdown/caret-dropdown'

import CommonStyles from 'modules/market/components/common/market-common.styles'
import Styles from 'modules/market/components/market-portfolio-card/market-portfolio-card.styles'

export default class MarketPortfolioCard extends React.Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    isTradeCommitLocked: PropTypes.bool,
    closePositionStatus: PropTypes.object.isRequired,
    scalarShareDenomination: PropTypes.object.isRequired,
    orderCancellation: PropTypes.object.isRequired,
    orderData: PropTypes.object.isRequired,
    positionData: PropTypes.object.isRequired
  };
  constructor() {
    super()
    this.state = {
      tableOpen: {
        myPositions: true,
        openOrders: false
      }
    }
  }

  toggleTable(tableKey) {
    this.setState({ tableOpen: { ...this.state.tableOpen, [tableKey]: !this.state.tableOpen[tableKey] } })
  }

  render() {
    const myPositionsSummary = getValue(this.props, 'market.myPositionsSummary')
    const myPositionOutcomes = getValue(this.props, 'market.myPositionOutcomes')

    return (
      <article className={CommonStyles.MarketCommon__container}>
        <section
          className={classNames(
            CommonStyles.MarketCommon__topcontent,
            Styles.MarketCard__topcontent
          )}
        >
          <div
            className={classNames(
              CommonStyles.MarketCommon__header,
              Styles.MarketCard__header
            )}
          >
            <div className={Styles.MarketCard__headertext}>
              <span className={Styles['MarketCard__expiration--mobile']}>
                Expires June 31, 2017 7:00 AM
              </span>
              <h1 className={CommonStyles.MarketCommon__description}>
                {this.props.market.description}
              </h1>
            </div>
            <MarketStatusIcon className={Styles.MarketCard__statusicon} isOpen isReported />
          </div>
          <div className={Styles.MarketCard__topstats}>
            <div className={Styles.MarketCard__leftstats}>
              <div className={Styles.MarketCard__stat}>
                <span className={Styles.MarketCard__statlabel}>
                  Realized P/L
                </span>
                <span className={Styles.MarketCard__statvalue}>
                  {getValue(myPositionsSummary, 'realizedNet.formatted')}
                </span>
                <span className={Styles.MarketCard__statunit}>
                  ETH
                </span>
              </div>
              <div className={Styles.MarketCard__stat}>
                <span className={Styles.MarketCard__statlabel}>
                  Unrealized P/L
                </span>
                <span className={Styles.MarketCard__statvalue}>
                  {getValue(myPositionsSummary, 'unrealizedNet.formatted')}
                </span>
                <span className={Styles.MarketCard__statunit}>
                  ETH
                </span>
              </div>
              <div className={Styles.MarketCard__stat}>
                <span className={Styles.MarketCard__statlabel}>
                  Total P/L
                </span>
                <span className={Styles.MarketCard__statvalue}>
                  {getValue(myPositionsSummary, 'totalNet.formatted')}
                </span>
                <span className={Styles.MarketCard__statunit}>
                  ETH
                </span>
              </div>
            </div>
            <span className={Styles.MarketCard__expiration}>
              <span className={Styles.MarketCard__expirationlabel}>
                {this.props.market.endDateLabel}
              </span>
              <span className={Styles.MarketCard__expirationvalue}>
                {getValue(this.props.market, 'endDate.formatted')}
              </span>
            </span>
          </div>
        </section>
        <section className={Styles.MarketCard__tablesection}>
          <div className={Styles.MarketCard__headingcontainer}>
            <h1 className={Styles.MarketCard__tableheading}>
              My Positions
            </h1>
            <button
              className={Styles.MarketCard__tabletoggle}
              onClick={() => this.toggleTable('myPositions')}
            >
              <CaretDropdown flipped={this.state.tableOpen.myPositions} />
            </button>
          </div>
          {this.state.tableOpen.myPositions &&
            <MarketTable
              titleKeyPairs={[
                ['Outcome', 'name'],
                ['Quantity', 'qtyShares.formatted'],
                ['Avg Price', 'purchasePrice.formatted'],
                ['Last Price', 'lastPrice.formatted'],
                ['Realized P/L', 'realizedNet.formatted'],
                ['Unrealized P/L', 'unrealizedNet.formatted'],
                ['Total P/L', 'totalNet.formatted'],
                ['Action', 'dialogButton']
              ]}
              mobileTitles={[
                'Outcome',
                'Qty',
                null,
                'Last',
                null,
                null,
                'Total P/L',
                'Action'
              ]}
              data={
                (myPositionOutcomes || []).map(outcome => ({
                  ...outcome,
                  ...outcome.position,
                  dialogButton: {
                    label: 'Close',
                    dialogText: `Close position by selling ${outcome.position.qtyShares.formatted}
                                 shares of ${outcome.name} at ${outcome.position.purchasePrice.formatted} ETH?`,
                    confirm: outcome.position.closePosition
                  }
                }))
              }
            />
          }
          <div className={Styles.MarketCard__headingcontainer}>
            <h1 className={Styles.MarketCard__tableheading}>
              Open Orders
            </h1>
            <button
              className={Styles.MarketCard__tabletoggle}
              onClick={() => this.toggleTable('openOrders')}
            >
              <CaretDropdown flipped={this.state.tableOpen.openOrders} />
            </button>
          </div>
          {this.state.tableOpen.openOrders &&
            <MarketTable
              hideTitles
              titleKeyPairs={[
                ['Outcome', 'name'],
                ['Quantity', 'unmatchedShares.formatted'],
                ['Avg Price', 'avgPrice.formatted'],
                ['Last Price', null],
                ['Realized P/L', null],
                ['Unrealized P/L', null],
                ['Total P/L', null],
                ['Action', 'dialogButton']
              ]}
              mobileTitles={[
                'Outcome',
                'Qty',
                null,
                'Last',
                null,
                null,
                'Total P/L',
                'Action'
              ]}
              data={
                this.props.market.outcomes.reduce((accumulator, outcome) => {
                  const tempAccumulator = accumulator || []

                  outcome.userOpenOrders.forEach(order => tempAccumulator.push({
                    ...order,
                    name: outcome.name,
                    dialogButton: {
                      label: 'Close',
                      dialogText: `Cancel order of ${order.unmatchedShares.formatted}
                                   shares of ${outcome.name} at ${order.purchasePrice.formatted} ETH?`,
                      confirm: outcome.position.closePosition
                    }
                  }))

                  return tempAccumulator
                })
              }
            />
          }
        </section>
      </article>
    )
  }
}
