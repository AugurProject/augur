import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import getValue from 'utils/get-value'

import Styles from 'modules/market/components/market-tables/market-tables.styles'

export default class MarketTable extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    isMobile: PropTypes.bool,
    titleKeyPairs: PropTypes.array.isRequired
  }

  constructor() {
    super()
    this.state = {}
  }

  render() {
    const p = this.props

    return (
      <table className={Styles.MarketTable}>
        <thead>
          <tr className={classNames(Styles.MarketTable__row, Styles.MarketTable__titlerow)}>
            {p.titleKeyPairs.map((titlePair, ind) => {
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
              {p.titleKeyPairs.map((titlePair, ind) => {
                const dataKey = titlePair[1]
                const mobileTitle = p.mobileTitles[ind]
                const mobileHide = mobileTitle === null
                let data
                if (dataKey === 'dialogButton') {
                  const buttonData = getValue(dataRow, dataKey)
                  const rowDialogKey = `dialog_${dataRow.id}_open`
                  const rowDialogOpen = this.state[rowDialogKey]
                  data = (
                    <div>
                      <button onClick={() => this.setState({ [rowDialogKey]: true })}>
                        {buttonData.label}
                      </button>
                      {rowDialogOpen &&
                        <div className={Styles.MarketTable__rowDialog}>
                          <div className={Styles.MarketTable__rowDialogText}>
                            {buttonData.dialogText}
                          </div>
                          <div className={Styles.MarketTable__rowDialogButtons}>
                            <button
                              onClick={() => {
                                if (buttonData.confirm) buttonData.confirm()
                                this.setState({ [rowDialogKey]: false })
                              }}
                            >
                              Yes
                            </button>
                            <button onClick={() => this.setState({ [rowDialogKey]: false })}>
                              No
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  )
                } else {
                  data = getValue(dataRow, dataKey)
                }

                return (
                  <td
                    className={classNames(
                      Styles.MarketTable__value,
                      { [Styles['MarketTable__value--mobilehide']]: mobileHide }
                    )}
                  >
                    {data || ''}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}
