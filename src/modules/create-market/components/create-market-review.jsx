import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { augur, abi, rpc, constants } from 'services/augurjs'
import BigNumber from 'bignumber.js'

import { formatEtherEstimate, formatEtherTokensEstimate } from 'utils/format-number'
import getValue from 'utils/get-value'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications'
import { NEW_MARKET_REVIEW } from 'modules/create-market/constants/new-market-creation-steps'

export default class CreateMarketReview extends Component {
  static propTypes = {
    isValid: PropTypes.bool.isRequired,
    creationError: PropTypes.string.isRequired,
    branch: PropTypes.object.isRequired,
    currentStep: PropTypes.number.isRequired,
    initialLiquidityEth: PropTypes.instanceOf(BigNumber).isRequired,
    initialLiquidityGas: PropTypes.instanceOf(BigNumber).isRequired,
    initialLiquidityFees: PropTypes.instanceOf(BigNumber).isRequired,
    takerFee: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    makerFee: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
  };

  constructor(props) {
    super(props)

    this.state = {
      creationFee: null,
      marketEventBond: null,
      gasCost: null,
      initialLiquidity: {
        gas: null,
        fees: null
      },
      formattedInitialLiquidityEth: formatEtherTokensEstimate(this.props.initialLiquidityEth),
      formattedInitialLiquidityGas: formatEtherEstimate(this.props.initialLiquidityGas),
      formattedInitialLiquidityFees: formatEtherTokensEstimate(this.props.initialLiquidityFees)
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
    const gasPrice = rpc.gasPrice || constants.DEFAULT_GASPRICE

    // TODO augur.api.functions -> getState().functionsAPI
    const gasCost = formatEtherEstimate(augur.trading.simulation.getTxGasEth({ ...augur.api.CreateMarket.createMarket }, gasPrice))
    const creationFee = formatEtherEstimate(abi.unfix(augur.create.calculateRequiredMarketValue(gasPrice)))

    // Event Bond
    const tradingFee = augur.trading.fees.calculateTradingFees(this.props.makerFee, this.props.takerFee).tradingFee
    const validityBond = augur.create.calculateValidityBond(tradingFee, this.props.branch.periodLength, this.props.branch.baseReporters, this.props.branch.numEventsCreatedInPast24Hours, this.props.branch.numEventsInReportPeriod)
    const eventBond = formatEtherEstimate(validityBond)

    this.setState({
      gasCost,
      creationFee,
      eventBond
    })
  }

  render() {
    const p = this.props
    const s = this.state

    const creationFee = getValue(s, 'creationFee.formatted')
    const eventBond = getValue(s, 'eventBond.formatted')
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
                    {eventBond}
                    <span className="cost-denomination">{eventBond && 'ETH Tokens'}</span>
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
          { !p.isValid &&
            <CreateMarketFormInputNotifications
              errors={[p.creationError]}
            />
          }
        </div>
      </article>
    )
  }
}
