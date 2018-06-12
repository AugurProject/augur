/* eslint react/no-array-index-key: 0 */ // due to potential for dup orders

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { augur } from 'services/augurjs'
import { createBigNumber } from 'utils/create-big-number'

import { YES_NO, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

import { CreateMarketEdit } from 'modules/common/components/icons'

import CreateMarketPreviewRange from 'modules/create-market/components/create-market-preview-range/create-market-preview-range'
import CreateMarketPreviewCategorical from 'modules/create-market/components/create-market-preview-categorical/create-market-preview-categorical'
import { dateHasPassed, formatDate } from 'utils/format-date'
import Styles from 'modules/create-market/components/create-market-preview/create-market-preview.styles'
import noop from 'src/utils/noop'
import { compact } from 'lodash'
import { CategoryTagTrail } from 'src/modules/common/components/category-tag-trail/category-tag-trail'

export default class CreateMarketPreview extends Component {

  static propTypes = {
    currentTimestamp: PropTypes.number.isRequired,
    newMarket: PropTypes.object.isRequired,
    universe: PropTypes.object.isRequired,
  }

  static formatReporterFee(value) {
    if (!value || value === 0 || isNaN(value)) return 0
    const { ETHER } = augur.rpc.constants
    return createBigNumber(value.toString()).times(ETHER).dividedBy(createBigNumber(100)).toNumber()
  }

  static getExpirationDate(p) {
    if (!Object.keys(p.newMarket.endTime).length) {
      return '-'
    }

    const endTime = moment(p.newMarket.endTime.timestamp * 1000)
    endTime.set({
      hour: p.newMarket.hour,
      minute: p.newMarket.minute,
    })

    if (p.newMarket.meridiem === 'AM' && endTime.hours() >= 12) {
      endTime.hours(endTime.hours() - 12)
    } else if (p.newMarket.meridiem === 'PM' && endTime.hours() < 12) {
      endTime.hours(endTime.hours() + 12)
    }
    p.newMarket.endTime = formatDate(endTime.toDate())
    return endTime.format('MMM D, YYYY h:mm a')
  }

  static calculateShares(orderBook) {
    let totalShares = createBigNumber(0)
    if (Object.keys(orderBook).length) {
      Object.keys(orderBook).forEach((option) => {
        orderBook[option].forEach((order) => {
          totalShares = totalShares.plus(order.quantity)
        })
      })
      return `${totalShares} Shares`
    }
    return '- Shares'
  }

  constructor(props) {
    super(props)

    this.state = {
      expirationDate: CreateMarketPreview.getExpirationDate(props),
      shares: CreateMarketPreview.calculateShares(this.props.newMarket.orderBook),
      reporterFeePercentage: 1,
    }

    CreateMarketPreview.getExpirationDate = CreateMarketPreview.getExpirationDate.bind(this)
    CreateMarketPreview.calculateShares = CreateMarketPreview.calculateShares.bind(this)
  }

  componentWillMount() {
    this.getReportingFeePercentage()
  }

  componentWillReceiveProps(nextProps) {
    const { newMarket } = this.props
    if (newMarket.endTime !== nextProps.newMarket.endTime ||
        newMarket.hour !== nextProps.newMarket.hour ||
        newMarket.minute !== nextProps.newMarket.minute ||
        newMarket.meridiem !== nextProps.newMarket.meridiem) {
      this.setState({ expirationDate: CreateMarketPreview.getExpirationDate(nextProps) })
    }
    if (newMarket.orderBook !== nextProps.newMarket.orderBook) {
      this.setState({ shares: CreateMarketPreview.calculateShares(nextProps.newMarket.orderBook) })
    }
  }

  getReportingFeePercentage() {
    const { universe } = this.props
    augur.createMarket.getMarketCreationCostBreakdown({ universe: universe.id }, (err, marketCreationCostBreakdown) => {
      if (err) return console.error(err)
      this.setState({
        reporterFeePercentage: CreateMarketPreview.formatReporterFee(marketCreationCostBreakdown.reportingFeeDivisor),
      })
    })
  }
  render() {
    const {
      currentTimestamp,
      newMarket,
    } = this.props
    const s = this.state


    const process = (...arr) => compact(arr).map(label => ({
      label,
      onClick: noop,
    }))

    const categoriesWithClick = process(newMarket.category)
    const tagsWithClick = process(newMarket.tag1, newMarket.tag2)

    return (
      <article className={Styles.CreateMarketPreview}>
        <div className={Styles.CreateMarketPreview__header}>
          <div className={Styles['CreateMarketPreview__header-wrapper']}>
            <div className={Styles.CreateMarketPreview__tags}>
              <CategoryTagTrail categories={categoriesWithClick} tags={tagsWithClick} />
            </div>
            <h1 className={Styles.CreateMarketPreview__description}>{newMarket.description || 'New Market Question'}</h1>
            <div className={Styles.CreateMarketPreview__outcome}>
              { (newMarket.type === YES_NO || newMarket.type === SCALAR) &&
                <CreateMarketPreviewRange
                  newMarket={newMarket}
                />
              }
              { newMarket.type === CATEGORICAL && newMarket.outcomes.length > 0 &&
                <CreateMarketPreviewCategorical
                  newMarket={newMarket}
                />
              }
              { (newMarket.type === '' || (newMarket.type === CATEGORICAL && newMarket.outcomes.length === 0)) && 'Outcome' }
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
                <span>{ s.shares }</span>
              </li>
              <li>
                <span>Fee</span>
                <span>Market Creator Fee { newMarket.settlementFee !== '' ? '(' + newMarket.settlementFee + '%)' : ''} + Reporting Fee ({s.reporterFeePercentage}%)</span>
              </li>
              <li>
                <span>{dateHasPassed(currentTimestamp, newMarket.endTime.timestamp) ? 'Expired' : 'Expires'}</span>
                <span>{ s.expirationDate }</span>
              </li>
            </ul>
          </div>
        </div>
      </article>
    )
  }
}
