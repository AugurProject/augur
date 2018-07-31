

import assertLink from 'assertions/common/link'

export default function (navItem, label = 'Nav Item') {
  describe(`${label}' Shape`, () => {
    assert.isDefined(navItem)
    assert.isObject(navItem)

    it('label', () => {
      assert.isDefined(navItem.label)
      assert.isString(navItem.label)
    })

    it('link', () => {
      assertLink(navItem.link, 'portfolio.navItem.link')
    })

    it('page', () => {
      assert.isDefined(navItem.page)
      assert.isString(navItem.page)
    })
  })
}
