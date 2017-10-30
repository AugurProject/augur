import React, { Component } from 'react'

import TransactionMeta from 'modules/portfolio/components/transaction-meta/transaction-meta'
import { ChevronDown } from 'modules/common/components/icons/icons'

import Styles from 'modules/portfolio/components/transaction-linked/transaction-linked.styles'
import CommonStyles from 'modules/portfolio/components/transaction/transaction.styles'

export default class LinkedTransaction extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    const p = this.props

    return (
      <div>
        <button className={Styles['LinkedTransaction__message']} onClick={() => { this.toggleHeight(this[`metaWrapper_${i}`]) }}>
          <span>{ p.transaction.message }</span>
          { ChevronDown }
        </button>
        <div className={CommonStyles['toggle-height-target']} ref={metaWrapper => this[`metaWrapper_${i}`] = metaWrapper}>
          <TransactionMeta meta={p.transaction.meta} />
        </div>
      </div>
    )
  }
}
