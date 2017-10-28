import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Helmet } from 'react-helmet'

import { ChevronDown } from 'modules/common/components/icons/icons'

import Styles from 'modules/portfolio/components/transactions/transactions.styles'

export default class Transactions extends Component {

  static propTypes = {
  }

  constructor(props) {
    super(props)

    this.state = {
    }
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
          { p.transactions.map(transaction => (
            <div className={Styles.Transactions__item}>
              <button className={Styles.Transactions__body}>
                <div>
                  <h5 className={Styles.Transactions__status}>{ transaction.status }</h5>
                  <h3 className={Styles.Transactions__message}>{ transaction.message }</h3>
                  <h4 className={Styles.Transactions__description}>{ transaction.description }</h4>
                  <h4 className={Styles.Transactions__date}>{ transaction.timestamp.full }</h4>
                </div>
                { ChevronDown }
              </button>
              { transaction.transactions.length > 1 &&
                <button className={Styles['Transactions__linked-more']}>
                  <span>+ {transaction.transactions.length} Linked Transactions</span>
                  { ChevronDown }
                </button>
              }
              { transaction.transactions && transaction.transactions.map(linked_transaction => (
                <div className={Styles.Transactions__linked}>
                  { transaction.transactions.length > 1 &&
                  <button className={Styles['Transactions__linked-message']}>
                    <span>{ linked_transaction.message }</span>
                    { ChevronDown }
                  </button>
                  }
                  <ul className={Styles['Transactions__linked-meta']}>
                    { Object.keys(linked_transaction.meta).map(meta_title => (
                      <li><span>{ meta_title }</span><span>{ linked_transaction.meta[meta_title] }</span></li>
                    )) }
                  </ul>
                </div>
              ))}
            </div>
          )) }
        </div>
      </section>
    )
  }
}
