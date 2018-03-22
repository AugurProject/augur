

export default function (loginAccountPositions) {
  describe(`loginAccountPositions' shape`, () => {
    assert.isDefined(loginAccountPositions)
    assert.isObject(loginAccountPositions)

    it('markets', () => {
      assert.isDefined(loginAccountPositions.markets)
      assert.isArray(loginAccountPositions.markets)
    })

    it('summary', () => {
      assert.isDefined(loginAccountPositions.summary)
      assert.isObject(loginAccountPositions.summary)
    })
  })
}
