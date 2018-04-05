

import assertFormattedNumber from 'assertions/common/formatted-number'
import assertFormattedDate from 'assertions/common/formatted-date'

export default function (reports) {
  describe(`loginAccountReports.reports' shape`, () => {
    assert.isDefined(reports)
    assert.isArray(reports)

    reports.forEach((report) => { assertAccountReport(report) })
  })
}

export function assertAccountReport(report) {
  describe(`report's shape`, () => {
    it('id', () => {
      assert.isDefined(report.id)
      assert.isString(report.id)
    })

    it('description', () => {
      assert.isDefined(report.description)
      assert.isString(report.description)
    })

    it('outcome', () => {
      assert.isDefined(report.outcome)

      report.outcome != null && assert.isString(report.outcome)
    })

    it('outcomePercentage', () => {
      assert.isDefined(report.outcomePercentage)

      assertFormattedNumber(report.outcomePercentage, 'report.fees')
    })

    it('reported', () => {
      assert.isDefined(report.reported)
      assert.isString(report.reported)
    })

    it('isReportEqual', () => {
      assert.isDefined(report.isReportEqual)
      assert.isBoolean(report.isReportEqual)
    })

    it('feesEarned', () => {
      assert.isDefined(report.feesEarned)

      assertFormattedNumber(report.feesEarned, 'report.feesEarned')
    })

    it('repEarned', () => {
      assert.isDefined(report.repEarned)

      assertFormattedNumber(report.repEarned, 'report.repEarned')
    })

    it('endTime', () => {
      assert.isDefined(report.endTime)

      assertFormattedDate(report.endTime, 'report.endTime')
    })

    it('isChallenged', () => {
      assert.isDefined(report.isChallenged)
      assert.isBoolean(report.isChallenged)
    })

    it('isChallangeable', () => {
      assert.isDefined(report.isChallengeable)
      assert.isBoolean(report.isChallengeable)
    })
  })
}
