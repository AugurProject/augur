import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import testState from 'test/testState'

describe(`modules/auth/actions/login.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const thisTestState = Object.assign({}, testState, { loginAccount: {} })
  const store = mockStore(thisTestState)
  const AugurJS = {
    augur: {
      accounts: { login: () => {} }
    }
  }
  const LoadAccountData = { loadAccountData: () => {} }
  const loginID = '2B4TRvPCMiwUu3tSG2z3eF7Wp6Dx5wnGkg34pZHE5WyKHs9wgydZc15qWM9zVh41jC3hrtXEG7xdgn3VT2UW3N6L9e2Way3ZwV9MgVxVPEnEmDjMuLKqYron9pcpaXgUBtweZcKJgQEX19fWRxJBiQEtMBpEu5M7SxsffJRnXDKEfEmawYLu3wh4Piq4vkUJyVKpQq5QnbbG9wBdwcwWQurVki38n5Dr8jPcBfv5sU53XqG943wChdDmJYcBPx4x3eGxu6BxReRBFM5tX1zquDKxidHZqFg5sjLbs5RMYD34mpKTZhhzcKmANz9UaQp3XAMPgrkht1d92qULRS7RKZDeEa7EBPTn3bcpadAL9p9jYgHhsKVZLyLRtKXqzDfvLd9ZyCZnAGQ9kDm1oYse5624CgcfXuPYmReghu28Kn4mufJVHWpQX9nXJfhXovnHTLiHSvT2bYZqqiTeqE9GENd4xCvT5Jeihyu47YfeW5oAkKekwkk23WmHiXN2knxKHwuJdSUveQDYFm2Um5MvLWV5FCFMV1wNKErnziMsS8bCbqqcBa7mA2iXLc52Xo2T8HnxQktaLsr8tHz3dy9qbcjTQwTsoegCCjAezfki8XUKhwKnFZtccW87iBf8afviXAd3yLH6jnyYXRXVnGCW2nKzYcdqPKe1uepv5Nj5Z1xMy8rWDohbGJJuiyKaRTBG1McGMiFeBCP5jZiKaQ1sY3avjgacipwb36rFkvgDX8LaNMvSRwAwbEUm1VPWmdKXiiz389bJs8ed3ahuLUPEWoLo3ZnCPuT5cZvZixhFYx3wM53yurDvCCpAFRjQHfYSzD5Q3b72L8h4kN4CVGp4MipZRM9gr36coqYfwj1CAQEH5FM3JkK83c2jsd6wVMSwicrgWGkafAehRPtzkoYchBj7s4RCoDBR3ne5exxWpFTjfyrwQZzVgTJRwx4JnSSbJxYQ6rfHYWuLTv6zKzeSXAMaDYfXXzi9pbaYo2Q4cS486zmGKkkGPJjAbqkxCg8NKaaSVW3xAaM8EWVQ9B9GLjsM7Y8obCLBNfZbUGiAk8msFbv2zEmnWr22MALMDGQizMAMeqbcPRCYSvQrDEHkXqmmK3Jk6zWe48iCZfCKNEKVYmwZaqyVfMKsMi5oY52xjyFvp72ff4GqV5thZVgNsdLSXKUBhTf6TPmG1dSNx'
  AugurJS.augur.accounts.login = sinon.stub().yields({ address: '0x812e463089332df61e96b8ce663a66e61aadecd3', loginID })
  LoadAccountData.loadAccountData = sinon.stub().returns({ type: 'LOAD_FULL_ACCOUNT_DATA' })

  const updateIsLoggedStub = {
    updateIsLogged: () => {}
  }
  sinon.stub(updateIsLoggedStub, 'updateIsLogged', () => ({ type: 'update-is-logged' }))

  const action = proxyquire('../../../src/modules/auth/actions/login', {
    '../../../services/augurjs': AugurJS,
    './update-is-logged': updateIsLoggedStub,
    './load-account-data': LoadAccountData
  })

  beforeEach(() => {
    store.clearActions()
  })

  it(`should attempt to login an account given user/pass`, () => {
    store.dispatch(action.login(loginID, 'password'))
    const expectedOutput = [
      { type: 'update-is-logged' },
      { type: 'LOAD_FULL_ACCOUNT_DATA' }
    ]
    assert.deepEqual(store.getActions(), expectedOutput, `didn't login to the account correcty`)
  })
})
