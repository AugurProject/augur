import React, { Component } from 'react'
import classNames from 'classnames'

import TransactionMeta from 'modules/portfolio/components/transaction-meta/transaction-meta'
import { ChevronDown } from 'modules/common/components/icons/icons'

import toggleHeight from 'utils/toggle-height/toggle-height'

import Styles from 'modules/portfolio/components/transaction-linked/transaction-linked.styles'
import ToggleHeightStyles from 'utils/toggle-height/toggle-height.styles'

export default class LinkedTransaction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    }
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <div>
        <button
          className={Styles['LinkedTransaction__message']}
          onClick={() => { toggleHeight(this.metaWrapper, s.isOpen, () => { this.setState({ 'isOpen' : !s.isOpen }) }) }}
        >
          <span>{ p.transaction.message }</span>
          <span className={classNames({ [`${Styles['is-open']}`] : s.isOpen })}>{ ChevronDown }</span>
        </button>
        <div className={ToggleHeightStyles['toggle-height-target']} ref={metaWrapper => this.metaWrapper = metaWrapper}>
          <TransactionMeta meta={p.transaction.meta} />
        </div>
      </div>
    )
  }
}
