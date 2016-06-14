import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from './testState';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let state = Object.assign({}, testState);
let store = mockStore(state);

export default {store, state};
