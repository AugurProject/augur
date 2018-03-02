import { describe, it } from 'mocha'
import { assert } from 'chai'
import sinon from 'sinon'

import {
  generateOutcomePositionSummary,
  generateMarketsPositionsSummary,
  generatePositionsSummary,
} from 'modules/my-positions/selectors/my-positions-summary'

import { formatEtherTokens, formatShares, formatNumber } from 'utils/format-number'

describe(`modules/my-positions/selectors/my-positions-summary.js`, () => {
  describe('default', () => {
    const proxyquire = require('proxyquire')
    proxyquire.noPreserveCache().noCallThru()

    const test = (t) => {
      it(t.description, () => {
        t.assertions()
      })
    }

    test({
      description: `should return null if there ARE NO markets with positions`,
      assertions: (store) => {
        const mockSelectMyPositions = sinon.stub().returns([])

        const selector = proxyquire('../../../src/modules/my-positions/selectors/my-positions-summary', {
          './my-positions': mockSelectMyPositions,
        })

        const actual = selector.default()

        const expected = null

        assert.strictEqual(actual, expected, `Didn't return the expect object`)
      },
    })

    test({
      description: `should return the expected object if there ARE markets with positions AND no outcomes have position object`,
      assertions: (store) => {
        const mockSelectMyPositions = sinon.stub().returns([
          {
            id: '0xMARKETID1',
            myPositionsSummary: {
              numPositions: formatNumber(1, {
                decimals: 0,
                decimalsRounded: 0,
                denomination: 'Positions',
                positiveSign: false,
                zeroStyled: false,
              }),
              qtyShares: formatShares(1),
              purchasePrice: formatEtherTokens(0.2),
              realizedNet: formatEtherTokens(0),
              unrealizedNet: formatEtherTokens(0),
              totalNet: formatEtherTokens(0),
            },
            outcomes: [{}],
          },
        ])

        const selector = proxyquire('../../../src/modules/my-positions/selectors/my-positions-summary', {
          './my-positions': mockSelectMyPositions,
        })

        const actual = selector.default()

        const expected = {
          numPositions: formatNumber(0, {
            decimals: 0,
            decimalsRounded: 0,
            denomination: 'Positions',
            positiveSign: false,
            zeroStyled: false,
          }),
          qtyShares: formatShares(0),
          purchasePrice: formatEtherTokens(0),
          realizedNet: formatEtherTokens(0),
          unrealizedNet: formatEtherTokens(0),
          totalNet: formatEtherTokens(0),
          positionOutcomes: [],
        }

        assert.deepEqual(actual, expected, `Didn't return the expect object`)
      },
    })
  })

  describe('generateOutcomePositionSummary', () => {
    const proxyquire = require('proxyquire')
    proxyquire.noPreserveCache().callThru()

    const test = (t) => {
      it(t.description, () => {
        t.assertions()
      })
    }

    test({
      description: `should return the expected value when adjusted positions are undefined`,
      assertions: () => {
        const actual = generateOutcomePositionSummary(undefined)

        const expected = null

        assert.strictEqual(actual, expected, `Didn't return the expected value`)
      },
    })

    test({
      description: `should return the expected value when adjusted positions are defined AND position is zero`,
      assertions: () => {

        const actual = generateOutcomePositionSummary([])

        const expected = {
          numPositions: formatNumber(0, {
            decimals: 0,
            decimalsRounded: 0,
            denomination: 'Positions',
            positiveSign: false,
            zeroStyled: false,
          }),
          qtyShares: formatShares(0),
          purchasePrice: formatEtherTokens(0),
          realizedNet: formatEtherTokens(0),
          unrealizedNet: formatEtherTokens(0),
          totalNet: formatEtherTokens(0),
          isClosable: false,
        }

        // More verbose since a `deepEqual` can't properly check equality w/ objects containing functions
        assert.deepEqual(actual.numPositions, expected.numPositions, `numPositions Didn't return the expected object`)
        assert.deepEqual(actual.qtyShares, expected.qtyShares, `qtyShares Didn't return the expected object`)
        assert.deepEqual(actual.purchasePrice, expected.purchasePrice, `purchasePrice Didn't return the expected object`)
        assert.deepEqual(actual.realizedNet, expected.realizedNet, `realizedNet Didn't return the expected object`)
        assert.deepEqual(actual.unrealizedNet, expected.unrealizedNet, `unrealizedNet Didn't return the expected object`)
        assert.deepEqual(actual.totalNet, expected.totalNet, `totalNet Didn't return the expected object`)
        assert.strictEqual(actual.isClosable, expected.isClosable, `isClosable Didn't return the expected value`)
        assert.isFunction(actual.closePosition, `closePosition Didn't return a function as expected`)
      },
    })

    test({
      description: `should return the expected value when adjusted positions are defined AND position is non-zero`,
      assertions: () => {

        const actual = generateOutcomePositionSummary([{
          averagePrice: 0.2,
          marketId: 'marketId',
          numShares: 8,
          numSharesAdjusted: 10,
          outcome: 3,
          realizedProfitLoss: 0.1,
          unrealizedProfitLoss: 0.5,
        }])

        const expected = {
          numPositions: formatNumber(1, {
            decimals: 0,
            decimalsRounded: 0,
            denomination: 'Positions',
            positiveSign: false,
            zeroStyled: false,
          }),
          qtyShares: formatShares(10),
          purchasePrice: formatEtherTokens(0.2),
          realizedNet: formatEtherTokens(0.1),
          unrealizedNet: formatEtherTokens(0.5),
          totalNet: formatEtherTokens(0.6),
          isClosable: true,
        }

        // More verbose since a `deepEqual` can't properly check equality w/ objects containing functions
        assert.deepEqual(actual.numPositions, expected.numPositions, `numPositions Didn't return the expected object`)
        assert.deepEqual(actual.qtyShares, expected.qtyShares, `qtyShares Didn't return the expected object`)
        assert.deepEqual(actual.purchasePrice, expected.purchasePrice, `purchasePrice Didn't return the expected object`)
        assert.deepEqual(actual.realizedNet, expected.realizedNet, `realizedNet Didn't return the expected object`)
        assert.deepEqual(actual.unrealizedNet, expected.unrealizedNet, `unrealizedNet Didn't return the expected object`)
        assert.deepEqual(actual.totalNet, expected.totalNet, `totalNet Didn't return the expected object`)
        assert.strictEqual(actual.isClosable, expected.isClosable, `isClosable Didn't return the expected value`)
        assert.isFunction(actual.closePosition, `closePosition Didn't return a function as expected`)
      },
    })
  })

  describe('generateMarketsPositionsSummary', () => {
    const test = (t) => {
      it(t.description, () => {
        t.assertions()
      })
    }

    test({
      description: `should return the expected value when markets are undefined`,
      assertions: () => {
        const actual = generateMarketsPositionsSummary([])

        const expected = null

        assert.strictEqual(actual, expected, `Didn't return the expected value`)
      },
    })

    test({
      description: `should return the expected object if there ARE markets with positions AND no outcomes have position object`,
      assertions: (store) => {
        const actual = generateMarketsPositionsSummary([
          {
            id: '0xMARKETID1',
            myPositionsSummary: {
              numPositions: formatNumber(1, {
                decimals: 0,
                decimalsRounded: 0,
                denomination: 'Positions',
                positiveSign: false,
                zeroStyled: false,
              }),
              qtyShares: formatShares(1),
              purchasePrice: formatEtherTokens(0.2),
              realizedNet: formatEtherTokens(0),
              unrealizedNet: formatEtherTokens(0),
              totalNet: formatEtherTokens(0),
            },
            outcomes: [{}],
          },
        ])

        const expected = {
          numPositions: formatNumber(0, {
            decimals: 0,
            decimalsRounded: 0,
            denomination: 'Positions',
            positiveSign: false,
            zeroStyled: false,
          }),
          qtyShares: formatShares(0),
          purchasePrice: formatEtherTokens(0),
          realizedNet: formatEtherTokens(0),
          unrealizedNet: formatEtherTokens(0),
          totalNet: formatEtherTokens(0),
          positionOutcomes: [],
        }

        assert.deepEqual(actual, expected, `Didn't return the expect object`)
      },
    })

    test({
      description: `should return the expected object if there ARE markets with positions AND outcomes have position`,
      assertions: (store) => {
        const actual = generateMarketsPositionsSummary([
          {
            id: '0xMARKETID1',
            myPositionsSummary: {
              numPositions: formatNumber(1, {
                decimals: 0,
                decimalsRounded: 0,
                denomination: 'Positions',
                positiveSign: false,
                zeroStyled: false,
              }),
              qtyShares: formatShares(1),
              purchasePrice: formatEtherTokens(0.2),
              realizedNet: formatEtherTokens(0),
              unrealizedNet: formatEtherTokens(0),
              totalNet: formatEtherTokens(0),
            },
            outcomes: [
              {
                position: {
                  numPositions: formatNumber(1, {
                    decimals: 0,
                    decimalsRounded: 0,
                    denomination: 'Positions',
                    positiveSign: false,
                    zeroStyled: false,
                  }),
                  qtyShares: formatShares(1),
                  purchasePrice: formatEtherTokens(0.2),
                  realizedNet: formatEtherTokens(10),
                  unrealizedNet: formatEtherTokens(-1),
                  totalNet: formatEtherTokens(9),
                  isClosable: true,
                },
              },
            ],
          },
        ])

        const expected = {
          numPositions: formatNumber(1, {
            decimals: 0,
            decimalsRounded: 0,
            denomination: 'Positions',
            positiveSign: false,
            zeroStyled: false,
          }),
          qtyShares: formatShares(1),
          purchasePrice: formatEtherTokens(0),
          realizedNet: formatEtherTokens(10),
          unrealizedNet: formatEtherTokens(-1),
          totalNet: formatEtherTokens(9),
          positionOutcomes: [
            {
              position: {
                numPositions: formatNumber(1, {
                  decimals: 0,
                  decimalsRounded: 0,
                  denomination: 'Positions',
                  positiveSign: false,
                  zeroStyled: false,
                }),
                qtyShares: formatShares(1),
                purchasePrice: formatEtherTokens(0.2),
                realizedNet: formatEtherTokens(10),
                unrealizedNet: formatEtherTokens(-1),
                totalNet: formatEtherTokens(9),
                isClosable: true,
              },
            },
          ],
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })

  describe('generatePositionsSummary', () => {
    const test = (t) => {
      it(t.description, () => {
        t.assertions()
      })
    }

    test({
      description: `should return the expected object`,
      assertions: () => {
        const actual = generatePositionsSummary(10, 2, 0.2, 10, -1)

        const expected = {
          numPositions: formatNumber(10, {
            decimals: 0,
            decimalsRounded: 0,
            denomination: 'Positions',
            positiveSign: false,
            zeroStyled: false,
          }),
          qtyShares: formatShares(2),
          purchasePrice: formatEtherTokens(0.2),
          realizedNet: formatEtherTokens(10),
          unrealizedNet: formatEtherTokens(-1),
          totalNet: formatEtherTokens(9),
        }

        assert.deepEqual(actual, expected, `Didn't return the expected value`)
      },
    })
  })
})
