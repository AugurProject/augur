import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { loadAccountHistory } from 'modules/auth/actions/load-account-history'
import TransactionsList from 'modules/portfolio/components/transactions/transactions'

const mapStateToProps = state => ({
  transactions: state.transactions,
  transactionsLoading: state.transactionsLoading,
})

const mapDispatchToProps = dispatch => ({
  // TODO: need to get parameters from configuation?
  loadAccountHistoryTransactions: () => dispatch(loadAccountHistory(true, false))
})

const Transactions = withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionsList))

export default Transactions

/*
const dummyTransactions = [
  {
    hash: '0x5fac9266041e13f4d70574e75ceef6ffe5a4e67dc4819dec524988a93aa478f8',
    status: 'pending order',
    description: 'BTC will hit the 5000$ mark by 01-01-2018',
    message: '1. Buy 80 shares @ 0.5000 ETH',
    timestamp: {
      value: '2017-10-27T22:49:26.000Z',
      formatted: 'Oct 27, 2017 10:49 PM',
      formattedLocal: 'Oct 27, 2017 3:49 PM (UTC -7)',
      full: 'Fri, 27 Oct 2017 22:49:26 GMT',
      timestamp: 1509144566000
    },
    transactions: [
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
    ],
  },
  {
    hash: '0x5fac9266041e13f4d70514e75ceef6ff05a4e67dc4819dec524988a93aa478f8',
    status: 'pending order',
    description: 'BTC will hit the 5000$ mark by 01-01-2018',
    message: '2. Buy 80 shares @ 0.5000 ETH',
    timestamp: {
      value: '2017-10-27T22:49:26.000Z',
      formatted: 'Oct 27, 2017 10:49 PM',
      formattedLocal: 'Oct 27, 2017 3:49 PM (UTC -7)',
      full: 'Fri, 27 Oct 2017 22:49:26 GMT',
      timestamp: 1509144566000
    },
    transactions: [
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
    ],
  },
  {
    hash: '0x5fac9266041e13f4d70574e75ceef6ff25a4e67dc4819dec524988a93aa478f8',
    status: 'pending order',
    description: 'BTC will hit the 5000$ mark by 01-01-2018',
    message: '3. Buy 80 shares @ 0.5000 ETH',
    timestamp: {
      value: '2017-10-27T22:49:26.000Z',
      formatted: 'Oct 27, 2017 10:49 PM',
      formattedLocal: 'Oct 27, 2017 3:49 PM (UTC -7)',
      full: 'Fri, 27 Oct 2017 22:49:26 GMT',
      timestamp: 1509144566000
    },
    transactions: [
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
    ],
  },
  {
    hash: '0x5fac9266041e13f4d70574e75ceef6fe05a4e67dc4819dec524988a93aa478f8',
    status: 'pending order',
    description: 'BTC will hit the 5000$ mark by 01-01-2018',
    message: '4. Buy 80 shares @ 0.5000 ETH',
    timestamp: {
      value: '2017-10-27T22:49:26.000Z',
      formatted: 'Oct 27, 2017 10:49 PM',
      formattedLocal: 'Oct 27, 2017 3:49 PM (UTC -7)',
      full: 'Fri, 27 Oct 2017 22:49:26 GMT',
      timestamp: 1509144566000
    },
    transactions: [
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
    ],
  },
  {
    hash: '0x5fac9266041e13f4d70574e7dceef6ff05a4e67dc4819dec524988a93aa478f8',
    status: 'pending order',
    description: 'BTC will hit the 5000$ mark by 01-01-2018',
    message: '5. Buy 80 shares @ 0.5000 ETH',
    timestamp: {
      value: '2017-10-27T22:49:26.000Z',
      formatted: 'Oct 27, 2017 10:49 PM',
      formattedLocal: 'Oct 27, 2017 3:49 PM (UTC -7)',
      full: 'Fri, 27 Oct 2017 22:49:26 GMT',
      timestamp: 1509144566000
    },
    transactions: [
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
    ],
  },
  {
    hash: '0x5fac9266041e13f4d70574e75ceef6ff05a4e67dc4819dec524988a93aa478f8',
    status: 'pending order',
    description: 'BTC will hit the 5000$ mark by 01-01-2018',
    message: '6. Buy 80 shares @ 0.5000 ETH',
    timestamp: {
      value: '2017-10-27T22:49:26.000Z',
      formatted: 'Oct 27, 2017 10:49 PM',
      formattedLocal: 'Oct 27, 2017 3:49 PM (UTC -7)',
      full: 'Fri, 27 Oct 2017 22:49:26 GMT',
      timestamp: 1509144566000
    },
    transactions: [
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
    ],
  },
  {
    hash: '0x5fac9266041e13f4d70574e75ceef6ff05d4e67dc4819dec52c988a93aa478f8',
    status: 'pending order',
    description: 'How many marine species will go extinct between January 1, 2016 and January 1, 2018?',
    message: '7. Buy 10 shares @ 0.2000 ETH',
    timestamp: {
      value: '2017-10-27T22:49:26.000Z',
      formatted: 'Oct 27, 2017 10:49 PM',
      formattedLocal: 'Oct 27, 2017 3:49 PM (UTC -7)',
      full: 'Fri, 27 Oct 2017 22:49:26 GMT',
      timestamp: 1509144566000
    },
    transactions: [
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
      {
        message: 'Buy 5 shares @ 0.1000 ETH',
        open: true,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
    ],
  },
  {
    hash: '0x5fac9266141e13f4d70574e75ceef6ff05d4e67dc4819dec52c988a93aa478f8',
    status: 'pending order',
    description: 'How many marine species will go extinct between January 1, 2016 and January 1, 2018?',
    message: '8. Buy 10 shares @ 0.2000 ETH',
    timestamp: {
      value: '2017-10-27T22:49:26.000Z',
      formatted: 'Oct 27, 2017 10:49 PM',
      formattedLocal: 'Oct 27, 2017 3:49 PM (UTC -7)',
      full: 'Fri, 27 Oct 2017 22:49:26 GMT',
      timestamp: 1509144566000
    },
    transactions: [
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
      {
        message: 'Buy 5 shares @ 0.1000 ETH',
        open: true,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
    ],
  },
  {
    hash: '0x5fac9266041e13f4d70574e75ceef6ff05a4e67dc4819dec52c981a93aa478f8',
    status: 'submitted order',
    description: 'How many new antibiotics will be approved by the FDA between March 1, 2016 and the end of 2020?',
    message: '9. Buy 50 shares @ 0.7000 ETH',
    timestamp: {
      value: '2017-10-27T22:49:26.000Z',
      formatted: 'Oct 27, 2017 10:49 PM',
      formattedLocal: 'Oct 27, 2017 3:49 PM (UTC -7)',
      full: 'Fri, 27 Oct 2017 22:49:26 GMT',
      timestamp: 1509144566000
    },
    transactions: [
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
    ],
  },
  {
    hash: '0x5fac9266041e13f4d70574e75ceef6ff05a4e67dc4819def52c988a93aa478f8',
    status: 'pending order',
    description: 'What will the average tropospheric methane concentration (in parts-per-billion) be between January 1, 2017 and January 1, 2018?',
    message: '10. Buy 5 shares @ 0.4000 ETH',
    timestamp: {
      value: '2017-10-27T22:49:26.000Z',
      formatted: 'Oct 27, 2017 10:49 PM',
      formattedLocal: 'Oct 27, 2017 3:49 PM (UTC -7)',
      full: 'Fri, 27 Oct 2017 22:49:26 GMT',
      timestamp: 1509144566000
    },
    transactions: [
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
    ],
  },
  {
    hash: '0x5fac9266041e13f4d70574e75ceef6ff05d4e67dc4819dec52c988a935a478f8',
    status: 'pending order',
    description: 'How many marine species will go extinct between January 1, 2016 and January 1, 2018?',
    message: '11. Buy 10 shares @ 0.2000 ETH',
    timestamp: {
      value: '2017-10-27T22:49:26.000Z',
      formatted: 'Oct 27, 2017 10:49 PM',
      formattedLocal: 'Oct 27, 2017 3:49 PM (UTC -7)',
      full: 'Fri, 27 Oct 2017 22:49:26 GMT',
      timestamp: 1509144566000
    },
    transactions: [
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
      {
        message: 'Buy 5 shares @ 0.4000 ETH',
        open: false,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
      {
        message: 'Buy 5 shares @ 0.1000 ETH',
        open: true,
        meta: {
          'froze funds': '12.0000 ETH +0.0600 ETH Tokens in potential trading fees',
          'gas cost': '0.3940 ETH',
          status: 'Success',
          confirmations: '245,991',
        },
      },
    ],
  },
]
*/