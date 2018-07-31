

export default function (formattedDate, label = 'Formatted Date') {
  describe(`${label}`, () => {
    it(`should be formatted date`, () => {
      assert.isDefined(formattedDate.value, `value is not defined`)
      assert.instanceOf(formattedDate.value, Date, `value is not a date`)
      assert.isDefined(formattedDate.formatted, `formatted is not defined`)
      assert.isString(formattedDate.formatted, `formatted is not a string`)
      assert.isDefined(formattedDate.full, `full is not defined`)
      assert.isString(formattedDate.full, `full is not a string`)
    })
  })
}
