import { connect } from 'react-redux'

import MarketOutcomesChart from 'modules/market/components/market-outcomes-chart/market-outcomes-chart'

const mergeProps = (sP, dP, oP) => {
  // const queryParams = parseQuery(ownProps.location.search)
  // const market = selectMarket(queryParams.id) // NOTE -- commented out for mocking sake

  const randomData = () => [...new Array(30)].map(() => [(new Date()).getTime() - (Math.random() * ((1000000000000 - 0) + 0)), (Math.random() * 1)]).sort((a, b) => a[0] - b[0])

  const market = {
    priceHistory: [
      {
        id: '1',
        name: 'outcome 1',
        data: randomData()
      },
      {
        id: '2',
        name: 'outcome 2',
        data: randomData()
      },
      {
        id: '3',
        name: 'outcome 3',
        data: randomData()
      },
      {
        id: '4',
        name: 'outcome 4',
        data: randomData()
      },
      {
        id: '5',
        name: 'outcome 5',
        data: randomData()
      },
      {
        id: '6',
        name: 'outcome 6',
        data: randomData()
      },
      {
        id: '7',
        name: 'outcome 7',
        data: randomData()
      },
      {
        id: '8',
        name: 'outcome 8',
        data: randomData()
      }
    ]
  }

  return {
    ...oP,
    priceHistory: market.priceHistory
  }
}

export default connect(null, null, mergeProps)(MarketOutcomesChart)
