/* eslint react/no-array-index-key: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import TransactionHeader from 'modules/portfolio/components/transaction-header/transaction-header'
import LinkedTransaction from 'modules/portfolio/components/transaction-linked/transaction-linked'
import { ChevronDown } from 'modules/common/components/icons'

import toggleHeight from 'utils/toggle-height/toggle-height'

import CommonStyles from 'modules/portfolio/components/transactions/transactions.styles'
import ToggleHeightStyles from 'utils/toggle-height/toggle-height.styles'

export default class TransactionMultiple extends Component {

  static propTypes = {
    transaction: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
    }
  }

  render() {
    const s = this.state
    const { transaction } = this.props

    return (
      <div className={CommonStyles.Transaction__item}>
        <div className={CommonStyles.Transaction__body}>
          <TransactionHeader transaction={transaction} />
        </div>
        <button
          className={CommonStyles['Transaction__linked-more']}
          onClick={() => { toggleHeight(this.multipleTransactions, s.isOpen, () => { this.setState({ isOpen: !s.isOpen }) }) }}
        >
          <span className={classNames(CommonStyles['Transaction__linked-more-text'], { [`${CommonStyles['is-open']}`]: s.isOpen })}>{ s.isOpen ? '-' : '+' } {(transaction.transactions && transaction.transactions.length) || 0} Linked Transactions</span>
          <span className={classNames(CommonStyles['Transaction__linked-more-chevron'], { [`${CommonStyles['is-open']}`]: s.isOpen })}>{ <ChevronDown /> }</span>
        </button>
        <div className={ToggleHeightStyles['toggle-height-target']} ref={(multipleTransactions) => { this.multipleTransactions = multipleTransactions }}>
          { (transaction.transactions || []).map((linkedTransaction, i) => (
            <LinkedTransaction key={i} transaction={linkedTransaction} />
          ))}
        </div>
      </div>
    )
  }
}
