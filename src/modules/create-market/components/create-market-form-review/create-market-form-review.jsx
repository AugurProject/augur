import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { augur } from 'services/augurjs'
// import { BigNumber, WrappedBigNumber } from 'utils/wrapped-big-number'
import getValue from 'src/utils/get-value'
import insufficientFunds from 'src/modules/create-market/utils/insufficient-funds'

import { formatEtherEstimate, formatGasCostToEther } from 'utils/format-number'
import { EXPIRY_SOURCE_GENERIC } from 'modules/create-market/constants/new-market-constraints'

import { ExclamationCircle as InputErrorIcon } from 'modules/common/components/icons'
import Styles from 'modules/create-market/components/create-market-form-review/create-market-form-review.styles'
import StylesForm from 'modules/create-market/components/create-market-form/create-market-form.styles'

export default class CreateMarketReview extends Component {
  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    universe: PropTypes.object.isRequired,
    estimateSubmitNewMarket: PropTypes.func.isRequired,
    meta: PropTypes.object,
    availableEth: PropTypes.string.isRequired,
    availableRep: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)

    const gasPrice = augur.rpc.getGasPrice()

    this.state = {
      gasPrice,
      creationFee: null,
      gasCost: null,
      validityBond: null,
      designatedReportNoShowReputationBond: null,
      // initialLiquidity: {
      // gas: null,
      // },
      formattedInitialLiquidityEth: formatEtherEstimate(this.props.newMarket.initialLiquidityEth),
      formattedInitialLiquidityGas: formatEtherEstimate(formatGasCostToEther(this.props.newMarket.initialLiquidityGas, { decimalsRounded: 4 }, gasPrice)),
    }

    this.calculateMarketCreationCosts = this.calculateMarketCreationCosts.bind(this)
  }

  componentWillMount() {
    this.calculateMarketCreationCosts()
  }

  componentWillReceiveProps(nextProps) {
    const { newMarket } = this.props
    if (newMarket.initialLiquidityEth !== nextProps.newMarket.initialLiquidityEth) this.setState({ formattedInitialLiquidityEth: formatEtherEstimate(nextProps.newMarket.initialLiquidityEth) })
    if (newMarket.initialLiquidityGas !== nextProps.newMarket.initialLiquidityGas) this.setState({ formattedInitialLiquidityGas: formatEtherEstimate(formatGasCostToEther(nextProps.newMarket.initialLiquidityGas, { decimalsRounded: 4 }, this.state.gasPrice)) })
  }

  calculateMarketCreationCosts() {
    const {
      meta,
      universe,
      newMarket,
    } = this.props
    this.props.estimateSubmitNewMarket(newMarket, (err, gasEstimateValue) => {
      if (err) console.error(err)
      augur.createMarket.getMarketCreationCostBreakdown({ universe: universe.id, meta }, (err, marketCreationCostBreakdown) => {
        if (err) return console.error(err)
        // TODO add designatedReportNoShowReputationBond to state / display
        const gasPrice = augur.rpc.getGasPrice()
        this.setState({
          gasPrice,
          gasCost: formatEtherEstimate(formatGasCostToEther(gasEstimateValue, { decimalsRounded: 4 }, gasPrice)),
          designatedReportNoShowReputationBond: formatEtherEstimate(marketCreationCostBreakdown.designatedReportNoShowReputationBond),
          creationFee: formatEtherEstimate(marketCreationCostBreakdown.targetReporterGasCosts),
          validityBond: formatEtherEstimate(marketCreationCostBreakdown.validityBond),
        })
      })
    })
  }

  render() {
    const {
      availableEth,
      availableRep,
      newMarket,
    } = this.props
    const s = this.state

    let insufficientFundsString = ''
    if (s.validityBond) {
      const validityBond = getValue(s, 'validityBond.formattedValue')
      const gasCost = getValue(s, 'gasCost.formattedValue')
      const creationFee = getValue(s, 'creationFee.formattedValue')
      const designatedReportNoShowReputationBond = getValue(s, 'designatedReportNoShowReputationBond.formattedValue')

      insufficientFundsString = insufficientFunds(validityBond, gasCost, creationFee, designatedReportNoShowReputationBond, availableEth, availableRep)
    }
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
                  <span>{s.validityBond && s.validityBond.rounded} ETH</span>
                </li>
                <li>
                  <span>No-Show Bond</span>
                  <span>{s.designatedReportNoShowReputationBond && s.designatedReportNoShowReputationBond.rounded} REP</span>
                </li>
                <li>
                  <span>Est. Gas</span>
                  <span>{s.gasCost && s.gasCost.rounded} ETH</span>
                </li>
                <li>
                  <span>Reporter Gas Bond</span>
                  <span>{s.creationFee && s.creationFee.rounded} ETH</span>
                </li>
              </ul>
            </div>
            <div className={Styles.CreateMarketReview__liquidity}>
              <h3 className={Styles.CreateMarketReview__subheading}>Market Liquidity</h3>
              <ul className={Styles.CreateMarketReview__list}>
                <li>
                  <span>Ether</span>
                  <span>{s.formattedInitialLiquidityEth.rounded} ETH</span>
                </li>
                <li>
                  <span>Gas</span>
                  <span>{s.formattedInitialLiquidityGas.rounded} ETH</span>
                </li>
              </ul>
            </div>
          </div>
          {insufficientFundsString !== '' &&
          <span className={StylesForm['CreateMarketForm__error--insufficient-funds']}>
            {InputErrorIcon}You have insufficient {insufficientFundsString} to create this market.
          </span>
          }
          <div className={Styles.CreateMarketReview__resolution}>
            <h4 className={Styles.CreateMarketReview__smallheading}>Resolution Source</h4>
            <p className={Styles.CreateMarketReview__smallparagraph}>
              {
                newMarket.expirySourceType === EXPIRY_SOURCE_GENERIC ?
                  'Outcome will be determined by news media' :
                  `Outcome will be detailed on public website: ${newMarket.expirySource}`
              }
            </p>
          </div>
          <div className={Styles.CreateMarketReview__addedDetails}>
            <h4 className={Styles.CreateMarketReview__smallheading}>Additional Details</h4>
            <p className={Styles.CreateMarketReview__smallparagraph}>{newMarket.detailsText || 'None'}</p>
          </div>
        </div>
      </article>
    )
  }
}
