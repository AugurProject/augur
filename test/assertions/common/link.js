

export default function (link, label = 'Link') {
  describe(`${label} Shape`, () => {
    assert.isDefined(link)
    assert.isObject(link)

    it('href', () => {
      assert.isDefined(link.href)
      assert.isString(link.href)
    })

    it('onClick', () => {
      assert.isDefined(link.onClick)
      assert.isFunction(link.onClick)
    })
  })
}
