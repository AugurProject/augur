import { describe, it } from 'mocha'
import { assert } from 'chai'
import * as action from 'modules/app/actions/update-connection'

describe('modules/app/actions/update-connection.js', () => {
  it(`should update the ethereum node connection status`, () => {
    const test = action.updateConnectionStatus(true)
    const out = {
      type: action.UPDATE_CONNECTION_STATUS,
      isConnected: true
    }
    assert.deepEqual(test, out, `Didn't produce the expected action object`)
  })

  it(`should update the augur node connection status`, () => {
    const test = action.updateAugurNodeConnectionStatus(true)
    const out = {
      type: action.UPDATE_AUGUR_NODE_CONNECTION_STATUS,
      isConnected: true
    }
    assert.deepEqual(test, out, `Didn't produce the expected action object`)
  })

  it(`should update the isReconnectionPaused variable`, () => {
    const test = action.updateIsReconnectionPaused(true)
    const out = {
      type: action.UPDATE_IS_RECONNECTION_PAUSED,
      isReconnectionPaused: true
    }
    assert.deepEqual(test, out, `Didn't produce the expected action object`)
  })
})
