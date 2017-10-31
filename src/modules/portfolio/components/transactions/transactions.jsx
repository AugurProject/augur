import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Helmet } from 'react-helmet'

import TransactionSingle from 'modules/portfolio/components/transaction-single/transaction-single'
import TransactionMultiple from 'modules/portfolio/components/transaction-multiple/transaction-multiple'
import { ChevronDown } from 'modules/common/components/icons/icons'

import Styles from 'modules/portfolio/components/transactions/transactions.styles'

const Transactions = p => (
  <section>
    <Helmet>
      <title>Transactions</title>
    </Helmet>
    <div className={Styles.Transactions__header}>
      <h2 className={Styles.Transactions__heading}>Transactions</h2>
    </div>
    <div className={Styles.Transactions__list}>
      { p.transactions.map(transaction => {
        if (transaction.transactions.length <= 1) {
          return <TransactionSingle key={transaction.hash} transaction={transaction} />
        } else {
          return <TransactionMultiple key={transaction.hash} transaction={transaction} />
        }
      }) }
    </div>
  </section>
)

Transactions.propTypes = {
  transactions: PropTypes.array.isRequired,
}

export default Transactions
