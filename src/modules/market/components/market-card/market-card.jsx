import React from 'react'
import classNames from 'classnames'

import MarketStatusIcon from 'modules/market/components/common/market-status-icon/market-status-icon'
import MarketTable from 'modules/market/components/market-tables/market-tables'

import CommonStyles from 'modules/market/components/common/market-common.styles'
import Styles from 'modules/market/components/market-card/market-card.styles'

const MarketCard = p => (
  <article className={CommonStyles.MarketCommon__container}>
    <section
      className={classNames(
        CommonStyles.MarketCommon__topcontent,
        Styles.MarketCard__topcontent
      )}
    >
      <div className={CommonStyles.MarketCommon__header}>
        <h1 className={CommonStyles.MarketCommon__description}>
          Market Title
        </h1>
        <MarketStatusIcon isOpen isReported />
      </div>
      <div className={Styles.MarketCard__topstats}>
        <span className={Styles.MarketCard__statlabel}>
          Realized P/L
        </span>
        <span className={Styles.MarketCard__stat}>
          <span className={Styles.MarketCard__statvalue}>
            0
          </span>
          ETH
        </span>
        <span className={Styles.MarketCard__statlabel}>
          Unrealized P/L
        </span>
        <span className={Styles.MarketCard__stat}>
          <span className={Styles.MarketCard__statvalue}>
            0
          </span>
          ETH
        </span>
        <span className={Styles.MarketCard__statlabel}>
          Total P/L
        </span>
        <span className={Styles.MarketCard__stat}>
          <span className={Styles.MarketCard__statvalue}>
            0
          </span>
          ETH
        </span>
      </div>
    </section>
    <section className={Styles.MarketCard__tablesection}>
      <h1 className={Styles.MarketCard__tableheading}>
        My Positions
      </h1>
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
    </section>
  </article>
)

export default MarketCard
