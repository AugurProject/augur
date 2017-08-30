import { describe, it } from 'mocha'
import { assert } from 'chai'
import testState from 'test/testState'
import { UPDATE_BRANCH } from 'modules/branch/actions/update-branch'
import reducer from 'modules/branch/reducers/branch'

describe(`modules/branch/reducers/branch.js`, () => {
  const thisTestState = Object.assign({}, testState)
  it(`should update the branch object in state`, () => {
    const action = {
      type: UPDATE_BRANCH,
      branch: {
        description: 'testing!',
        reportingPeriodDurationInSeconds: '12345'
      }
    }
    const expectedOutput = Object.assign({}, thisTestState.branch, action.branch)
    assert.deepEqual(reducer(thisTestState.branch, action), expectedOutput, `Didn't update the branch object correctly`)
  })
})
