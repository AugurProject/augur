import React from 'react'
import classNames from 'classnames'

import MarketStatusIcon from 'modules/market/components/common/market-status-icon/market-status-icon'
import MarketTable from 'modules/market/components/market-tables/market-tables'
import CaretDropdown from 'modules/common/components/caret-dropdown/caret-dropdown'

import CommonStyles from 'modules/market/components/common/market-common.styles'
import Styles from 'modules/market/components/market-card/market-card.styles'

export default class MarketCard extends React.Component {
  constructor() {
    super()
    this.state = {
      tableOpen: {
        myPositions: true,
        openPositions: false
      }
    }
  }

  toggleTable(tableKey) {
    this.setState({ tableOpen: { ...this.state.tableOpen, [tableKey]: !this.state.tableOpen[tableKey] } })
  }

  render() {
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
                Market Title
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
                  0
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
                  0
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
                  0
                </span>
                <span className={Styles.MarketCard__statunit}>
                  ETH
                </span>
              </div>
            </div>
            <span className={Styles.MarketCard__expiration}>
              <span className={Styles.MarketCard__expirationlabel}>
                Expires
              </span>
              <span className={Styles.MarketCard__expirationvalue}>
                June 31, 2017 7:00 AM
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
              titles={[
                'Outcome',
                'Quantity',
                'Last Price',
                'Realized P/L',
                'Unrealized P/L',
                'Total P/L',
                'Action'
              ]}
              mobileTitles={[
                'Outcome',
                'Qty',
                'Last',
                null,
                null,
                'Total P/L',
                'Action'
              ]}
              data={[
                [
                  'Hong Kong',
                  '10',
                  '10',
                  '20',
                  '129',
                  '129',
                  'Close',
                ],
                [
                  'Hong Kong',
                  '10',
                  '10',
                  '20',
                  '129',
                  '129',
                  'Close',
                ]
              ]}
            />
          }
          <div className={Styles.MarketCard__headingcontainer}>
            <h1 className={Styles.MarketCard__tableheading}>
              Open Positions
            </h1>
            <button
              className={Styles.MarketCard__tabletoggle}
              onClick={() => this.toggleTable('openPositions')}
            >
              <CaretDropdown flipped={this.state.tableOpen.openPositions} />
            </button>
          </div>
          {this.state.tableOpen.openPositions &&
            <MarketTable
              titles={[
                'Outcome',
                'Quantity',
                'Last Price',
                'Realized P/L',
                'Unrealized P/L',
                'Total P/L',
                'Action'
              ]}
              data={[
                [
                  'Hong Kong',
                  '10',
                  '10',
                  '20',
                  '129',
                  '129',
                  'Close',
                ],
                [
                  'Hong Kong',
                  '10',
                  '10',
                  '20',
                  '129',
                  '129',
                  'Close',
                ]
              ]}
            />
          }
        </section>
      </article>
    )
  }
}
