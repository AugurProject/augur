

import proxyquire from 'proxyquire'

describe(`modules/transactions/actions/unpack-transaction-parameters.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const test = (t) => {
    it(t.description, () => {
      const action = proxyquire('../../../src/modules/transactions/actions/unpack-transaction-parameters.js', {})
      t.assertions(action.default(t.params.tx))
    })
  }
  test({
    description: 'unpack sent transaction parameters (buy)',
    params: {
      tx: {
        type: 'Bid',
        status: 'sent',
        data: {
          events: [
            'CreateOrder',
            'sentCash',
          ],
          gas: 725202,
          inputs: [
            'amount',
            'price',
            'market',
            'outcome',
            'minimumTradeSize',
            'tradeGroupId',
          ],
          label: 'Bid',
          name: 'buy',
          mutable: true,
          send: true,
          signature: [
            'int256',
            'int256',
            'int256',
            'int256',
            'int256',
            'int256',
          ],
          to: '0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3',
          from: '0xdceb761b558e202c993f447b470a89cec2a3b6e9',
          params: [
            '0x4563918244f40000',
            '0x6f05b59d3b20000',
            '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
            '2',
            '0x2386f26fc10000',
            '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
          ],
        },
        response: {
          hash: '0x5bde43fc683d39c9f449424760401b2de067c8bda09acbf4c61dc923c0c98878',
          txHash: '0x5bde43fc683d39c9f449424760401b2de067c8bda09acbf4c61dc923c0c98878',
          callReturn: null,
        },
      },
    },
    assertions: (output) => {
      assert.deepEqual(output, {
        amount: '0x4563918244f40000',
        price: '0x6f05b59d3b20000',
        market: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
        outcome: '2',
        minimumTradeSize: '0x2386f26fc10000',
        tradeGroupId: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
        type: 'Bid',
      })
    },
  })
  test({
    description: 'unpack successful transaction parameters (buy)',
    params: {
      tx: {
        type: 'Bid',
        status: 'success',
        data: {
          events: [
            'CreateOrder',
            'sentCash',
          ],
          gas: 725202,
          inputs: [
            'amount',
            'price',
            'market',
            'outcome',
            'minimumTradeSize',
            'tradeGroupId',
          ],
          label: 'Bid',
          name: 'buy',
          mutable: true,
          send: true,
          signature: [
            'int256',
            'int256',
            'int256',
            'int256',
            'int256',
            'int256',
          ],
          to: '0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3',
          from: '0xdceb761b558e202c993f447b470a89cec2a3b6e9',
          params: [
            '0x4563918244f40000',
            '0x6f05b59d3b20000',
            '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
            '2',
            '0x2386f26fc10000',
            '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
          ],
        },
        response: {
          blockHash: '0xc7dbd9d454ca4ff9d846f1850c8c6c4f53ec92562b4076d415f1d68b89d278f7',
          blockNumber: 1741,
          from: '0xdceb761b558e202c993f447b470a89cec2a3b6e9',
          gas: '0x47e7c4',
          gasPrice: '0x4a817c800',
          hash: '0x5bde43fc683d39c9f449424760401b2de067c8bda09acbf4c61dc923c0c98878',
          input: '0x2187e6510000000000000000000000000000000000000000000000004563918244f4000000000000000000000000000000000000000000000000000006f05b59d3b20000f7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a20000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
          nonce: '0x58',
          to: '0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3',
          transactionIndex: '0x0',
          value: '0x0',
          v: '0x1b',
          r: '0x204dd301bd7df803c7b906bfda582bae8eae92b44f926ac3cf852ff68d7b0689',
          s: '0x71565aa9a50e71c8a445ff734bf54382d0fa1733fb941c4616165fff6063180',
          timestamp: 1484208293,
          callReturn: '0x4a330392e495bdca39dd7d8617397502a21e5c6d975364471adfe76aea4b2ce7',
          gasFees: '0.00651868',
        },
      },
    },
    assertions: (output) => {
      assert.deepEqual(output, {
        amount: '0x4563918244f40000',
        price: '0x6f05b59d3b20000',
        market: '0xf7f7c43852ae0a73fe2a668b1a74a111848abeeff1797789f5b900e59eab25a2',
        outcome: '2',
        minimumTradeSize: '0x2386f26fc10000',
        tradeGroupId: '0x00000000000000000000000000000000f26324c70bfc4d83a68fd9e01c9fb036',
        type: 'Bid',
      })
    },
  })
  test({
    description: 'Unpacking pending transaction without input',
    params: {
      tx: {
        hash: '0x262f96eb267a36a58a8f6d870d8c8eb7cca78dfc26860db3a8302a72a1f0acaf',
        type: 'emergencyStop',
        status: 'pending',
        data: {
          constant: false,
          name: 'emergencyStop',
          returns: 'null',
          from: '0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb',
          to: '0xfcaf25bf38e7c86612a25ff18cb8e09ab07c9885',
          params: [],
          send: true,
        },
        response: {
          callReturn: null,
        },
      },
    },
    assertions: (output) => {
      assert.deepEqual(output, {
        type: 'emergencyStop',
      })
    },
  })
})
