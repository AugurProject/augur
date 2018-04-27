import React from 'react'

import { describe, it } from 'mocha'
import sinon from 'sinon'

import { shallow } from 'enzyme'

import ModalClaimReportingFees from 'src/modules/modal/components/modal-claim-reporting-fees/modal-claim-reporting-fees'
import { formatAttoRep, formatEther } from 'utils/format-number'

describe('modal-claim-reporting-fees', () => {
  let Cmp

  describe('When displaying modal for claimable reporting fees', () => {
    describe('When there are no claimable ETH or REP fees', () => {
      let claimReportingFees
      beforeEach(() => {
        claimReportingFees = sinon.spy()
        Cmp = shallow(<ModalClaimReportingFees
          claimReportingFees={claimReportingFees}
          closeModal={sinon.spy()}
          recipient="0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB"
          unclaimedEth={formatEther('0', { decimals: 4, zeroStyled: true })}
          unclaimedRep={formatAttoRep('0', { decimals: 4, zeroStyled: true })}
          feeWindows={['0x161c723cac007e4283cee4ba11b15277e46eec53']}
          forkedMarket={{}}
          nonforkedMarkets={[]}
        />)
      })

      describe('Recipient field', () => {
        it('should match expected recipient address', () => {
          assert.include(Cmp.html(), '<span>Recipient</span><span>0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB</span>')
        })
      })

      describe('REP field', () => {
        it('should match expected claimable REP value', () => {
          assert.include(Cmp.html(), '<span>Rep</span><span>-</span>')
        })
      })

      describe('ETH field', () => {
        it('should match expected claimable ETH value', () => {
          assert.include(Cmp.html(), '<span>Eth</span><span>-</span>')
        })
      })

      describe('claimReportingFees function', () => {
        it('should get called once with args ', () => {
          assert.isOk(claimReportingFees)
        })

        it('should receive one argument', () => {
          assert.deepEqual(claimReportingFees.args[0].length, 1)
        })

        it('should receive first argument that matches expected value', () => {
          const expected = {
            feeWindows: ['0x161c723cac007e4283cee4ba11b15277e46eec53'],
            forkedMarket: {},
            nonforkedMarkets: [],
            estimateGas: true,
            onSent: claimReportingFees.args[0][0].onSent,
            onFailed: claimReportingFees.args[0][0].onFailed,
            onSuccess: claimReportingFees.args[0][0].onSuccess,
          }
          assert.deepEqual(claimReportingFees.args[0][0], expected)
        })
      })

      describe('Gas field', () => {
        it('should be zero', () => {
          assert.include(Cmp.html(), '<span>Gas</span><span>0</span>')
        })
      })

      describe('Submit button', () => {
        it('should be disabled', () => {
          const button = Cmp.find('button')
          assert.isOk(button.html().includes('disabled'))
        })
      })
    })

    describe('When there are claimable ETH fees, but no claimable REP fees', () => {
      let claimReportingFees
      beforeEach(() => {
        claimReportingFees = sinon.spy()
        Cmp = shallow(<ModalClaimReportingFees
          claimReportingFees={claimReportingFees}
          closeModal={sinon.spy()}
          recipient="0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB"
          unclaimedEth={formatEther('0.123', { decimals: 4, zeroStyled: true })}
          unclaimedRep={formatAttoRep('0', { decimals: 4, zeroStyled: true })}
          feeWindows={['0x161c723cac007e4283cee4ba11b15277e46eec53']}
          forkedMarket={{}}
          nonforkedMarkets={[]}
        />)
      })

      describe('Recipient field', () => {
        it('should match expected recipient address', () => {
          assert.include(Cmp.html(), '<span>Recipient</span><span>0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB</span>')
        })
      })

      describe('REP field', () => {
        it('should match expected claimable REP value', () => {
          assert.include(Cmp.html(), '<span>Rep</span><span>-</span>')
        })
      })

      describe('ETH field', () => {
        it('should match expected claimable ETH value', () => {
          assert.include(Cmp.html(), '<span>Eth</span><span>0.1230</span>')
        })
      })

      describe('claimReportingFees function', () => {
        it('should get called once with args ', () => {
          assert.isOk(claimReportingFees)
        })

        it('should receive one argument', () => {
          assert.deepEqual(claimReportingFees.args[0].length, 1)
        })

        it('should receive first argument that matches expected value', () => {
          const expected = {
            feeWindows: ['0x161c723cac007e4283cee4ba11b15277e46eec53'],
            forkedMarket: {},
            nonforkedMarkets: [],
            estimateGas: true,
            onSent: claimReportingFees.args[0][0].onSent,
            onFailed: claimReportingFees.args[0][0].onFailed,
            onSuccess: claimReportingFees.args[0][0].onSuccess,
          }
          assert.deepEqual(claimReportingFees.args[0][0], expected)
        })
      })

      describe('Gas field', () => {
        it('should match expected claimable Gas value', () => {
          assert.include(Cmp.html(), '<span>Gas</span><span>0</span>')
        })
      })

      describe('Submit button', () => {
        it('should not be disabled', () => {
          const button = Cmp.find('button')
          assert.isNotOk(button.html().includes('disabled'))
        })
      })
    })

    describe('When there are claimable REP fees, but no claimable ETH fees', () => {
      let claimReportingFees
      beforeEach(() => {
        claimReportingFees = sinon.spy()
        Cmp = shallow(<ModalClaimReportingFees
          claimReportingFees={claimReportingFees}
          closeModal={sinon.spy()}
          recipient="0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB"
          unclaimedEth={formatEther('0', { decimals: 4, zeroStyled: true })}
          unclaimedRep={formatAttoRep('2000000000000000000', { decimals: 4, zeroStyled: true })}
          feeWindows={['0x161c723cac007e4283cee4ba11b15277e46eec53']}
          forkedMarket={{}}
          nonforkedMarkets={[]}
        />)
      })

      describe('Recipient field', () => {
        it('should match expected recipient address', () => {
          assert.include(Cmp.html(), '<span>Recipient</span><span>0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB</span>')
        })
      })

      describe('REP field', () => {
        it('should match expected claimable REP value', () => {
          assert.include(Cmp.html(), '<span>Rep</span><span>2.0000</span>')
        })
      })

      describe('ETH field', () => {
        it('should match expected claimable ETH value', () => {
          assert.include(Cmp.html(), '<span>Eth</span><span>-</span>')
        })
      })

      describe('claimReportingFees function', () => {
        it('should get called once with args ', () => {
          assert.isOk(claimReportingFees)
        })

        it('should receive one argument', () => {
          assert.deepEqual(claimReportingFees.args[0].length, 1)
        })

        it('should receive first argument that matches expected value', () => {
          const expected = {
            feeWindows: ['0x161c723cac007e4283cee4ba11b15277e46eec53'],
            forkedMarket: {},
            nonforkedMarkets: [],
            estimateGas: true,
            onSent: claimReportingFees.args[0][0].onSent,
            onFailed: claimReportingFees.args[0][0].onFailed,
            onSuccess: claimReportingFees.args[0][0].onSuccess,
          }
          assert.deepEqual(claimReportingFees.args[0][0], expected)
        })
      })

      describe('Gas field', () => {
        it('should match expected claimable Gas value', () => {
          assert.include(Cmp.html(), '<span>Gas</span><span>0</span>')
        })
      })

      describe('Submit button', () => {
        it('should not be disabled', () => {
          const button = Cmp.find('button')
          assert.isNotOk(button.html().includes('disabled'))
        })
      })
    })

    describe('When there are claimable ETH fees and REP fees', () => {
      let claimReportingFees
      beforeEach(() => {
        claimReportingFees = sinon.spy()
        Cmp = shallow(<ModalClaimReportingFees
          claimReportingFees={claimReportingFees}
          closeModal={sinon.spy()}
          recipient="0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB"
          unclaimedEth={formatEther('0.123', { decimals: 4, zeroStyled: true })}
          unclaimedRep={formatAttoRep('2000000000000000000', { decimals: 4, zeroStyled: true })}
          feeWindows={['0x161c723cac007e4283cee4ba11b15277e46eec53']}
          forkedMarket={{}}
          nonforkedMarkets={[]}
        />)
      })

      describe('Recipient field', () => {
        it('should match expected recipient address', () => {
          assert.include(Cmp.html(), '<span>Recipient</span><span>0X913DA4198E6BE1D5F5E4A40D0667F70C0B5430EB</span>')
        })
      })

      describe('REP field', () => {
        it('should match expected claimable REP value', () => {
          assert.include(Cmp.html(), '<span>Rep</span><span>2.0000</span>')
        })
      })

      describe('ETH field', () => {
        it('should match expected claimable ETH value', () => {
          assert.include(Cmp.html(), '<span>Eth</span><span>0.1230</span>')
        })
      })

      describe('claimReportingFees function', () => {
        it('should get called once with args ', () => {
          assert.isOk(claimReportingFees)
        })

        it('should receive one argument', () => {
          assert.deepEqual(claimReportingFees.args[0].length, 1)
        })

        it('should receive first argument that matches expected value', () => {
          const expected = {
            feeWindows: ['0x161c723cac007e4283cee4ba11b15277e46eec53'],
            forkedMarket: {},
            nonforkedMarkets: [],
            estimateGas: true,
            onSent: claimReportingFees.args[0][0].onSent,
            onFailed: claimReportingFees.args[0][0].onFailed,
            onSuccess: claimReportingFees.args[0][0].onSuccess,
          }
          assert.deepEqual(claimReportingFees.args[0][0], expected)
        })
      })

      describe('Gas field', () => {
        it('should match expected claimable Gas value', () => {
          assert.include(Cmp.html(), '<span>Gas</span><span>0</span>')
        })
      })

      describe('Submit button', () => {
        it('should not be disabled', () => {
          const button = Cmp.find('button')
          assert.isNotOk(button.html().includes('disabled'))
        })
      })
    })
  })
})
