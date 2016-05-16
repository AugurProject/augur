import {
  assert
} from 'chai';
import * as action from '../../../src/modules/app/actions/update-connection';

describe('modules/app/actions/update-connection.js', () => {

  it(`should return a update connection action object`, () => {
    let test = action.updateConnectionStatus('test');
    let out = {
      type: 'UPDATE_CONNECTION_STATUS',
      isConnected: 'test'
    };
    assert.deepEqual(test, out, `Didn't produce the expected action object`);
  });
});
