import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Helmet } from 'react-helmet'

import TransactionSingle from 'modules/portfolio/components/transaction-single/transaction-single'
import TransactionMultiple from 'modules/portfolio/components/transaction-multiple/transaction-multiple'
import Paginator from 'modules/common/components/paginator/paginator'
import { ChevronDown } from 'modules/common/components/icons/icons'

import Styles from 'modules/portfolio/components/transactions/transactions.styles'

export default class Transactions extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    transactions: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      lowerBound: null,
      boundedLength: null,
    }

    this.setSegment = this.setSegment.bind(this)
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, boundedLength })
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section>
        <Helmet>
          <title>Transactions</title>
        </Helmet>
        <div className={Styles.Transactions__header}>
          <h2 className={Styles.Transactions__heading}>Transactions</h2>
        </div>
        <div className={Styles.Transactions__list}>
        {p.transactions.length && s.boundedLength &&
          [...Array(s.boundedLength)].map((unused, i) => {
            const transaction = p.transactions[(s.lowerBound - 1) + i]

            if (transaction.transactions.length <= 1) {
              return <TransactionSingle key={transaction.hash} transaction={transaction} />
            } else {
              return <TransactionMultiple key={transaction.hash} transaction={transaction} />
            }
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
