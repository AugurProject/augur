import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import TransactionMeta from 'modules/portfolio/components/transaction-meta/transaction-meta'
import LinkedTransaction from 'modules/portfolio/components/transaction-linked/transaction-linked'
import { ChevronDown } from 'modules/common/components/icons/icons'

import Styles from 'modules/portfolio/components/transaction/transaction.styles'

export default class Transaction extends Component {

  static propTypes = {
    transaction: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  toggleHeight(target) {
    const isOpen = target.getAttribute('data-open') === 'true'

    if (isOpen) {
      var targetTransition = target.style.transition;
      target.style.transition = '';

      requestAnimationFrame(function() {
        target.style.height = target.scrollHeight + 'px';
        target.style.transition = targetTransition;

        requestAnimationFrame(function() {
          target.style.height = '0px';
        });
      });

      target.setAttribute('data-open', 'false');
    } else {
      target.style.height = target.scrollHeight + 'px'

      target.addEventListener('transitionend', function onTransitionEnd(e) {
        target.removeEventListener('transitionend', onTransitionEnd)
        target.style.height = 'auto'
      })

      target.setAttribute('data-open', 'true')
    }
  }

  render() {
    const s = this.state
    const p = this.props

    const { transaction } = p
    const singleTransactionGroup = transaction.transactions.length <= 1
    const multipleTransactionGroup = !singleTransactionGroup

    return (
      <div className={Styles.Transaction__item}>
        <button className={Styles.Transaction__body} onClick={() => { this.toggleHeight(this.singleTransactionMeta) }}>
          <div>
            <h5 className={Styles.Transaction__status}>{ transaction.status }</h5>
            <h3 className={Styles.Transaction__message}>{ transaction.message }</h3>
            <h4 className={Styles.Transaction__description}>{ transaction.description }</h4>
            <h4 className={Styles.Transaction__date}>{ transaction.timestamp.full }</h4>
          </div>
          { singleTransactionGroup && ChevronDown }
        </button>
        { singleTransactionGroup &&
          <div className={Styles['toggle-height-target']} ref={ singleTransactionMeta => this.singleTransactionMeta = singleTransactionMeta }>
            <TransactionMeta meta={transaction.transactions[0].meta} />
          </div>
        }
        { multipleTransactionGroup &&
          <div>
            <button className={Styles['Transaction__linked-more']} onClick={() => { this.toggleHeight(this.multipleTransactions) }}>
              <span>+ {transaction.transactions.length} Linked Transactions</span>
              { ChevronDown }
            </button>
            <div className={Styles['toggle-height-target']} ref={ multipleTransactions => this.multipleTransactions = multipleTransactions }>
              { transaction.transactions.map((linked_transaction, i) => (
                <LinkedTransaction transaction={linked_transaction} />
              ))}
            </div>
          </div>
        }

      </div>
    )
  }
}
