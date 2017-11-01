import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import classNames from 'classnames'
import { augur } from 'services/augurjs'
// import BigNumber from 'bignumber.js'

import { formatEtherEstimate, formatEtherTokensEstimate } from 'utils/format-number'

import Styles from 'modules/create-market/components/create-market-form-review/create-market-form-review.styles'
import StylesForm from 'modules/create-market/components/create-market-form/create-market-form.styles'

export default class CreateMarketReview extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    universe: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      creationFee: null,
      gasCost: null,
      validityBond: null,
      initialLiquidity: {
        gas: null,
        fees: null
      },
      formattedInitialLiquidityEth: formatEtherTokensEstimate(this.props.newMarket.initialLiquidityEth),
      formattedInitialLiquidityGas: formatEtherEstimate(this.props.newMarket.initialLiquidityGas),
      formattedInitialLiquidityFees: formatEtherTokensEstimate(this.props.newMarket.initialLiquidityFees)
    }

    this.calculateMarketCreationCosts = this.calculateMarketCreationCosts.bind(this)
  }

  componentWillMount() {
    // this.calculateMarketCreationCosts()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.newMarket.initialLiquidityEth !== nextProps.newMarket.initialLiquidityEth) this.setState({ formattedInitialLiquidityEth: formatEtherTokensEstimate(nextProps.newMarket.initialLiquidityEth) })
    if (this.props.newMarket.initialLiquidityGas !== nextProps.newMarket.initialLiquidityGas) this.setState({ formattedInitialLiquidityGas: formatEtherEstimate(nextProps.newMarket.initialLiquidityGas) })
    if (this.props.newMarket.initialLiquidityFees !== nextProps.newMarket.initialLiquidityFees) this.setState({ formattedInitialLiquidityFees: formatEtherTokensEstimate(nextProps.newMarket.initialLiquidityFees) })
  }

  calculateMarketCreationCosts() {
    augur.createMarket.getMarketCreationCostBreakdown({
      universeID: this.props.universe.id,
      _endTime: this.props.newMarket.endDate.timestamp / 1000
    }, (err, marketCreationCostBreakdown) => {
      if (err) return console.error(err)
      this.setState({
        gasCost: formatEtherEstimate(0), // FIXME real gas cost lookup
        creationFee: formatEtherEstimate(marketCreationCostBreakdown.targetReporterGasCosts),
        validityBond: formatEtherEstimate(marketCreationCostBreakdown.validityBond)
      })
    })
  }

  render() {
    // const p = this.props
    // const s = this.state

    return (
      <article className={StylesForm.CreateMarketForm__fields}>
        <div className={Styles.CreateMarketReview}>
          <h2 className={Styles.CreateMarketReview__heading}>Confirm Market</h2>
          <div className={Styles.CreateMarketReview__wrapper}>
            <div className={Styles.CreateMarketReview__creation}>
              <h3 className={Styles.CreateMarketReview__subheading}>Market Creation</h3>
              <ul className={Styles.CreateMarketReview__list}>
                <li>
                  <span>Validity Bond</span>
                  <span>0.0340 ETH</span>
                </li>
                <li>
                  <span>Reporter Fee</span>
                  <span>0.0340 REP</span>
                </li>
                <li>
                  <span>Create Market Gas</span>
                  <span>0.0340 ETH</span>
                </li>
                <li>
                  <span>Reporter Gas</span>
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
