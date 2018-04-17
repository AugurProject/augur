

import sinon from 'sinon'

import loginAccount, { selectLoginAccount, __RewireAPI__ as loginAccountRewireAPI } from 'modules/auth/selectors/login-account'

import { formatRep, formatEther } from 'utils/format-number'

describe(`modules/auth/selectors/login-account.js`, () => {
  const test = t => it(t.description, done => t.assertions(done))

  describe('default', () => {
    test({
      description: `should call 'selectLoginAccount'`,
      assertions: (done) => {
        const stubbedSelectLoginAccount = sinon.stub()

        loginAccountRewireAPI.__Rewire__('selectLoginAccount', stubbedSelectLoginAccount)

        loginAccount()

        loginAccountRewireAPI.__ResetDependency__('selectLoginAccount')

        assert(stubbedSelectLoginAccount.calledOnce, `didn't call 'selectLoginAccount' once as expected`)

        done()
      },
    })
  })

  describe('selectLoginAccount', function () { // eslint-disable-line func-names, prefer-arrow-callback
    const stubbedGenerateDownloadAccountLink = sinon.stub()

    before(() => {
      loginAccountRewireAPI.__Rewire__('generateDownloadAccountLink', stubbedGenerateDownloadAccountLink)
      loginAccountRewireAPI.__Rewire__('augur', {
        accounts: {
          account: {
            keystore: '',
          },
        },
      })
    })

    afterEach(() => {
      stubbedGenerateDownloadAccountLink.reset()
    })

    after(() => {
      loginAccountRewireAPI.__ResetDependency__('generateDownloadAccountLink')
      loginAccountRewireAPI.__ResetDependency__('augur')
    })

    test({
      description: `should return the expected object when user is unlogged`,
      assertions: (done) => {
        const loginAccount = {}
        const accountName = null

        const actual = selectLoginAccount.resultFunc(loginAccount, accountName)

        const expected = {
          accountName: null,
          rep: formatRep(undefined),
          eth: formatEther(undefined),
        }

        assert.deepEqual(actual, expected, `didn't return the expected object`)
        assert(stubbedGenerateDownloadAccountLink.calledOnce, `didn't call 'generateDownloadAccountLink' once as expected`)

        done()
      },
    })

    test({
      description: `should return the expected object when user is logged via loginId with account locked`,
      assertions: (done) => {
        const loginAccount = {
          address: '0xAccountAddress',
          loginId: '123ThisIsALoginId',
          eth: '10',
          rep: '12',
        }
        const accountName = 'testing'

        const actual = selectLoginAccount.resultFunc(loginAccount, accountName)

        const expected = {
          address: '0xAccountAddress',
          loginId: '123ThisIsALoginId',
          accountName: 'testing',
          rep: formatRep(12, { zeroStyled: false, decimalsRounded: 1 }),
          eth: formatEther(10, { zeroStyled: false, decimalsRounded: 2 }),
        }

        assert.deepEqual(actual, expected, `didn't return the expected object`)
        assert(stubbedGenerateDownloadAccountLink.calledOnce, `didn't call 'generateDownloadAccountLink' once as expected`)

        done()
      },
    })

    test({
      description: `should return the expected object when user is logged via loginId with account locked and name encoded`,
      assertions: (done) => {
        const loginAccount = {
          address: '0xAccountAddress',
          loginId: '123ThisIsALoginId',
          eth: '10',
          rep: '12',
        }
        const accountName = 'testing'

        const actual = selectLoginAccount.resultFunc(loginAccount, accountName)

        const expected = {
          address: '0xAccountAddress',
          loginId: '123ThisIsALoginId',
          accountName: 'testing',
          rep: formatRep(12, { zeroStyled: false, decimalsRounded: 1 }),
          eth: formatEther(10, { zeroStyled: false, decimalsRounded: 2 }),
        }

        assert.deepEqual(actual, expected, `didn't return the expected object`)
        assert(stubbedGenerateDownloadAccountLink.calledOnce, `didn't call 'generateDownloadAccountLink' once as expected`)

        done()
      },
    })

    test({
      description: `should return the expected object when user is logged via loginId with account UNlocked`,
      assertions: (done) => {
        const loginAccount = {
          address: '0xAccountAddress',
          loginId: '123ThisIsALoginId',
          eth: '10',
          rep: '12',
          isUnlocked: true,
        }
        const accountName = 'testing'

        const actual = selectLoginAccount.resultFunc(loginAccount, accountName)

        const expected = {
          address: '0xAccountAddress',
          loginId: '123ThisIsALoginId',
          accountName: 'testing',
          isUnlocked: true,
          rep: formatRep(12, { zeroStyled: false, decimalsRounded: 1 }),
          eth: formatEther(10, { zeroStyled: false, decimalsRounded: 2 }),
        }

        assert.deepEqual(actual, expected, `didn't return the expected object`)
        assert(stubbedGenerateDownloadAccountLink.calledOnce, `didn't call 'generateDownloadAccountLink' once as expected`)

        done()
      },
    })

    // test({
    //   description: `should return the expected object when user is logged via airbitz`,
    //   assertions: (done) => {
    //     const loginAccount = {
    //       airbitzAccount: {},
    //       address: '0xAccountAddress',
    //       loginId: '123ThisIsALoginId',
    //       eth: '10',
    //       rep: '12',
    //       isUnlocked: true,
    //     }
    //     const accountName = 'testing'

    //     const actual = selectLoginAccount.resultFunc(loginAccount, accountName)

    //     const expected = {
    //       airbitzAccount: {},
    //       address: '0xAccountAddress',
    //       loginId: '123ThisIsALoginId',
    //       accountName: 'testing',
    //       isUnlocked: true,
    //       rep: formatRep(12, { zeroStyled: false, decimalsRounded: 1 }),
    //       eth: formatEther(10, { zeroStyled: false, decimalsRounded: 2 }),
    //     }

    //     assert.deepEqual(actual, expected, `didn't return the expected object`)
    //     assert(stubbedGenerateDownloadAccountLink.calledOnce, `didn't call 'generateDownloadAccountLink' once as expected`)

    //     done()
    //   },
    // })
  })
})
