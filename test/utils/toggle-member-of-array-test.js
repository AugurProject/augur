import toggleMemberOfArray from 'src/utils/toggle-member-of-array'

describe('toggle-member-of-array', () => {
  const needle = 'some-needle'
  const noiseValue = 'noise-value'
  let result
  let stack

  describe('needle is a member of an array', () => {
    beforeEach(() => {
      stack = [
        noiseValue,
        needle,
      ]
      result = toggleMemberOfArray(stack, needle)
    })

    it('should remove just the needle', () => {
      assert.deepEqual(result, [
        noiseValue,
      ])
    })

    it('should return a new array (not strictly equal)', () => {
      assert.notStrictEqual(result, stack)
    })
  })

  describe('needle is not a member of an array', () => {
    beforeEach(() => {
      stack = [noiseValue]
      result = toggleMemberOfArray(stack, needle)
    })

    it('should add the needle to the array', () => {
      assert.deepEqual(result, [noiseValue, needle])
    })

    it('should return a new array (not strictly equal)', () => {
      assert.notStrictEqual(result, stack)
    })
  })
})
