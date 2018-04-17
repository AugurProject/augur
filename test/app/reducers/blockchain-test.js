

import testState from 'test/testState'
import {
  UPDATE_BLOCKCHAIN,
} from 'modules/app/actions/update-blockchain'
import reducer from 'modules/app/reducers/blockchain'

describe(`modules/app/reducers/blockchain.js`, () => {
  const thisTestState = Object.assign({}, testState)

  it(`should update the blockchain in state`, () => {
    const action = {
      type: UPDATE_BLOCKCHAIN,
      data: {
        currentBlockNumber: 833340,
      },
    }
    const expectedOutput = Object.assign({}, thisTestState.blockchain, action.data)
    assert.deepEqual(reducer(thisTestState.blockchain, action), expectedOutput, `Didn't update the blockchain information`)
  })
})
