/* eslint-disable react/no-unused-state */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { augur } from 'services/augurjs'
import BigNumber from 'bignumber.js'

import { formatEtherEstimate, formatEtherTokensEstimate } from 'utils/format-number'
import getValue from 'utils/get-value'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
// import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications'
import { NEW_MARKET_REVIEW } from 'modules/create-market/constants/new-market-creation-steps'

export default class CreateMarketReview extends Component {
  static propTypes = {
    isValid: PropTypes.bool.isRequired,
    creationError: PropTypes.string.isRequired,
    universe: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
    currentStep: PropTypes.number.isRequired,
    initialLiquidityEth: PropTypes.instanceOf(BigNumber).isRequired,
    initialLiquidityGas: PropTypes.instanceOf(BigNumber).isRequired,
    initialLiquidityFees: PropTypes.instanceOf(BigNumber).isRequired,
    settlementFee: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  };

  constructor(props) {
    super(props)

    this.state = {
      // creationFee: null,
      // gasCost: null,
      // initialLiquidity: {
      // gas: null,
      // fees: null
      // },
      formattedInitialLiquidityEth: formatEtherTokensEstimate(this.props.initialLiquidityEth),
      formattedInitialLiquidityGas: formatEtherEstimate(this.props.initialLiquidityGas),
      formattedInitialLiquidityFees: formatEtherTokensEstimate(this.props.initialLiquidityFees),
    }
  }

  componentWillMount() {
    this.calculateMarketCreationCosts()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep &&
      newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_REVIEW
    ) {
      this.calculateMarketCreationCosts()
    }

    if (this.props.initialLiquidityEth !== nextProps.initialLiquidityEth) this.setState({ formattedInitialLiquidityEth: formatEtherTokensEstimate(nextProps.initialLiquidityEth) })
    if (this.props.initialLiquidityGas !== nextProps.initialLiquidityGas) this.setState({ formattedInitialLiquidityGas: formatEtherEstimate(nextProps.initialLiquidityGas) })
    if (this.props.initialLiquidityFees !== nextProps.initialLiquidityFees) this.setState({ formattedInitialLiquidityFees: formatEtherTokensEstimate(nextProps.initialLiquidityFees) })
  }

  calculateMarketCreationCosts() {
    const self = this
    augur.createMarket.getMarketCreationCostBreakdown({
      universe: this.props.universe.id,
      _endTime: this.props.endDate.timestamp,
    }, (err, marketCreationCostBreakdown) => {
      if (err) return console.error(err)
      self.setState({
        gasCost: formatEtherEstimate(0), // FIXME real gas cost lookup
        creationFee: formatEtherEstimate(marketCreationCostBreakdown.targetReporterGasCosts),
        validityBond: formatEtherEstimate(marketCreationCostBreakdown.validityBond),
      })
    })
  }

  render() {
    const p = this.props
    const s = this.state

    const creationFee = getValue(s, 'creationFee.formatted')
    const validityBond = getValue(s, 'validityBond.formatted')
    const gasCost = getValue(s, 'gasCost.formatted')
    const liquidityEth = getValue(s, 'formattedInitialLiquidityEth.formatted')
    const liquidityGas = getValue(s, 'formattedInitialLiquidityGas.formatted')
    const liquidityFees = getValue(s, 'formattedInitialLiquidityFees.formatted')

    return (
      <article className={`create-market-form-part create-market-form-review ${p.className || ''}`}>
        <div className="create-market-form-part-content">
          <div className="create-market-form-part-input">
            <aside>
              <h3>Cost Overview</h3>
              <span>All values are <strong>estimates</strong>.</span>
            </aside>
            <div className="vertical-form-divider" />
            <form onSubmit={e => e.preventDefault()} >
              <h3>Market Creation:</h3>
              <ul>
                <li>
                  <span>
                    Creation Fee:
                  </span>
                  <span>
                    {creationFee}
                    <span className="cost-denomination">{creationFee && 'ETH'}</span>
                  </span>
                </li>
                <li>
                  <span>
                    Bond (refundable):
                  </span>
                  <span>
                    {validityBond}
                    <span className="cost-denomination">{validityBond && 'ETH'}</span>
                  </span>
                </li>
                <li>
                  <span>
                    Gas Cost:
                  </span>
                  <span>
                    {gasCost}
                    <span className="cost-denomination">{gasCost && 'ETH'}</span>
                  </span>
                </li>
              </ul>
              {(!!p.initialLiquidityEth.toNumber() || !!p.initialLiquidityGas.toNumber() || !!p.initialLiquidityFees.toNumber()) &&
                <div>
                  <h3>Initial Liquidity:</h3>
                  <ul>
                    <li>
                      <span>
                        Ether:
                      </span>
                      <span>
                        {liquidityEth}
                        <span className="cost-denomination">{liquidityEth && 'ETH Tokens'}</span>
                      </span>
                    </li>
                    <li>
                      <span>
                        Gas:
                      </span>
                      <span>
                        {liquidityGas}
                        <span className="cost-denomination">{liquidityGas && 'ETH'}</span>
                      </span>
                    </li>
                    <li>
                      <span>
                        Fees:
                      </span>
                      <span>
                        {liquidityFees}
                        <span className="cost-denomination">{liquidityFees && 'ETH Tokens'}</span>
                      </span>
                    </li>
                  </ul>
                </div>
              }
            </form>
          </div>

        </div>
      </article>
    )
  }
}

// { !p.isValid &&
//   <CreateMarketFormInputNotifications
//     errors={[p.creationError]}
//   />
// }
