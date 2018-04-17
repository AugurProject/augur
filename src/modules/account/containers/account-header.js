import { connect } from 'react-redux'

import AccountHeader from 'modules/account/components/account-header/account-header'

import { selectCoreStats } from 'modules/account/selectors/core-stats'

const mapStateToProps = (state) => {
  const coreStats = selectCoreStats(state)

  // TODO: replace wit han actual selector to get the PL data
  const randomData = () => [...new Array(30)].map(() => [(new Date()).getTime() - (Math.random() * ((1000000000000 - 0) + 0)), (Math.random() * 1)]).sort((a, b) => a[0] - b[0])
  const totalPLSeries = [{
    data: randomData(),
    name: 'Total',
    color: '#553580',
  }]
  const totalPLMonthSeries = [{
    data: randomData(),
    name: 'Total',
    color: '#553580',
  }]
  const totalPLDaySeries = [{
    data: randomData(),
    name: 'Total',
    color: '#553580',
  }]

  const series = { totalPLSeries, totalPLMonthSeries, totalPLDaySeries }

  return {
    stats: coreStats,
    series,
    isMobile: state.isMobile,
  }
}

const AccountHeaderContainer = connect(mapStateToProps)(AccountHeader)

export default AccountHeaderContainer
