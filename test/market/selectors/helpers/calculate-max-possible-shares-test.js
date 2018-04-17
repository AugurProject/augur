

describe('<whatever>', () => {
  // TODO: need to add test after fee calcuation logic has been updated
  /*
  const { calculateMaxPossibleShares, __RewireAPI__ } = require('modules/market/selectors/helpers/calculate-max-possible-shares');
  const augur = {
    trading: {
      fees: {
        calculateFxpTradingCost: (amt, num, tradingFee, makerPropFee, range) => {
          return {
            fee: tradingFee,
            cost: amt
          };
        },
        calculateFxpTradingFees: (makerFee, settlementFee) => {
          return { tradingFee: makerFee, makerProportionOfFee: settlementFee };
        }
      },
      shrinkScalarPrice: (scalarMinValue, fullPrecisionPrice) => {
        return (fullPrecisionPrice);
      }
    }
  };
  __RewireAPI__.__Rewire__('augur', augur);
  */
  const test = (t) => {
    it(t.description, (done) => {
      t.assertions(null)
      done()
    })
  }

  test({
    description: '<todo test>',
    assertions: (result) => {
      assert.deepEqual(true, true, 'need better test')
    },
  })
})
