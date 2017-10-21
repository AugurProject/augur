import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import noData from 'highcharts/modules/no-data-to-display'

import Styles from 'modules/account/components/account-header/account-header.styles'

// const AccountHeader = (p) => (

class AccountHeader extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    noData(Highcharts)

    Highcharts.setOptions({
      lang: {
        noData: 'No price history',
        thousandsSep: ','
      }
    })

    this.xPLChart = new Highcharts.Chart('xpl_chart', {
      title: {
        text: null
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Time'
        }
      },
      yAxis: {
        title: {
          text: 'ETH'
        }
      },
      credits: {
        enabled: false
      }
    });
    const randomData = () => [...new Array(30)].map(() => [(new Date()).getTime() - (Math.random() * ((1000000000000 - 0) + 0)), (Math.random() * 1)]).sort((a, b) => a[0] - b[0])

    this.xPLChart.addSeries({
      type: 'line',
      name: 'X Day P/L 1.00000000',
      data: randomData()
    }, false)
    this.xPLChart.redraw()
    this.thirtyDayPLChart = new Highcharts.Chart('30pl_chart', {})
    this.oneDayPLChart = new Highcharts.Chart('1pl_chart', {})
  }

  calcFontSize(value) {
    // the container is 26.25rem, or 420 px, 16 px is the base, the 3 character
    // label for the currency is roughly 44 px + another 8px for a space = 52px.
    // 420 - 52 = 368, 368 / 16 = 23. so 23rem is our space to fill with text.
    const CurrencyWidth = 23;
    let size = (CurrencyWidth / value.length * 2)
    size = size > 10 ? 10 : size
    size = size + 'rem'
    return size;
  }

  render () {
    const p = this.props
    console.log(p)
    // NOTE: dummy data for now for easier testing/styling
    const ethValue = '9,000'
    const repValue = '47.932'

    const ethSize = this.calcFontSize(ethValue);
    const repSize = this.calcFontSize(repValue);

    return (
      <div
        className={Styles.AccountHeader}
      >
        <div
          title={p.stats[0].totalRealEth.title} className={Styles.AccountHeader__Currency}
        >
          <span className={Styles['AccountHeader__Currency-value']} style={{fontSize: ethSize}}>{ethValue}</ span>
          <span className={Styles['AccountHeader__Currency-label']}>{p.stats[0].totalRealEth.label}</ span>
        </ div>
        {repValue !== '0' &&
          <div
            title={p.stats[0].totalRep.title} className={Styles.AccountHeader__Currency}
          >
            <span className={Styles['AccountHeader__Currency-value']} style={{fontSize: repSize}}>{repValue}</ span>
            <span className={Styles['AccountHeader__Currency-label']}>{p.stats[0].totalRep.label}</ span>
          </div>
        }
        <div
          className={Styles.AccountHeader__Chart}
          id="xpl_chart"
        />
        {repValue == '0' &&
          <div
            className={Styles.AccountHeader__Chart}
            id="30pl_chart"
          />
        }
        {repValue == '0' &&
          <div
            className={Styles.AccountHeader__Chart}
            id="1pl_chart"
          />
        }
      </div>
    )
  }
}

export default AccountHeader
