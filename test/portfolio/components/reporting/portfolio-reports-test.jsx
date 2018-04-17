import React from 'react'

import { describe, it } from 'mocha'
import sinon from 'sinon'

import { shallow } from 'enzyme'

import PortfolioReports from 'src/modules/portfolio/components/portfolio-reports/portfolio-reports'

describe('portfolio-reports', () => {
  let Cmp
  let getReportingFees

  before(() => {
    getReportingFees = sinon.spy()

    const universe = {
      id: '0xcd8569bb29493f01cffc394e050d2533aa5ea824',
      reputationTokenAddress: '0x69c95d801ba3890c7090bdedeb7e5cc8f2058586',
      disputeRoundDurationInSeconds: '6309888',
      currentReportingPeriodPercentComplete: null,
      reportingCycleTimeRemaining: 'Invalid date',
      isForking: false,
      forkingMarket: '0x0000000000000000000000000000000000000000',
    }
    Cmp = shallow(<PortfolioReports
      universe={universe}
      reporter="0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb"
      getReportingFees={getReportingFees}
    />)
  })

  describe('When loaded', () => {
    describe('claimReportingFees function', () => {
      it('should get called once with args ', () => {
        assert.isOk(getReportingFees)
      })

      it('should receive three arguments', () => {
        assert.deepEqual(getReportingFees.args[0].length, 3)
      })

      it('should receive first argument that matches expected value', () => {
        const expected = '0xcd8569bb29493f01cffc394e050d2533aa5ea824'
        assert.deepEqual(getReportingFees.args[0][0], expected)
      })

      it('should receive second argument that matches expected value', () => {
        const expected = '0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb'
        assert.deepEqual(getReportingFees.args[0][1], expected)
      })
    })

    describe('ETH total', () => {
      it('should display as \'-\'', () => {
        assert.include(Cmp.html(), '<span>ETH</span><span>-</span>')
      })
    })

    describe('REP total', () => {
      it('should display as \'-\'', () => {
        assert.include(Cmp.html(), '<span>REP</span><span>-</span>')
      })
    })

    describe('claim-reporting-fees-button', () => {
      it('should be disabled', () => {
        const button = Cmp.find('button')
        assert.isOk(button.html().includes('disabled'))
      })
    })
  })
})
