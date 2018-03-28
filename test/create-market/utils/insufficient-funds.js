import { describe, it } from 'mocha'
import { assert } from 'chai'
import insufficientFunds from 'modules/create-market/utils/insufficient-funds'

describe('src/modules/create-market/utils/insufficient-funds.js', () => {
  describe('when user has insufficient ETH', () => {
    it('should output \'ETH\'', () => {
      const validityBond = 0.01
      const gasCost = 0.001
      const creationFee = 0.024
      const designatedReportNoShowReputationBond = 0.035
      const availableEth = 0.03
      const availableRep = 10

      const expected = 'ETH'
      const result = insufficientFunds(validityBond, gasCost, creationFee, designatedReportNoShowReputationBond, availableEth, availableRep)

      assert.equal(result, expected)
    })
  })
  describe('when user has insufficient REP', () => {
    it('should output \'REP\'', () => {
      const validityBond = 0.01
      const gasCost = 0.001
      const creationFee = 0.024
      const designatedReportNoShowReputationBond = 0.035
      const availableEth = 10
      const availableRep = 0.03

      const expected = 'REP'
      const result = insufficientFunds(validityBond, gasCost, creationFee, designatedReportNoShowReputationBond, availableEth, availableRep)

      assert.equal(result, expected)
    })
  })
  describe('when user has insufficient ETH and REP', () => {
    it('should output \'ETH and REP\'', () => {
      const validityBond = 0.01
      const gasCost = 0.001
      const creationFee = 0.024
      const designatedReportNoShowReputationBond = 0.035
      const availableEth = 0.03
      const availableRep = 0.03

      const expected = 'ETH and REP'
      const result = insufficientFunds(validityBond, gasCost, creationFee, designatedReportNoShowReputationBond, availableEth, availableRep)

      assert.equal(result, expected)
    })
  })
  describe('when user has sufficient funds', () => {
    it('should output empty string', () => {
      const validityBond = 0.01
      const gasCost = 0.001
      const creationFee = 0.024
      const designatedReportNoShowReputationBond = 0.035
      const availableEth = 0.035
      const availableRep = 0.035

      const expected = ''
      const result = insufficientFunds(validityBond, gasCost, creationFee, designatedReportNoShowReputationBond, availableEth, availableRep)

      assert.equal(result, expected)
    })
  })
})
