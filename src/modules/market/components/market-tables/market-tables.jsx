import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-tables/market-tables.styles'

const MarketTable = p => (
  <table className={Styles.MarketTable}>
    <thead>
      <tr className={classNames(Styles.MarketTable__row, Styles.MarketTable__titlerow)}>
        {p.titles.map((titlePair, ind) => {
          const title = titlePair[0]
          const mobileTitle = p.mobileTitles[ind]
          const mobileHide = mobileTitle === null
          return (
            <th
              className={classNames(
                Styles.MarketTable__title,
                { [Styles['MarketTable__title--mobilehide']]: mobileHide }
              )}
            >
              <span className={Styles['MarketTable__titlestring--desktop']}>{title}</span>
              <span className={Styles['MarketTable__titlestring--mobile']}>{mobileTitle}</span>
            </th>
          )
        })}
      </tr>
    </thead>
    <tbody>
      {p.data.map(dataRow => (
        <tr className={Styles.MarketTable__row}>
          {p.titles.map((titlePair, ind) => {
            const dataKey = titlePair[1]
            const mobileTitle = p.mobileTitles[ind]
            const mobileHide = mobileTitle === null

            return (
              <td
                className={classNames(
                  Styles.MarketTable__value,
                  { [Styles['MarketTable__value--mobilehide']]: mobileHide }
                )}
              >
                {(p.data[ind] ||{})[dataKey] || ''}
              </td>
            )
          })}
        </tr>
      ))}
    </tbody>
  </table>
)

MarketTable.propTypes = {
  data: PropTypes.array.isRequired,
  isMobile: PropTypes.bool,
  titles: PropTypes.array.isRequired
}

export default MarketTable
