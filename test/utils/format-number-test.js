

import * as formatNumber from 'utils/format-number'

describe('utils/format-number.js', () => {
  const	num = 1000.100
  const utils = [
    {
      func: 'formatEther',
      denom: 'ETH',
      out: {
        value: 1000.1,
        formattedValue: 1000.1,
        roundedValue: 1000.1,
        formatted: '1,000.1000',
        rounded: '1,000.1000',
        minimized: '1,000.1',
        denomination: ' ETH',
        full: '1,000.1000 ETH',
        fullPrecision: '1000.1',
      },
    },
    {
      func: 'formatEtherEstimate',
      denom: 'ETH (estimated)',
      out: {
        value: 1000.1,
        formattedValue: 1000.1,
        roundedValue: 1000.1,
        formatted: '1,000.1000',
        rounded: '1,000.1000',
        minimized: '1,000.1',
        denomination: ' ETH (estimated)',
        full: '1,000.1000 ETH (estimated)',
        fullPrecision: '1000.1',
      },
    },
    {
      func: 'formatPercent',
      denom: '%',
      out: {
        value: 1000.1,
        formattedValue: 1000.1,
        roundedValue: 1000,
        formatted: '1,000.10',
        rounded: '1,000',
        minimized: '1,000.1',
        denomination: '%',
        full: '1,000.10%',
        fullPrecision: '1000.1',
      },
    },
    {
      func: 'formatShares',
      denom: 'shares',
      out: {
        value: 1000.1,
        formattedValue: 1000.1,
        roundedValue: 1000.1,
        formatted: '1,000.1000',
        rounded: '1,000.1000',
        minimized: '1,000.1',
        denomination: ' shares',
        full: '1,000.1000 shares',
        fullPrecision: '1000.1',
      },
    },
    {
      func: 'formatShares',
      denom: 'shares',
      num: 1,
      out: {
        value: 1,
        formattedValue: 1,
        roundedValue: 1,
        formatted: '1.0000',
        rounded: '1.0000',
        minimized: '1',
        denomination: ' share',
        full: '1.0000 share',
        fullPrecision: '1',
      },
    },
    {
      func: 'formatRep',
      denom: 'REP',
      out: {
        value: 1000.1,
        formattedValue: 1000.1,
        roundedValue: 1000,
        formatted: '1,000.10',
        rounded: '1,000',
        minimized: '1,000.1',
        denomination: ' REP',
        full: '1,000.10 REP',
        fullPrecision: '1000.1',
      },
    },
  ]

  utils.forEach((currentUtil) => {
    describe(`${currentUtil.func}`, () => {
      it('should return a correctly formatted object', () => {
        assert.deepEqual(
          formatNumber[`${currentUtil.func}`](currentUtil.num || num),
          currentUtil.out,
          'returned formatted number is not correctly formatted',
        )
      })
    })
  })

  describe('formatNone', () => {
    it('should return a properly formatted `none` number object', () => {
      const out = {
        value: 0,
        formattedValue: 0,
        formatted: '-',
        roundedValue: 0,
        rounded: '-',
        minimized: '-',
        denomination: '',
        full: '-',
      }

      assert.deepEqual(formatNumber.formatNone(), out, 'returned `none` formatted number object was not correct formatted')
    })
  })

  describe('format gas cost', () => {
    it('should return a properly formatted gas cost number', () => {
      assert.deepEqual(formatNumber.formatGasCostToEther('0x632ea0', { decimalsRounded: 4 }, 20000000), '0.0001', 'returned gas cost formated in ether')
    })
  })

  describe('format gas cost different gas', () => {
    it('should return a properly formatted gas cost number', () => {
      assert.deepEqual(formatNumber.formatGasCostToEther('0x632ea0', { decimalsRounded: 8 }, 20000000), '0.00013000', 'returned gas cost formated in ether given gas price')
    })
  })

  describe('format attoREP', () => {
    it('should return a properly formatted attoREP number', () => {
      const result = formatNumber.formatAttoRep('349680582682291650', { decimals: 4 })
      assert.deepEqual(result.formatted, '0.3497', 'returned attoREP formated to 4 decimals')
    })
  })

  describe('format largish attoREP', () => {
    it('should return a properly formatted attoREP number', () => {
      const result = formatNumber.formatAttoRep('3496805826822916500000', { decimals: 4 })
      assert.deepEqual(result.formatted, '3,496.8058', 'returned larger formatted attoREP to 4 decimals')
    })
  })


})
