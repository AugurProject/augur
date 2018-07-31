

export default function (loginAccountReports) {
  describe(`loginAccountReports' shape`, () => {
    assert.isDefined(loginAccountReports)
    assert.isObject(loginAccountReports)

    it('reports', () => {
      assert.isDefined(loginAccountReports.reports)
      assert.isArray(loginAccountReports.reports)
    })

    it('summary', () => {
      assert.isDefined(loginAccountReports.summary)
      assert.isObject(loginAccountReports.summary)
    })
  })
}
