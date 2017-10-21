import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import Highcharts from 'highcharts'
// import noData from 'highcharts/modules/no-data-to-display'

import Styles from 'modules/account/components/account-header/account-header.styles'

// const AccountHeader = (p) => (

class AccountHeader extends Component {
  constructor(props) {
    super(props)
  }

  // componentDidMount() {
  //   noData(Highcharts)
  //
  //   Highcharts.setOptions({
  //     lang: {
  //       thousandsSep: ','
  //     }
  //   })

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
        <div
          title={p.stats[0].totalRep.title} className={Styles.AccountHeader__Currency}
        >
          <span className={Styles['AccountHeader__Currency-value']} style={{fontSize: repSize}}>{repValue}</ span>
          <span className={Styles['AccountHeader__Currency-label']}>{p.stats[0].totalRep.label}</ span>
        </div>
      </div>
    )
  }
}

export default AccountHeader
