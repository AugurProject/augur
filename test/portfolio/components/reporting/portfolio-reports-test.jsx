import React from 'react'

import { describe, it } from 'mocha'
import sinon from 'sinon'

import { shallow } from 'enzyme'

import PortfolioReports from 'src/modules/portfolio/components/portfolio-reports/portfolio-reports'

describe('portfolio-reports', () => {
  let Cmp
  let loadClaimableFeesStub
  let updateModal

  beforeEach(() => {
    loadClaimableFeesStub = sinon.stub()
    updateModal = sinon.spy()
  })

  describe('When there are no claimable ETH or REP fees', () => {
    beforeEach(() => {
      loadClaimableFeesStub.returns({
        unclaimedEth: '0',
        unclaimedRepStaked: '0',
        unclaimedRepEarned: '0',
        claimedEth: '0.0156',
        claimedRepStaked: '0.111',
        claimedRepEarned: '0.123',
      })
      Cmp = shallow(<PortfolioReports loadClaimableFees={loadClaimableFeesStub} updateModal={updateModal} />)
    })

    describe('ETH total', () => {
      it('should display as \'-\'', () => {
        assert.isOk(Cmp.html().includes('<span>ETH</span><span>-</span>'))
      })
    })

    describe('REP total', () => {
      it('should display as \'-\'', () => {
        assert.isOk(Cmp.html().includes('<span>REP</span><span>-</span>'))
      })
    })

    describe('claim-reporting-fees-button', () => {
      it('should be disabled', () => {
        const button = Cmp.find('button')
        assert.isOk(button.html().includes('disabled'))
      })
    })
  })

  describe('When there claimable ETH fees, but no claimable REP fees', () => {
    beforeEach(() => {
      loadClaimableFeesStub.returns({
        unclaimedEth: '0.123',
        unclaimedRepStaked: '0',
        unclaimedRepEarned: '0',
        claimedEth: '0.0156',
        claimedRepStaked: '0.111',
        claimedRepEarned: '0.123',
      })
      Cmp = shallow(<PortfolioReports loadClaimableFees={loadClaimableFeesStub} updateModal={updateModal} />)
    })

    describe('ETH total', () => {
      it('should display as a value greater than 0', () => {
        assert.isOk(Cmp.html().includes('<span>ETH</span><span>0.1230</span>'))
      })
    })

    describe('REP total', () => {
      it('should display as \'-\'', () => {
        assert.isOk(Cmp.html().includes('<span>REP</span><span>-</span>'))
      })
    })

    describe('claim-reporting-fees button', () => {
      it('should not be disabled', () => {
        const button = Cmp.find('button')
        assert.isNotOk(button.html().includes('disabled'))
      })
    })
  })

  describe('When there claimable REP fees, but no claimable ETH fees', () => {
    beforeEach(() => {
      loadClaimableFeesStub.returns({
        unclaimedEth: '0',
        unclaimedRepStaked: '2000000000000000000',
        unclaimedRepEarned: '1000000000000000000',
        claimedEth: '0.0156',
        claimedRepStaked: '0.111',
        claimedRepEarned: '0.123',
      })
      Cmp = shallow(<PortfolioReports loadClaimableFees={loadClaimableFeesStub} updateModal={updateModal} />)
    })

    describe('ETH total', () => {
      it('should display as \'-\'', () => {
        assert.isOk(Cmp.html().includes('<span>ETH</span><span>-</span>'))
      })
    })

    describe('REP total', () => {
      it('should display value greater than 0', () => {
        console.log(Cmp.html())
        assert.isOk(Cmp.html().includes('<span>REP</span><span>2.0000</span>'))
      })
    })

    describe('claim-reporting-fees-button', () => {
      it('should not be disabled', () => {
        const button = Cmp.find('button')
        assert.isNotOk(button.html().includes('disabled'))
      })
    })
  })

  describe('When there claimable ETH fees and REP fees', () => {
    beforeEach(() => {
      loadClaimableFeesStub.returns({
        unclaimedEth: '0.123',
        unclaimedRepStaked: '2000000000000000000',
        unclaimedRepEarned: '1000000000000000000',
        claimedEth: '0.0156',
        claimedRepStaked: '0.111',
        claimedRepEarned: '0.123',
      })
      Cmp = shallow(<PortfolioReports loadClaimableFees={loadClaimableFeesStub} updateModal={updateModal} />)
    })

    describe('ETH total', () => {
      it('should display value greater than 0', () => {
        assert.isOk(Cmp.html().includes('<span>ETH</span><span>0.1230</span>'))
      })
    })

    describe('REP total', () => {
      it('should display value greater than 0', () => {
        console.log(Cmp.html())
        assert.isOk(Cmp.html().includes('<span>REP</span><span>2.0000</span>'))
      })
    })

    describe('claim-reporting-fees-button', () => {
      it('should not be disabled', () => {
        const button = Cmp.find('button')
        assert.isNotOk(button.html().includes('disabled'))
      })
    })
  })
})
