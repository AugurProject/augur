import { describe, it } from 'mocha'
import { assert } from 'chai'

import { AUTH_NAV_ITEMS } from 'modules/auth/constants/auth-nav-items'
import { SIGNUP, LOGIN, IMPORT } from 'modules/app/constants/views'

describe('modules/auth/constants/auth-nav-items.js', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the expected object`,
    assertions: () => {
      const expected = {
        [SIGNUP]: {
          label: 'Sign Up'
        },
        [LOGIN]: {
          label: 'Login'
        },
        [IMPORT]: {
          label: 'Import'
        }
      }

      assert.deepEqual(AUTH_NAV_ITEMS, expected, `didn't return the expected object`)
    }
  })
})
