/* eslint-disable func-names */

import sinon from 'sinon'

import derivePeriodTimeSeries from 'modules/market/helpers/derive-period-time-series'

import { PERIODS, RANGES } from 'modules/market/constants/permissible-periods'

describe('modules/market/helpers/derive-period-time-series.js', () => {
  describe('error returns', () => {
    const test = t => it(t.description, () => t.assertions())
    test({
      description: 'should return an empty array if no data is passed',
      assertions: () => {
        const expected = []

        const actual = derivePeriodTimeSeries({
          data: {},
        })

        assert.deepEqual(expected, actual, `didn't return the expected value`)
      },
    })

    test({
      description: 'should return an empty array if priceTimeSeries is empty',
      assertions: () => {
        const expected = []

        const actual = derivePeriodTimeSeries({
          data: {
            priceTimeSeries: [],
            selectedPeriod: {
              selectedPeriod: PERIODS[2].period,
            },
          },
        })

        assert.deepEqual(expected, actual, `didn't return the expected value`)
      },
    })

    test({
      description: 'should return an empty array if selectedPeriod is undefined',
      assertions: () => {
        const expected = []

        const actual = derivePeriodTimeSeries({
          data: {
            priceTimeSeries: ['1', '2'],
            selectedPeriod: {},
          },
        })

        assert.deepEqual(expected, actual, `didn't return the expected value`)
      },
    })

    test({
      description: 'should return an empty array if selectedPeriod is undefined',
      assertions: () => {
        const expected = []

        const actual = derivePeriodTimeSeries({
          data: {
            priceTimeSeries: ['1', '2'],
            selectedPeriod: {},
          },
        })

        assert.deepEqual(expected, actual, `didn't return the expected value`)
      },
    })
  })

  describe('processed data returns', function () {
    const test = t => it(t.description, done => t.assertions(done))

    const priceTimeSeries = [
      {
        timestamp: 0,
        price: 0.1,
        amount: 1,
      },
      {
        timestamp: 60001,
        price: 0.2,
        amount: 1,
      },
      {
        timestamp: 119999,
        price: 0.3,
        amount: 1,
      },
      {
        timestamp: 120000,
        price: 0.4,
        amount: 1,
      },
      {
        timestamp: 120001,
        price: 0.8,
        amount: 1,
      },
    ]

    beforeEach(() => {
      this.clock = sinon.useFakeTimers(600000) // 10 minutes
    })

    after(() => this.clock.restore())

    test({
      description: 'should return the expected array for unbounded range + selected period',
      assertions: (done) => {

        const expected = [
          {
            period: 0,
            high: 0.1,
            low: 0.1,
            close: 0.1,
            volume: 1,
          },
          {
            period: 60000,
            high: 0.3,
            low: 0.2,
            close: 0.3,
            volume: 2,
          },
          {
            period: 120000,
            high: 0.8,
            low: 0.4,
            close: 0.8,
            volume: 2,
          },
          {
            period: 180000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
          {
            period: 240000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
          {
            period: 300000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
          {
            period: 360000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
          {
            period: 420000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
          {
            period: 480000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
          {
            period: 540000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
        ]

        const actual = derivePeriodTimeSeries({
          data: {
            priceTimeSeries,
            selectedPeriod: {
              selectedPeriod: PERIODS[1].period,
              selectedRange: RANGES[6].range,
            },
          },
        })

        assert.deepEqual(actual, expected, `didn't return the expected value`)

        done()
      },
    })

    test({
      description: 'should return the expected array for bounded range + selected period',
      assertions: (done) => {

        const expected = [
          {
            period: 120000,
            high: 0.8,
            low: 0.8,
            close: 0.8,
            volume: 1,
          },
          {
            period: 180000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
          {
            period: 240000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
          {
            period: 300000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
          {
            period: 360000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
          {
            period: 420000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
          {
            period: 480000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
          {
            period: 540000,
            high: 0.8,
            low: 0.8,
            open: 0.8,
            close: 0.8,
            volume: 0,
          },
        ]

        const actual = derivePeriodTimeSeries({
          data: {
            priceTimeSeries,
            selectedPeriod: {
              selectedPeriod: PERIODS[1].period,
              selectedRange: RANGES[1].range,
            },
          },
        })

        assert.deepEqual(actual, expected, `didn't return the expected value`)

        done()
      },
    })
  })
})
