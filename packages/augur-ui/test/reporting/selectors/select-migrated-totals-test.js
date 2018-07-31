import immutableDelete from 'immutable-delete'
import { YES_NO, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import selectMigratedTotals, { __RewireAPI__ as RewireAPI } from 'modules/reporting/selectors/select-migrated-totals'


describe(`modules/reporting/selectors/select-migrated-totals.js`, () => {

  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  after(() => {
    RewireAPI.__ResetDependency__('formatAttoRep')
  })

  const marketBinary = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10000,
    numOutcomes: 2,
    marketType: YES_NO,
    reportableOutcomes: [{ id: '0', name: 'No' }, { id: '1', name: 'Yes' }, { id: '0.5', name: 'Indeterminate' }],
  }

  const marketCategorical = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10003,
    numOutcomes: 7,
    marketType: CATEGORICAL,
    reportableOutcomes: [
      { id: '0', name: 'Bob' },
      { id: '1', name: 'Sue' },
      { id: '2', name: 'John' },
      { id: '3', name: 'Mark' },
      { id: '4', name: 'Joe' },
      { id: '5', name: 'Mike' },
      { id: '6', name: 'Ed' },
      { id: '0.5', name: 'Indeterminate' },
    ],
  }

  const marketScalar = {
    maxPrice: 100,
    minPrice: 0,
    numTicks: 10000,
    tickSize: 4,
    numOutcomes: 2,
    marketType: SCALAR,
    reportableOutcomes: [{ id: '0.5', name: 'Indeterminate' }],
  }

  const echoStub = (value) => {
    const result = { formatted: value.toString(), fullPrecision: value }
    return result
  }

  RewireAPI.__Rewire__('formatAttoRep', echoStub)

  test({
    description: `scalar market with more than 9 disputes and includes indeterminate`,
    assertions: () => {
      const totals = {
        2202: {
          repTotal: 201,
          winner: false,
          isInvalid: false,
        },
        2200: {
          repTotal: 11,
          winner: false,
          isInvalid: false,
        },
        0.5: {
          repTotal: 135,
          winner: false,
          isInvalid: true,
        },
        2221: {
          repTotal: 31,
          winner: false,
          isInvalid: false,
        },
        2122: {
          repTotal: 131,
          winner: false,
          isInvalid: false,
        },
        1222: {
          repTotal: 221,
          winner: false,
          isInvalid: false,
        },
        2332: {
          repTotal: 230,
          winner: false,
          isInvalid: false,
        },
        2552: {
          repTotal: 231,
          winner: false,
          isInvalid: false,
        },
        2113: {
          repTotal: 2.33,
          winner: false,
          isInvalid: false,
        },
        21: {
          repTotal: 1.33,
          winner: false,
          isInvalid: false,
        },
        211: {
          repTotal: 0.33,
          winner: false,
          isInvalid: false,
        },
      }

      const expected = [
        { ...immutableDelete(totals[2552], 'repTotal'), name: '2552', id: '2552', rep: { formatted: '231', fullPrecision: 231 } },
        { ...immutableDelete(totals[2332], 'repTotal'), name: '2332', id: '2332', rep: { formatted: '230', fullPrecision: 230 } },
        { ...immutableDelete(totals[1222], 'repTotal'), name: '1222', id: '1222', rep: { formatted: '221', fullPrecision: 221 } },
        { ...immutableDelete(totals[2202], 'repTotal'), name: '2202', id: '2202', rep: { formatted: '201', fullPrecision: 201 } },
        { ...immutableDelete(totals[0.5], 'repTotal'), name: 'Indeterminate', id: '0.5', rep: { formatted: '135', fullPrecision: 135 } },
        { ...immutableDelete(totals[2122], 'repTotal'), name: '2122', id: '2122', rep: { formatted: '131', fullPrecision: 131 } },
        { ...immutableDelete(totals[2221], 'repTotal'), name: '2221', id: '2221', rep: { formatted: '31', fullPrecision: 31 } },
        { ...immutableDelete(totals[2200], 'repTotal'), name: '2200', id: '2200', rep: { formatted: '11', fullPrecision: 11 } },
      ]

      const actual = selectMigratedTotals(marketScalar.reportableOutcomes, totals)
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `scalar market with more than 9 disputes and without indeterminate`,
    assertions: () => {
      const totals = {
        2202: {
          repTotal: 201,
          winner: false,
          isInvalid: false,
        },
        2200: {
          repTotal: 11,
          winner: false,
          isInvalid: false,
        },
        2221: {
          repTotal: 31,
          winner: false,
          isInvalid: false,
        },
        2122: {
          repTotal: 131,
          winner: false,
          isInvalid: false,
        },
        1222: {
          repTotal: 221,
          winner: false,
          isInvalid: false,
        },
        2332: {
          repTotal: 230,
          winner: false,
          isInvalid: false,
        },
        2552: {
          repTotal: 231,
          winner: false,
          isInvalid: false,
        },
        2113: {
          repTotal: 2.33,
          winner: false,
          isInvalid: false,
        },
        21: {
          repTotal: 1.33,
          winner: false,
          isInvalid: false,
        },
        211: {
          repTotal: 0.33,
          winner: false,
          isInvalid: false,
        },
      }
      const expected = [
        { ...immutableDelete(totals[2552], 'repTotal'), name: '2552', id: '2552', rep: { formatted: '231', fullPrecision: 231 } },
        { ...immutableDelete(totals[2332], 'repTotal'), name: '2332', id: '2332', rep: { formatted: '230', fullPrecision: 230 } },
        { ...immutableDelete(totals[1222], 'repTotal'), name: '1222', id: '1222', rep: { formatted: '221', fullPrecision: 221 } },
        { ...immutableDelete(totals[2202], 'repTotal'), name: '2202', id: '2202', rep: { formatted: '201', fullPrecision: 201 } },
        { ...immutableDelete(totals[2122], 'repTotal'), name: '2122', id: '2122', rep: { formatted: '131', fullPrecision: 131 } },
        { ...immutableDelete(totals[2221], 'repTotal'), name: '2221', id: '2221', rep: { formatted: '31', fullPrecision: 31 } },
        { ...immutableDelete(totals[2200], 'repTotal'), name: '2200', id: '2200', rep: { formatted: '11', fullPrecision: 11 } },
        { ...immutableDelete(totals[2113], 'repTotal'), name: '2113', id: '2113', rep: { formatted: '2.33', fullPrecision: 2.33 } },
        { ...totals[0.5], name: 'Indeterminate', id: '0.5', winner: false, rep: { formatted: '0', fullPrecision: 0 } },
      ]
      const actual = selectMigratedTotals(marketScalar.reportableOutcomes, totals)
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `yes/no  market with NO disputes`,
    assertions: () => {
      const actual = selectMigratedTotals(marketBinary.reportableOutcomes, {})
      const expected = [
        { ...marketBinary.reportableOutcomes[0], rep: '0', winner: false, isInvalid: false },
        { ...marketBinary.reportableOutcomes[1], rep: '0', winner: false, isInvalid: false },
        { ...marketBinary.reportableOutcomes[2], rep: '0', winner: false, isInvalid: true },
      ]

      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `category market with NO disputes`,
    assertions: () => {
      const actual = selectMigratedTotals(marketCategorical.reportableOutcomes, {})
      const expected = [
        { ...marketCategorical.reportableOutcomes[0], rep: '0', winner: false, isInvalid: false },
        { ...marketCategorical.reportableOutcomes[1], rep: '0', winner: false, isInvalid: false },
        { ...marketCategorical.reportableOutcomes[2], rep: '0', winner: false, isInvalid: false },
        { ...marketCategorical.reportableOutcomes[3], rep: '0', winner: false, isInvalid: false },
        { ...marketCategorical.reportableOutcomes[4], rep: '0', winner: false, isInvalid: false },
        { ...marketCategorical.reportableOutcomes[5], rep: '0', winner: false, isInvalid: false },
        { ...marketCategorical.reportableOutcomes[6], rep: '0', winner: false, isInvalid: false },
        { ...marketCategorical.reportableOutcomes[7], rep: '0', winner: false, isInvalid: true },
      ]
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  test({
    description: `scalar market with NO disputes`,
    assertions: () => {
      const actual = selectMigratedTotals(marketScalar.reportableOutcomes, {})
      const expected = [
        {
          id: '0.5',
          rep: '0',
          name: 'Indeterminate',
          winner: false,
          isInvalid: true,
        },
      ]
      assert.deepEqual(actual, expected, `Didn't call the expected method`)
    },
  })
})
