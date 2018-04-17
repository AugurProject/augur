

export default function (nav, label = 'Component Nav Item') {
  describe(`${label} Shape`, () => {
    assert.isDefined(nav)
    assert.isObject(nav)

    assert.isDefined(nav.label, `${label}.label isn't defined`)
    assert.isString(nav.label, `${label}.label isn't a string`)
  })
}
