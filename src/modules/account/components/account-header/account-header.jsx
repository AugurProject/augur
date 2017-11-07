import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'utils/debounce'
import fitText from 'utils/fit-text'

import ProfitLossChart from 'modules/account/components/profit-loss-chart/profit-loss-chart'

import Styles from 'modules/account/components/account-header/account-header.styles'

class AccountHeader extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    series: PropTypes.object,
    stats: PropTypes.array,
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
    const ethContainer = this.ethCurrencyContainer
    const ethTarget = this.ethCurrencyValue
    const repValue = this.props.stats[0].totalRep.value

    let containerWidth = ethContainer.clientWidth
    // on mobile we want to reduce scaling by roughly 30%, otherwise fitText default
    containerWidth = this.props.isMobile ? containerWidth - (containerWidth * 0.3) : containerWidth
    // @params: container, target, scaleUp, maxScale
    fitText({ clientWidth: containerWidth }, ethTarget, true, 10)

    if (repValue > 0) {
      const repContainer = this.repCurrencyContainer
      const repTarget = this.repCurrencyValue
      // @params: container, target, scaleUp, maxScale
      fitText({ clientWidth: repContainer.clientWidth }, repTarget, true, 10)
    }
  }

  render() {
    const p = this.props
    // assign defaults incase we have nulls for value
    const ethValue = p.stats[0].totalRealEth.value.formatted
    const repValue = p.stats[0].totalRep.value.formatted
    const totalPLValue = p.stats[1].totalPL.value === null ? '0.0000' : p.stats[1].totalPL.value.rounded
    const totalPLMonthValue = p.stats[1].totalPLMonth.value === null ? '0' : p.stats[1].totalPLMonth.value.rounded
    const totalPLDayValue = p.stats[1].totalPLDay.value === null ? '0' : p.stats[1].totalPLDay.value.rounded

    return (
      <div
        className={Styles.AccountHeader}
      >
        <div
          ref={(ethCurrencyContainer) => { this.ethCurrencyContainer = ethCurrencyContainer }}
          title={p.stats[0].totalRealEth.title}
          className={Styles.AccountHeader__Currency}
        >
          <span
            ref={(ethCurrencyValue) => { this.ethCurrencyValue = ethCurrencyValue }}
            className={Styles['AccountHeader__Currency-value']}
          >
            {ethValue}
            <span
              ref={(ethCurrencyLabel) => { this.ethCurrencyLabel = ethCurrencyLabel }}
              className={Styles['AccountHeader__Currency-label']}
            >
              {p.stats[0].totalRealEth.label}
            </span>
          </span>
        </div>
        {repValue !== '0' && !p.isMobile &&
          <div
            ref={(repCurrencyContainer) => { this.repCurrencyContainer = repCurrencyContainer }}
            title={p.stats[0].totalRep.title} className={Styles.AccountHeader__Currency}
          >
            <span
              ref={(repCurrencyValue) => { this.repCurrencyValue = repCurrencyValue }}
              className={Styles['AccountHeader__Currency-value']}
            >
              {repValue}
              <span
                ref={(repCurrencyLabel) => { this.repCurrencyLabel = repCurrencyLabel }}
                className={Styles['AccountHeader__Currency-label']}
              >
                {p.stats[0].totalRep.label}
              </span>
            </span>
          </div>
        }
        <div className={Styles.AccountHeader__Charts}>
          <div className={Styles.AccountHeader__Chart}>
            <ProfitLossChart
              series={p.series.totalPLSeries}
              label={p.stats[1].totalPL.label}
              title="X Day P/L"
              id="_X_Day"
              totalValue={totalPLValue}
              isMobile={p.isMobile}
            />
          </div>
          {repValue === '0' && !p.isMobile &&
            <div className={Styles.AccountHeader__Chart}>
              <ProfitLossChart
                series={p.series.totalPLMonthSeries}
                label={p.stats[1].totalPLMonth.label}
                title="30 Day P/L"
                id="_30_Day"
                totalValue={totalPLMonthValue}
                isMobile={p.isMobile}
              />
            </div>
          }
          {repValue === '0' && !p.isMobile &&
            <div className={Styles.AccountHeader__Chart}>
              <ProfitLossChart
                className={Styles.AccountHeader__Chart}
                series={p.series.totalPLDaySeries}
                label={p.stats[1].totalPLDay.label}
                title="1 Day P/L"
                id="_1_Day"
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
