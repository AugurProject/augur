import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'utils/debounce'
import fitText from 'utils/fit-text'

import ProfitLossChart from 'modules/account/components/profit-loss-chart/profit-loss-chart'

import Styles from 'modules/account/components/account-header/account-header.styles'

class AccountHeader extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    series: PropTypes.Object,
    stats: PropTypes.Object,
  }

  constructor(props) {
    super(props)

    this.updateText = debounce(this.updateText.bind(this))
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateText)

    this.updateText()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.series !== this.props.series) this.updateText()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateText)
  }

  updateText() {
    const ethContainer = this.refs.ethCurrencyContainer
    const ethTarget = this.refs.ethCurrencyValue
    const ethTargetLabel = this.refs.ethCurrencyLabel
    const repValue = this.props.stats[0].totalRep.value
    // const repValue = 100.23
    console.log('going into ETH fit:', ethContainer.clientWidth - ethTargetLabel.clientWidth, 'actCW', ethContainer.clientWidth, ethTargetLabel.clientWidth, 'targetWidth:', ethTarget.clientWidth)

    let containerWidth = ethContainer.clientWidth - ethTargetLabel.clientWidth

    containerWidth = this.props.isMobile ? containerWidth - (containerWidth * 0.2) : containerWidth

    fitText({ clientWidth: containerWidth }, ethTarget, true)

    if (repValue > 0) {
      const repContainer = this.refs.repCurrencyContainer
      const repTarget = this.refs.repCurrencyValue
      const repTargetLabel = this.refs.repCurrencyLabel

      fitText({ clientWidth: repContainer.clientWidth - repTargetLabel.clientWidth }, repTarget, true)
    }
  }

  render() {
    const p = this.props
    console.log('accountHeaderProps:', p)
    // NOTE: dummy data for now for easier testing/styling
    const ethValue = '9,000'
    // const repValue = '100.23'
    const repValue = p.stats[0].totalRep.value.formatted

    const totalPLValue = '10.000000000'
    const totalPLMonthValue = p.stats[1].totalPLMonth.value.rounded
    const totalPLDayValue = p.stats[1].totalPLDay.value.rounded

    const randomData = () => [...new Array(30)].map(() => [(new Date()).getTime() - (Math.random() * ((1000000000000 - 0) + 0)), (Math.random() * 1)]).sort((a, b) => a[0] - b[0])

    const totalPLSeries = [{
      data: randomData(),
      name: 'Total',
      color: '#553580'
    }]
    const totalPLMonthSeries = [{
      data: randomData(),
      name: 'Total',
      color: '#553580'
    }]
    const totalPLDaySeries = [{
      data: randomData(),
      name: 'Total',
      color: '#553580'
    }]

    return (
      <div
        className={Styles.AccountHeader}
      >
        <div
          ref="ethCurrencyContainer"
          title={p.stats[0].totalRealEth.title}
          className={Styles.AccountHeader__Currency}
        >
          <span
            ref="ethCurrencyValue"
            className={Styles['AccountHeader__Currency-value']}
          >
            {ethValue}
          </span>
          <span
            ref="ethCurrencyLabel"
            className={Styles['AccountHeader__Currency-label']}
          >
            {p.stats[0].totalRealEth.label}
          </span>
        </div>
        {repValue !== '0' && !p.isMobile &&
          <div
            title={p.stats[0].totalRep.title} className={Styles.AccountHeader__Currency}
            ref="repCurrencyContainer"
          >
            <span
              className={Styles['AccountHeader__Currency-value']}
              ref="repCurrencyValue"
            >
              {repValue}
            </span>
            <span
              className={Styles['AccountHeader__Currency-label']}
              ref="repCurrencyLabel"
            >
              {p.stats[0].totalRep.label}
            </span>
          </div>
        }
        <div className={Styles.AccountHeader__Charts}>
          <div className={Styles.AccountHeader__Chart}>
            <ProfitLossChart
              series={totalPLSeries}
              label={p.stats[1].totalPL.label}
              title="X Day P/L"
              id="-xDay"
              totalValue={totalPLValue}
              isMobile={p.isMobile}
            />
          </div>
          {repValue === '0' && !p.isMobile &&
            <div className={Styles.AccountHeader__Chart}>
              <ProfitLossChart
                series={totalPLMonthSeries}
                label={p.stats[1].totalPLMonth.label}
                title="30 Day P/L"
                id="-30Day"
                totalValue={totalPLMonthValue}
                isMobile={p.isMobile}
              />
            </div>
          }
          {repValue === '0' && !p.isMobile &&
            <div className={Styles.AccountHeader__Chart}>
              <ProfitLossChart
                className={Styles.AccountHeader__Chart}
                series={totalPLDaySeries}
                label={p.stats[1].totalPLDay.label}
                title="1 Day P/L"
                id="-1Day"
                totalValue={totalPLDayValue}
                isMobile={p.isMobile}
              />
            </div>
          }
        </div>
      </div>
    )
  }
}

export default AccountHeader
