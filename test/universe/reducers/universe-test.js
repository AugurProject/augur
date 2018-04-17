

import testState from 'test/testState'
import { UPDATE_UNIVERSE } from 'modules/universe/actions/update-universe'
import reducer from 'modules/universe/reducers/universe'

describe(`modules/universe/reducers/universe.js`, () => {
  const thisTestState = Object.assign({}, testState)
  it(`should update the universe object in state`, () => {
    const action = {
      type: UPDATE_UNIVERSE,
      universe: {
        description: 'testing!',
        reportingPeriodDurationInSeconds: '12345',
      },
    }
    const expectedOutput = Object.assign({}, thisTestState.universe, action.universe)
    assert.deepEqual(reducer(thisTestState.universe, action), expectedOutput, `Didn't update the universe object correctly`)
  })
})
