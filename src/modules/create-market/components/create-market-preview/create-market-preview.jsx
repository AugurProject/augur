/* eslint react/no-array-index-key: 0 */  // due to potential for dup orders

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
// import BigNumber from 'bignumber.js'
// import Highcharts from 'highcharts'
// import classNames from 'classnames'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

import { CreateMarketEdit } from 'modules/common/components/icons/icons'

import CreateMarketPreviewRange from 'modules/create-market/components/create-market-preview-range/create-market-preview-range'
import CreateMarketPreviewCategorical from 'modules/create-market/components/create-market-preview-categorical/create-market-preview-categorical'

// import { EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC } from 'modules/create-market/constants/new-market-constraints'
// import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
// import {
//   NEW_MARKET_DESCRIPTION,
//   NEW_MARKET_OUTCOMES,
//   NEW_MARKET_EXPIRY_SOURCE,
//   NEW_MARKET_END_DATE,
//   NEW_MARKET_DETAILS,
//   NEW_MARKET_TOPIC,
//   NEW_MARKET_KEYWORDS,
//   NEW_MARKET_FEES,
//   NEW_MARKET_ORDER_BOOK,
//   NEW_MARKET_REVIEW
// } from 'modules/create-market/constants/new-market-creation-steps'
// import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
// import { BID, ASK } from 'modules/transactions/constants/types'

// import getValue from 'utils/get-value'
// import debounce from 'utils/debounce'

import Styles from 'modules/create-market/components/create-market-preview/create-market-preview.styles'

export default class CreateMarketPreview extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
  }

  static getExpirationDate(p) {
    if (!Object.keys(p.newMarket.endDate).length) {
      return '-'
    }

    const endDate = moment(p.newMarket.endDate.timestamp)
    endDate.set({
      hour: p.newMarket.hour,
      minute: p.newMarket.minute,
    })

    if (p.newMarket.meridiem === 'AM' && endDate.hours() >= 12) {
      endDate.hours(endDate.hours() - 12)
    } else if (p.newMarket.meridiem === 'PM' && endDate.hours() < 12) {
      endDate.hours(endDate.hours() + 12)
    }

    return endDate.format('MMM D, YYYY h:mm a')
  }

  constructor(props) {
    super(props)

    this.state = {
      expirationDate: CreateMarketPreview.getExpirationDate(props)
    }

    CreateMarketPreview.getExpirationDate = CreateMarketPreview.getExpirationDate.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.newMarket.endDate !== nextProps.newMarket.endDate ||
        this.props.newMarket.hour !== nextProps.newMarket.hour ||
        this.props.newMarket.minute !== nextProps.newMarket.minute ||
        this.props.newMarket.meridiem !== nextProps.newMarket.meridiem) {
      this.setState({ expirationDate: CreateMarketPreview.getExpirationDate(nextProps) })
    }
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article className={Styles.CreateMarketPreview}>
        <div className={Styles.CreateMarketPreview__header}>
          <div className={Styles['CreateMarketPreview__header-wrapper']}>
            <div className={Styles.CreateMarketPreview__tags}>
              <ul>
                <li>Categories</li>
                <li>{p.newMarket.category}</li>
              </ul>
              <ul>
                <li>Tags</li>
                <li>{p.newMarket.tag1}</li>
                <li>{p.newMarket.tag2}</li>
              </ul>
            </div>
            <h1 className={Styles.CreateMarketPreview__description}>{p.newMarket.description || 'New Market Question'}</h1>
            <div className={Styles.CreateMarketPreview__outcome}>
              { (p.newMarket.type === BINARY || p.newMarket.type === SCALAR) &&
                <CreateMarketPreviewRange
                  newMarket={p.newMarket}
                />
              }
              { p.newMarket.type === CATEGORICAL && p.newMarket.outcomes.length > 0 &&
                <CreateMarketPreviewCategorical
                  newMarket={p.newMarket}
                />
              }
              { (p.newMarket.type === '' || (p.newMarket.type === CATEGORICAL && p.newMarket.outcomes.length === 0)) && 'Outcome' }
            </div>
            <span className={Styles.CreateMarketPreview__icon}>
              {CreateMarketEdit}
            </span>
          </div>
        </div>
        <div className={Styles.CreateMarketPreview__footer}>
          <div className={Styles['CreateMarketPreview__footer-wrapper']}>
            <ul className={Styles.CreateMarketPreview__meta}>
              <li>
                <span>Volume</span>
                <span>- Shares</span>
              </li>
              <li>
                <span>Fee</span>
                <span>0.0%</span>
              </li>
              <li>
                <span>Expires</span>
                <span>{ s.expirationDate }</span>
              </li>
            </ul>
          </div>
        </div>
      </article>
    )
  }
}
