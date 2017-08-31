import { describe, it } from 'mocha'
import { assert } from 'chai'
import sinon from 'sinon'

import generateDownloadAccountLink, { __RewireAPI__ as linkRewireAPI } from 'modules/auth/helpers/generate-download-account-link'

describe('modules/auth/helpers/generate-download-account-link.js', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the expected values + call the expected methods`,
    assertions: () => {
      const abi = {
        bytes_to_hex: () => {}
      }
      sinon.stub(abi, 'bytes_to_hex', privateKey => privateKey)

      const augur = {
        abi,
        accounts: {
          account: {
            privateKey: '123privatekey'
          }
        }
      }
      linkRewireAPI.__Rewire__('augur', augur)

      const keythereum = {
        generateKeystoreFilename: () => {}
      }
      sinon.stub(keythereum, 'generateKeystoreFilename', address => address)
      linkRewireAPI.__Rewire__('keythereum', keythereum)

      const actual = generateDownloadAccountLink('0xtest', { keystore: 'object' }, '123privatekey')

      const expected = {
        accountPrivateKey: '123privatekey',
        downloadAccountDataString: 'data:,%7B%22keystore%22%3A%22object%22%7D',
        downloadAccountFileName: '0xtest'
      }

      assert.deepEqual(actual, expected, `didn't return the expected object`)
      assert(abi.bytes_to_hex.calledOnce, `didn't call 'augur.abi.bytes_to_hex' once as exptected`)
      assert(keythereum.generateKeystoreFilename.calledOnce, `didn't call 'keythereum.generateKeystoreFilename' once as expected`)
    }
  })
})
