import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Styles from 'modules/create-market/components/create-market-form-review/create-market-form-review.styles'
import StylesForm from 'modules/create-market/components/create-market-form/create-market-form.styles'

export default class CreateMarketReview extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    const p = this.props

    return (
      <article className={StylesForm.CreateMarketForm__fields}>
        <div className={Styles.CreateMarketReview}>
          <h2 className={Styles.CreateMarketReview__heading}>Confirm Market</h2>
          <div className={Styles.CreateMarketReview__wrapper}>
            <div className={Styles.CreateMarketReview__creation}>
              <h3 className={Styles.CreateMarketReview__subheading}>Market Creation</h3>
              <ul className={Styles.CreateMarketReview__list}>
                <li>
                  <span>Creation Fee</span>
                  <span>0.0340 ETH</span>
                </li>
                <li>
                  <span>Bond</span>
                  <span>0.0340 ETH</span>
                </li>
                <li>
                  <span>Gas Fee</span>
                  <span>0.0340 ETH</span>
                </li>
              </ul>
            </div>
            <div className={Styles.CreateMarketReview__liquidity}>
              <h3 className={Styles.CreateMarketReview__subheading}>Market Liquidity</h3>
              <ul className={Styles.CreateMarketReview__list}>
                <li>
                  <span>Ether</span>
                  <span>0.0340 ETH</span>
                </li>
                <li>
                  <span>Gas</span>
                  <span>0.0340 ETH</span>
                </li>
                <li>
                  <span>Fees</span>
                  <span>0.0340 ETH</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </article>
    )
  }
}
