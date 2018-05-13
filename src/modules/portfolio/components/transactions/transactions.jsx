import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import TransactionSingle from 'modules/portfolio/components/transaction-single/transaction-single'
import TransactionMultiple from 'modules/portfolio/components/transaction-multiple/transaction-multiple'
import Dropdown from 'modules/common/components/dropdown/dropdown'
import Paginator from 'modules/common/components/paginator/paginator'

import { getBeginDate } from 'src/utils/format-date'

import Styles from 'modules/portfolio/components/transactions/transactions.styles'
import PortfolioStyles from 'modules/portfolio/components/portfolio-view/portfolio-view.styles'

export default class Transactions extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    currentTimestamp: PropTypes.number.isRequired,
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
    const {
      currentTimestamp,
      loadAccountHistoryTransactions,
    } = this.props
    const beginDate = getBeginDate(currentTimestamp, value)
    loadAccountHistoryTransactions(beginDate, null)
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
    const {
      history,
      location,
      transactions,
    } = this.props
    const s = this.state

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
        { transactions.length === 0 &&
          <div className={PortfolioStyles.NoMarkets__container} >
            <span>You don&apos;t have any transactions.</span>
          </div>
        }
        <div className={Styles.Transactions__list}>
          { transactions.length > 0 && s.boundedLength &&
            [...Array(s.boundedLength)].map((unused, i) => {
              const transaction = transactions[(s.lowerBound - 1) + i]
              if (transaction) {
                if (!transaction.transactions || (transaction.transactions && transaction.transactions.length <= 1)) {
                  return <TransactionSingle key={transaction.hash} transaction={transaction} />
                }
                return <TransactionMultiple key={transaction.hash} transaction={transaction} />
              }
              return null
            })
          }
        </div>
        { transactions.length > 0 &&
          <Paginator
            itemsLength={transactions.length}
            itemsPerPage={10}
            location={location}
            history={history}
            setSegment={this.setSegment}
          />
        }
      </section>
    )
  }
}
