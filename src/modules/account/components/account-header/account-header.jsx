import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ProfitLossChart from 'modules/account/components/profit-loss-chart/profit-loss-chart'

import Styles from 'modules/account/components/account-header/account-header.styles'

class AccountHeader extends Component {
  constructor(props) {
    super(props)
  }

  calcFontSize(value) {
    // Desktop:
    // the container is 26.25rem, or 420 px, 16 px is the base, the 3 character
    // label for the currency is roughly 44 px + another 8px for a space = 52px.
    // 420 - 52 = 368, 368 / 16 = 23. so 23rem is our space to fill with text.
    console.log('windowWidth:', window.visualViewport.width);

    let CurrencyWidth = 23;
    if (this.props.isMobile) {
      CurrencyWidth = window.visualViewport.width - 52 / 16;
    }
    let size = (CurrencyWidth / value.length * 2)
    console.log('size',  size)
    if (this.props.isMobile) {
      size = size / (16 / 5 * 10)
    } else {
      size = size > 10 ? 10 : size
    }
    size = size + 'rem'
    return size;
  }

  render () {
    const p = this.props
    console.log(p)
    // NOTE: dummy data for now for easier testing/styling
    const ethValue = '9,000'
    // const repValue = '47.932'
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

    const ethSize = this.calcFontSize(ethValue);
    const repSize = this.calcFontSize(repValue);

    return (
      <div
        className={Styles.AccountHeader}
      >
        <div
          ref="ethCurrencyContainer"
          title={p.stats[0].totalRealEth.title} className={Styles.AccountHeader__Currency}
        >
          <span className={Styles['AccountHeader__Currency-value']} style={{fontSize: ethSize}}>{ethValue}</ span>
          <span className={Styles['AccountHeader__Currency-label']}>{p.stats[0].totalRealEth.label}</ span>
        </ div>
        {repValue !== '0' && !p.isMobile &&
          <div
            title={p.stats[0].totalRep.title} className={Styles.AccountHeader__Currency}
          >
            <span className={Styles['AccountHeader__Currency-value']} style={{fontSize: repSize}}>{repValue}</ span>
            <span className={Styles['AccountHeader__Currency-label']}>{p.stats[0].totalRep.label}</ span>
          </div>
        }
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
        {repValue == '0' && !p.isMobile &&
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
        {repValue == '0' && !p.isMobile &&
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
    )
  }
}

export default AccountHeader
