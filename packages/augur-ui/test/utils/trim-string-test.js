

import trimString from 'utils/trim-string'

describe('utils/trim-string', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return null when argument is undefined`,
    assertions: () => {
      const actual = trimString()

      const expected = null

      assert.strictEqual(actual, expected, `didn't return 'null' as expected`)
    },
  })

  test({
    description: `should return a trimmed string`,
    assertions: () => {
      const actual = trimString('string to be trimmed')

      const expected = 'stri...mmed'

      assert.strictEqual(actual, expected, `didn't return the expected trimmed string`)
    },
  })
})
