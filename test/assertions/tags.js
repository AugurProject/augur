

export default function (tags) {

  assert.isDefined(tags, `filters isn't defined`)
  assert.isArray(tags, `filters isn't an array`)

  tags.forEach((tag) => {
    assert.isDefined(tag, `[0].options[0] isn't defined`)
    assert.isObject(tag, `[0].options[0] isn't a object`)

    assert.isDefined(tag.name, `[0].options[0].name isn't defined`)
    assert.isString(tag.name, `[0].options[0].name isn't a string`)

    assert.isDefined(tag.value, `[0].options[0].value isn't defined`)
    assert.isString(tag.value, `[0].options[0].value isn't a string`)

    assert.isDefined(tag.numMatched, `[0].options[0].numMatched isn't defined`)
    assert.isNumber(tag.numMatched, `[0].options[0].numMatched isn't a number`)

    assert.isDefined(tag.isSelected, `[0].options[0].isSelected isn't defined`)
    assert.isBoolean(tag.isSelected, `[0].options[0].isSelected isn't a boolean`)

    assert.isDefined(tag.onClick, `[0].options[0].onClick isn't defined`)
    assert.isFunction(tag.onClick, `[0].options[0].onClick isn't a function`)
  })
}
