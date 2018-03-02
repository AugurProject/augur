import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import TransactionSingle from 'modules/portfolio/components/transaction-single/transaction-single'
import TransactionMultiple from 'modules/portfolio/components/transaction-multiple/transaction-multiple'
import Paginator from 'modules/common/components/paginator/paginator'
import { getBeginDate } from 'src/utils/format-date'
import Styles from 'modules/portfolio/components/transactions/transactions.styles'
import Dropdown from 'modules/common/components/dropdown/dropdown'

export default class Transactions extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    transactions: PropTypes.array.isRequired,
    loadAccountHistoryTransactions: PropTypes.func.isRequired,
    transactionPeriod: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = {
      lowerBound: null,
      boundedLength: null,
      transactionPeriodOptions: [
        { label: 'Past 24hrs', value: 'day' },
        { label: 'Past Week', value: 'week' },
        { label: 'Past Month', value: 'month' },
        { label: 'All', value: 'all' },
      ],
      transactionPeriodDefault: 'day',
    }

    this.setSegment = this.setSegment.bind(this)
    this.changeTransactionDropdown = this.changeTransactionDropdown.bind(this)
  }

  componentWillMount() {
    this.loadTransactions(this.state.transactionPeriodDefault)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.transactionPeriod !== this.state.transactionPeriod) {
      this.loadTransactions(this.state.transactionPeriod)
    }
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, boundedLength })
  }

  loadTransactions(value) {
    const beginDate = getBeginDate(value)
    this.props.loadAccountHistoryTransactions(beginDate, null)
  }

  changeTransactionDropdown(value) {
    let newPeriod = this.state.transactionPeriod

    this.state.transactionPeriodOptions.forEach((period, ind) => {
      if (period.value === value) {
        newPeriod = value
      }
    })

    this.setState({ transactionPeriod: newPeriod })
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section>
        <Helmet>
          <title>Transactions</title>
        </Helmet>
        <div
          className={Styles.Transaction__data}
        >
          <div className={Styles['Transaction__data-title']}>
            <h2 className={Styles.Transactions__heading}>Transactions</h2>
          </div>
          <div
            className={Styles['Transaction__data-filter']}
          >
            <Dropdown default={s.transactionPeriodDefault} options={s.transactionPeriodOptions} onChange={this.changeTransactionDropdown} />
          </div>
        </div>
        <div className={Styles.Transactions__list}>
          {p.transactions.length > 0 && s.boundedLength &&
          [...Array(s.boundedLength)].map((unused, i) => {
            const transaction = p.transactions[(s.lowerBound - 1) + i]
            if (transaction) {
              if (transaction.transactions && transaction.transactions.length <= 1) {
                return <TransactionSingle key={transaction.hash} transaction={transaction} />
              }
              return <TransactionMultiple key={transaction.hash} transaction={transaction} />
            }
            return null
          })
          }
        </div>
        { p.transactions.length &&
          <Paginator
            itemsLength={p.transactions.length}
            itemsPerPage={10}
            location={p.location}
            history={p.history}
            setSegment={this.setSegment}
          />
        }
      </section>
    )
  }
}
