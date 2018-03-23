

export default function (initialFairPrices, refObj) {
  describe(`${refObj}'s initiaiFairPrices`, () => {
    describe('type', () => {
      it('should exist', () => {
        assert.isDefined(initialFairPrices.type, 'initialFairPrices.type is not defined')
      })

      it('should be a string', () => {
        assert.isString(initialFairPrices.type, 'initialFairPrices.type is not a string')
      })
    })

    describe('values', () => {
      it('should exist', () => {
        assert.isDefined(initialFairPrices.values, 'initialFairPrices.values is not defined')
      })

      it('should be an array', () => {
        assert.isArray(initialFairPrices.values, 'initialFairPrices.values is not an array')
      })
    })

    describe('raw', () => {
      it('should exist', () => {
        assert.isDefined(initialFairPrices.raw, 'initialFairPrices.raw is not defined')
      })

      it('should be an array', () => {
        assert.isArray(initialFairPrices.raw, 'initialFairPrices.raw is not an array')
      })
    })
  })
}
