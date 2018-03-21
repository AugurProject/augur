

export default function (keywords) {
  assert.isDefined(keywords, `keywords isn't defined`)
  assert.isObject(keywords, `keywords isn't an object`)
  assert.isDefined(keywords.value, `keywords.value isn't defined`)
  assert.isString(keywords.value, `keywords.value isn't a string`)
  assert.isDefined(keywords.onChangeKeywords, `keywords.onChangeKeywords isn't defined`)
  assert.isFunction(keywords.onChangeKeywords, `keywords.onChangeKeywords isn't a function`)
}
