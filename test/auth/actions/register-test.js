import { describe, it, beforeEach, afterEach } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import testState from 'test/testState'
import { base58Encode } from '../../../src/utils/base-58'

describe(`modules/auth/actions/register.js`, () => {
  proxyquire.noPreserveCache()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const fakeAugurJS = {
    augur: {
      accounts: { account: { address: '0x812e463089332df61e96b8ce663a66e61aadecd3' } }
    }
  }
  const loadAccountDataStub = { loadAccountData: () => {} }
  const thisTestState = Object.assign({}, testState, { loginAccount: {} })
  const store = mockStore(thisTestState)
  const fakeCallback = sinon.stub()
  const loginID = '2B4TRvPCMiwUu3tSG2z3eF7Wp6Dx5wnGkg34pZHE5WyKHs9wgydZc15qWM9zVh41jC3hrtXEG7xdgn3VT2UW3N6L9e2Way3ZwV9MgVxVPEnEmDjMuLKqYron9pcpaXgUBtweZcKJgQEX19fWRxJBiQEtMBpEu5M7SxsffJRnXDKEfEmawYLu3wh4Piq4vkUJyVKpQq5QnbbG9wBdwcwWQurVki38n5Dr8jPcBfv5sU53XqG943wChdDmJYcBPx4x3eGxu6BxReRBFM5tX1zquDKxidHZqFg5sjLbs5RMYD34mpKTZhhzcKmANz9UaQp3XAMPgrkht1d92qULRS7RKZDeEa7EBPTn3bcpadAL9p9jYgHhsKVZLyLRtKXqzDfvLd9ZyCZnAGQ9kDm1oYse5624CgcfXuPYmReghu28Kn4mufJVHWpQX9nXJfhXovnHTLiHSvT2bYZqqiTeqE9GENd4xCvT5Jeihyu47YfeW5oAkKekwkk23WmHiXN2knxKHwuJdSUveQDYFm2Um5MvLWV5FCFMV1wNKErnziMsS8bCbqqcBa7mA2iXLc52Xo2T8HnxQktaLsr8tHz3dy9qbcjTQwTsoegCCjAezfki8XUKhwKnFZtccW87iBf8afviXAd3yLH6jnyYXRXVnGCW2nKzYcdqPKe1uepv5Nj5Z1xMy8rWDohbGJJuiyKaRTBG1McGMiFeBCP5jZiKaQ1sY3avjgacipwb36rFkvgDX8LaNMvSRwAwbEUm1VPWmdKXiiz389bJs8ed3ahuLUPEWoLo3ZnCPuT5cZvZixhFYx3wM53yurDvCCpAFRjQHfYSzD5Q3b72L8h4kN4CVGp4MipZRM9gr36coqYfwj1CAQEH5FM3JkK83c2jsd6wVMSwicrgWGkafAehRPtzkoYchBj7s4RCoDBR3ne5exxWpFTjfyrwQZzVgTJRwx4JnSSbJxYQ6rfHYWuLTv6zKzeSXAMaDYfXXzi9pbaYo2Q4cS486zmGKkkGPJjAbqkxCg8NKaaSVW3xAaM8EWVQ9B9GLjsM7Y8obCLBNfZbUGiAk8msFbv2zEmnWr22MALMDGQizMAMeqbcPRCYSvQrDEHkXqmmK3Jk6zWe48iCZfCKNEKVYmwZaqyVfMKsMi5oY52xjyFvp72ff4GqV5thZVgNsdLSXKUBhTf6TPmG1dSNx'
  fakeAugurJS.augur.accounts.register = (password, cb) => cb({ address: '0x812e463089332df61e96b8ce663a66e61aadecd3', loginID })
  const loadAccountDataTestString = 'loadAccountData() called.'
  sinon.stub(loadAccountDataStub, 'loadAccountData', account => ({ type: loadAccountDataTestString }))

  const updateIsLoggedStub = {
    updateIsLogged: () => {}
  }
  sinon.stub(updateIsLoggedStub, 'updateIsLogged', () => ({ type: 'update-is-logged' }))

  const action = proxyquire('../../../src/modules/auth/actions/register', {
    '../../../services/augurjs': fakeAugurJS,
    './update-is-logged': updateIsLoggedStub,
    './load-account-data': loadAccountDataStub
  })

  beforeEach(() => {
    store.clearActions()
  })

  afterEach(() => {
    store.clearActions()
  })

  it(`should register a new account`, () => {
    const expectedOutput = [
      { type: loadAccountDataTestString }
    ]
    store.dispatch(action.register('password', fakeCallback))
    store.dispatch(action.setupAndFundNewAccount('password', base58Encode(testState.loginAccount.loginID), fakeCallback))
    assert(fakeCallback.calledTwice, `the callback wasn't triggered 2 times as expected`)
    assert.deepEqual(store.getActions(), expectedOutput, `Didn't create a new account as expected`)
  })
})
