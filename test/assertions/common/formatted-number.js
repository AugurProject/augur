

export default function (actual, label = 'Formatted Number') {
  describe(label, () => {
    it('should be formatted number', () => {
      assert.isDefined(actual.value, `'value' isn't defined`)
      assert.isNumber(actual.value, `'value' isn't a number`)
      assert.isDefined(actual.formattedValue, `'formattedValue' isn't defined`)
      assert.isNumber(actual.formattedValue, `'formattedValue' isn't a number`)
      assert.isDefined(actual.formatted, `'formatted' isn't defined`)
      assert.isString(actual.formatted, `'formatted' isn't a string`)
      assert.isDefined(actual.roundedValue, `'roundedValue' isn't defined`)
      assert.isNumber(actual.roundedValue, `'roundedValue' isn't a number`)
      assert.isDefined(actual.rounded, `'rounded' isn't defined`)
      assert.isString(actual.rounded, `'rounded' isn't a string`)
      assert.isDefined(actual.minimized, `'minimized' isn't defined`)
      assert.isString(actual.minimized, `'minimized' isn't a string`)
      assert.isDefined(actual.denomination, `'denomination' isn't defined`)
      assert.isString(actual.denomination, `'denomination' isn't a String`)
      assert.isDefined(actual.full, `'full' isn't defined`)
      assert.isString(actual.full, `'full' isn't a string`)
    })
  })
}
