

export default function (reportableOutcomes) {
  describe(`reportableOutcomes' shape`, () => {
    assert.isDefined(reportableOutcomes, `'reportableOutcomes' is not defined`)
    assert.isArray(reportableOutcomes, `'reportableOutcomes' is not an array`)

    reportableOutcomes.forEach((outcome) => {
      it('id', () => {
        assert.isDefined(outcome.id, `reportableOutcomes' id is not defined`)
        assert.isString(outcome.id, `reportableOutcomes' id is not a string`)
      })

      it('name', () => {
        assert.isDefined(outcome.name, `reportableOutcomes' name is not defined`)
        assert.isString(outcome.name, `reportableOutcomes' name is not a string`)
      })
    })
  })
}
