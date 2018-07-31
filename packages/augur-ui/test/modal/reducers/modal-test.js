

import reducer from 'modules/modal/reducers/modal'

import { UPDATE_MODAL } from 'modules/modal/actions/update-modal'
import { CLOSE_MODAL } from 'modules/modal/actions/close-modal'

describe('modules/modal/reducers/modal', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: 'should return the DEFAULT_STATE',
    assertions: () => {
      const actual = reducer(undefined, { type: null })

      const expected = {}

      assert.deepEqual(actual, expected, `didn't return the expected object`)
    },
  })

  test({
    description: 'should return the passed value',
    assertions: () => {
      const actual = reducer({ test: 'TEST' }, { type: null })

      const expected = {
        test: 'TEST',
      }

      assert.deepEqual(actual, expected, `didn't return the expected object`)
    },
  })

  test({
    description: 'should return the updated state when case is UPDATE_MODAL',
    assertions: () => {
      const actual = reducer({ test: 'TEST' }, { type: UPDATE_MODAL, data: { test: 'NEW' } })

      const expected = {
        test: 'NEW',
      }

      assert.deepEqual(actual, expected, `didn't return the expected object`)
    },
  })

  test({
    description: 'should return the updated DEFAULT_STATE when case is CLOSE_MODAL',
    assertions: () => {
      const actual = reducer({ test: 'TEST' }, { type: CLOSE_MODAL })

      const expected = {}

      assert.deepEqual(actual, expected, `didn't return the expected object`)
    },
  })
})
