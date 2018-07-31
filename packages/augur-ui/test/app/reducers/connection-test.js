

import testState from 'test/testState'
import * as updateConnection from 'modules/app/actions/update-connection'
import reducer from 'modules/app/reducers/connection'

describe(`modules/app/reducers/connection.js`, () => {
  const thisTestState = Object.assign({}, testState)

  it(`should update the connection in state`, () => {
    const action = {
      type: updateConnection.UPDATE_CONNECTION_STATUS,
      isConnected: true,
    }
    const expectedOutput = Object.assign({}, thisTestState.connection, {
      isConnected: true,
    })
    assert.deepEqual(reducer(thisTestState.connection, action), expectedOutput, `Didn't update the connection information`)
  })

  it(`should update the Augur Node connection in state`, () => {
    const action = {
      type: updateConnection.UPDATE_AUGUR_NODE_CONNECTION_STATUS,
      isConnected: true,
    }
    const expectedOutput = Object.assign({}, thisTestState.connection, {
      isConnectedToAugurNode: true,
    })
    assert.deepEqual(reducer(thisTestState.connection, action), expectedOutput, `Didn't update the connection information`)
  })

  it(`should update the isReconnectionPaused variable in the connection object in state`, () => {
    const action = {
      type: updateConnection.UPDATE_IS_RECONNECTION_PAUSED,
      isReconnectionPaused: true,
    }
    const expectedOutput = Object.assign({}, thisTestState.connection, {
      isReconnectionPaused: true,
    })
    assert.deepEqual(reducer(thisTestState.connection, action), expectedOutput, `Didn't update the connection information`)
  })
})
