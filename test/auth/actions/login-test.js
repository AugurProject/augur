// import { login, __RewireAPI__ as ReWireModule } from 'modules/auth/actions/login'
// import { describe, it, beforeEach } from 'mocha'
//
// import sinon from 'sinon'
// import configureMockStore from 'redux-mock-store'
// import thunk from 'redux-thunk'
// import testState from 'test/testState'

describe(`modules/auth/actions/login.js`, () => {
  // const middlewares = [thunk];
  // const mockStore = configureMockStore(middlewares);
  // const thisTestState = Object.assign({}, testState, { loginAccount: {} });
  // const store = mockStore(thisTestState);
  // const augur = {
  //   accounts: {
  //     login: (value, callback) => { }
  //   }
  // };
  //
  // const loginId = '2B4TRvPCMiwUu3tSG2z3eF7Wp6Dx5wnGkg34pZHE5WyKHs9wgydZc15qWM9zVh41jC3hrtXEG7xdgn3VT2UW3N6L9e2Way3ZwV9MgVxVPEnEmDjMuLKqYron9pcpaXgUBtweZcKJgQEX19fWRxJBiQEtMBpEu5M7SxsffJRnXDKEfEmawYLu3wh4Piq4vkUJyVKpQq5QnbbG9wBdwcwWQurVki38n5Dr8jPcBfv5sU53XqG943wChdDmJYcBPx4x3eGxu6BxReRBFM5tX1zquDKxidHZqFg5sjLbs5RMYD34mpKTZhhzcKmANz9UaQp3XAMPgrkht1d92qULRS7RKZDeEa7EBPTn3bcpadAL9p9jYgHhsKVZLyLRtKXqzDfvLd9ZyCZnAGQ9kDm1oYse5624CgcfXuPYmReghu28Kn4mufJVHWpQX9nXJfhXovnHTLiHSvT2bYZqqiTeqE9GENd4xCvT5Jeihyu47YfeW5oAkKekwkk23WmHiXN2knxKHwuJdSUveQDYFm2Um5MvLWV5FCFMV1wNKErnziMsS8bCbqqcBa7mA2iXLc52Xo2T8HnxQktaLsr8tHz3dy9qbcjTQwTsoegCCjAezfki8XUKhwKnFZtccW87iBf8afviXAd3yLH6jnyYXRXVnGCW2nKzYcdqPKe1uepv5Nj5Z1xMy8rWDohbGJJuiyKaRTBG1McGMiFeBCP5jZiKaQ1sY3avjgacipwb36rFkvgDX8LaNMvSRwAwbEUm1VPWmdKXiiz389bJs8ed3ahuLUPEWoLo3ZnCPuT5cZvZixhFYx3wM53yurDvCCpAFRjQHfYSzD5Q3b72L8h4kN4CVGp4MipZRM9gr36coqYfwj1CAQEH5FM3JkK83c2jsd6wVMSwicrgWGkafAehRPtzkoYchBj7s4RCoDBR3ne5exxWpFTjfyrwQZzVgTJRwx4JnSSbJxYQ6rfHYWuLTv6zKzeSXAMaDYfXXzi9pbaYo2Q4cS486zmGKkkGPJjAbqkxCg8NKaaSVW3xAaM8EWVQ9B9GLjsM7Y8obCLBNfZbUGiAk8msFbv2zEmnWr22MALMDGQizMAMeqbcPRCYSvQrDEHkXqmmK3Jk6zWe48iCZfCKNEKVYmwZaqyVfMKsMi5oY52xjyFvp72ff4GqV5thZVgNsdLSXKUBhTf6TPmG1dSNx';
  // const loadAccountData = sinon.stub().returns({ type: 'LOAD_FULL_ACCOUNT_DATA' });
  // const updateIsLoggedStub = sinon.stub().returns({ type: 'update-is-logged' });
  //
  // beforeEach(() => {
  //   store.clearActions();
  // });
  //
  // afterEach(() => {
  //   ReWireModule.__ResetDependency__('augur', 'updateIsLoggedIn', 'loadAccountData', 'base58Decode');
  //   updateIsLoggedStub.reset();
  //   loadAccountData.reset();
  // });
  //
  // const test = (t) => {
  //   it(t.description, (done) => {
  //
  //     ReWireModule.__Rewire__('augur', augur);
  //     ReWireModule.__Rewire__('updateIsLoggedIn', updateIsLoggedStub);
  //     ReWireModule.__Rewire__('loadAccountData', loadAccountData);
  //     ReWireModule.__Rewire__('base58Decode', t.base58Decode);
  //
  //     augur.accounts.login = t.login;
  //     const store = mockStore(t.state || {});
  //
  //     store.dispatch(login(loginId, 'password', (err) => {
  //       t.assertions(err, store);
  //       done();
  //     }));
  //   });
  // };
  //
  //
  // test({
  //   description: `should attempt to login an account given user/pass, two actions fired`,
  //   base58Decode: (value) => {
  //     const result = { keystore: 'blah' };
  //     return result;
  //   },
  //   login: (value, callback) => {
  //     const account = { address: '0x812e463089332df61e96b8ce663a66e61aadecd3' };
  //     callback(null, account);
  //   },
  //   assertions: (err, store) => {
  //
  //     const expectedOutput = [
  //       { type: 'update-is-logged' },
  //       { type: 'LOAD_FULL_ACCOUNT_DATA' }
  //     ];
  //     assert.isNull(err, 'error should be null');
  //     assert(updateIsLoggedStub.calledOnce, 'should call updateIsLoggedStub once');
  //     assert(loadAccountData.calledOnce, 'should call loadAccountData once');
  //     assert.deepEqual(store.getActions(), expectedOutput, `didn't login to the account correcty`);
  //   }
  // });
  //
  //
  // test({
  //   description: `should attempt to login and get error, no actions fired`,
  //   base58Decode: (value) => {
  //     const result = null;
  //     return result;
  //   },
  //   login: (value, callback) => {
  //     callback();
  //   },
  //   assertions: (err, store) => {
  //
  //     const expectedOutput = [];
  //     const error = { code: 0, message: 'could not decode login ID' };
  //     assert.deepEqual(err, error, 'error should be populated');
  //     assert(updateIsLoggedStub.notCalled, 'should call updateIsLoggedStub once');
  //     assert(loadAccountData.notCalled, 'should call loadAccountData once');
  //     assert.deepEqual(store.getActions(), expectedOutput, `didn't login to the account correcty`);
  //   }
  // });
  //
  // test({
  //   description: `should attempt to login has error, no actions fired`,
  //   base58Decode: (value) => {
  //     const result = { keystore: 'blah' };
  //     return result;
  //   },
  //   login: (value, callback) => {
  //     const account = { address: '0x812e463089332df61e96b8ce663a66e61aadecd3' };
  //     callback('ERROR', account);
  //   },
  //   assertions: (err, store) => {
  //
  //     const expectedOutput = [];
  //     assert.deepEqual(err, 'ERROR', 'error exists');
  //     assert(updateIsLoggedStub.notCalled, 'should call updateIsLoggedStub once');
  //     assert(loadAccountData.notCalled, 'should call loadAccountData once');
  //     assert.deepEqual(store.getActions(), expectedOutput, `didn't login to the account correcty`);
  //   }
  // });
  //
  //
  // test({
  //   description: `should attempt to login account is empty no address, no actions fired`,
  //   base58Decode: (value) => {
  //     const result = { keystore: 'blah' };
  //     return result;
  //   },
  //   login: (value, callback) => {
  //     callback(null, {});
  //   },
  //   assertions: (err, store) => {
  //
  //     const expectedOutput = [];
  //     assert.deepEqual(err, {}, 'error should be null');
  //     assert(updateIsLoggedStub.notCalled, 'should call updateIsLoggedStub once');
  //     assert(loadAccountData.notCalled, 'should call loadAccountData once');
  //     assert.deepEqual(store.getActions(), expectedOutput, `didn't login to the account correcty`);
  //   }
  // });

})
