/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure

import React, { Component } from 'react'
import classNames from 'classnames'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import getValue from 'utils/get-value'
import setShareDenomination from 'utils/set-share-denomination'

import Styles from 'modules/market/components/market-positions-list--position/market-positions-list--position.styles'

export default class Position extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showConfirm: false,
    }
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <ul className={Styles.Position}>
        <li>{ getValue(p, 'name') }</li>
        <li>{ getValue(p, 'position.qtyShares.formatted') }</li>
        <li>{ getValue(p, 'position.purchasePrice.formatted') }</li>
        <li>{ getValue(p, 'position.unrealizedNet.formatted') }</li>
        <li>{ getValue(p, 'position.realizedNet.formatted') }</li>
        <li>
          <button onClick={e => this.setState({ showConfirm: true })}>Close</button>
        </li>
        <div className={classNames(Styles['Position__confirm'], { [`${Styles['is-open']}`] : s.showConfirm })}>
          <div className={Styles['Position__confirm-details']}>
            <p>Close position by selling { getValue(p, 'position.qtyShares.formatted') } shares of “{ getValue(p, 'name') }” at { getValue(p, 'position.purchasePrice.formatted') } ETH?</p>
            <div className={Styles['Position__confirm-options']}>
              <button onClick={e => { p.position.closePosition; this.setState({ showConfirm: false }); }}>Yes</button>
              <button onClick={e => this.setState({ showConfirm: false })}>No</button>
            </div>
          </div>
        </div>
      </ul>
    )
  }
}
