

import sinon from 'sinon'

import generateDownloadAccountLink, { __RewireAPI__ as linkRewireAPI } from 'modules/auth/helpers/generate-download-account-link'

describe('modules/auth/helpers/generate-download-account-link.js', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the expected values + call the expected methods`,
    assertions: () => {
      const Speedomatic = {
        byteArrayToHexString: () => {},
      }
      sinon.stub(Speedomatic, 'byteArrayToHexString').callsFake(privateKey => privateKey)
      linkRewireAPI.__Rewire__('speedomatic', Speedomatic)

      const augur = {
        accounts: {
          account: {
            privateKey: '123privatekey',
          },
        },
      }
      linkRewireAPI.__Rewire__('augur', augur)

      const keythereum = {
        generateKeystoreFilename: () => {},
      }
      sinon.stub(keythereum, 'generateKeystoreFilename').callsFake(address => address)
      linkRewireAPI.__Rewire__('keythereum', keythereum)

      const actual = generateDownloadAccountLink('0xtest', { keystore: 'object' }, '123privatekey')

      const expected = {
        accountPrivateKey: '123privatekey',
        downloadAccountDataString: 'data:,%7B%22keystore%22%3A%22object%22%7D',
        downloadAccountFileName: '0xtest',
      }

      assert.deepEqual(actual, expected, `didn't return the expected object`)
      assert(Speedomatic.byteArrayToHexString.calledOnce, `didn't call 'speedomatic.byteArrayToHexString' once as exptected`)
      assert(keythereum.generateKeystoreFilename.calledOnce, `didn't call 'keythereum.generateKeystoreFilename' once as expected`)
    },
  })
})
