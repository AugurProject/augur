import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-tables/market-tables.styles'

const MarketTable = p => (
  <table className={Styles.MarketTable}>
    <thead>
      <tr className={classNames(Styles.MarketTable__row, Styles.MarketTable__titlerow)}>
        {p.titles.map(title => (<th className={Styles.MarketTable__title}>{title}</th>))}
      </tr>
    </thead>
    <tbody>
      {p.data.map(dataRow => (
        <tr className={Styles.MarketTable__row}>
          {dataRow.map(value => (<td className={Styles.MarketTable__value}>{value}</td>))}
        </tr>
      ))}
    </tbody>
  </table>
)

MarketTable.propTypes = {
  titles: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired
}

export default MarketTable
