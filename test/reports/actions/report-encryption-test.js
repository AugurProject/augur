import { describe, it } from 'mocha';
import { assert } from 'chai';
import Augur from 'augur.js';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe(`modules/reports/actions/report-encryption.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const augur = new Augur();
  describe('encryptReport', () => {
    const test = t => it(t.description, () => {
      const AugurJS = {
        augur: {
          accounts: {
            account: t.state.augur.accounts.account
          },
          encryptReport: () => {}
        }
      };
      const action = proxyquire('../../../src/modules/reports/actions/report-encryption.js', {
        '../../../services/augurjs': AugurJS
      });
      sinon.stub(AugurJS.augur, 'encryptReport', (plaintext, encryptionKey, salt) => `${plaintext}-${encryptionKey.toString('hex')}-${salt}`);
      t.assertions(action.encryptReport(t.params.report, t.params.salt));
    });
    test({
      description: 'no account',
      params: {
        report: augur.abi.fix('1', 'hex'),
        salt: '0x1337'
      },
      state: {
        augur: {
          accounts: {
            account: {}
          }
        }
      },
      assertions: (encrypted) => {
        assert.deepEqual(encrypted, {
          report: 0,
          salt: 0
        });
      }
    });
    test({
      description: 'account without derived key',
      params: {
        report: augur.abi.fix('1', 'hex'),
        salt: '0x1337'
      },
      state: {
        augur: {
          accounts: {
            account: {
              address: '0xb0b'
            }
          }
        }
      },
      assertions: (encrypted) => {
        assert.deepEqual(encrypted, {
          report: 0,
          salt: 0
        });
      }
    });
    test({
      description: 'account with derived key',
      params: {
        report: augur.abi.fix('1', 'hex'),
        salt: '0x1337'
      },
      state: {
        augur: {
          accounts: {
            account: {
              address: '0xb0b',
              derivedKey: new Buffer('123456', 'hex')
            }
          }
        }
      },
      assertions: (encrypted) => {
        assert.deepEqual(encrypted, {
          report: `${augur.abi.fix('1', 'hex')}-123456-0x1337`,
          salt: '0x1337-123456-undefined'
        });
      }
    });
  });
  describe('decryptReport', () => {
    const test = t => it(t.description, (done) => {
      const AugurJS = {
        augur: {
          accounts: {
            account: t.state.augur.accounts.account
          },
          getAndDecryptReport: () => {}
        }
      };
      const action = proxyquire('../../../src/modules/reports/actions/report-encryption.js', {
        '../../../services/augurjs': AugurJS
      });
      sinon.stub(AugurJS.augur, 'getAndDecryptReport', (branchID, period, address, eventID, secret, callback) => {
        callback(t.blockchain.encryptedReports[eventID]);
      });
      action.decryptReport(t.params.branchID, t.params.period, t.params.eventID, (err, decryptedReport) => {
        t.assertions(err, decryptedReport);
        done();
      });
    });
    test({
      description: 'no account',
      params: {
        branchID: '0xb1',
        period: 7,
        eventID: '0xe1'
      },
      state: {
        augur: {
          accounts: {
            account: {}
          }
        }
      },
      assertions: (err, decryptedReport) => {
        assert.isNull(err);
        assert.isUndefined(decryptedReport);
      }
    });
    test({
      description: 'account with address, without derivedKey',
      params: {
        branchID: '0xb1',
        period: 7,
        eventID: '0xe1'
      },
      state: {
        augur: {
          accounts: {
            account: {
              address: '0xb0b'
            }
          }
        }
      },
      assertions: (err, decryptedReport) => {
        assert.isNull(err);
        assert.isUndefined(decryptedReport);
      }
    });
    test({
      description: 'account with address and derivedKey, no on-chain stored report',
      params: {
        branchID: '0xb1',
        period: 7,
        eventID: '0xe1'
      },
      state: {
        augur: {
          accounts: {
            account: {
              address: '0xb0b',
              derivedKey: new Buffer('01', 'hex')
            }
          }
        }
      },
      blockchain: {
        encryptedReports: {
          '0xe1': {
            report: null,
            salt: null,
            ethics: null
          }
        }
      },
      assertions: (err, decryptedReport) => {
        assert.deepEqual(err, {
          report: null,
          salt: null,
          ethics: null
        });
        assert.isUndefined(decryptedReport);
      }
    });
    test({
      description: 'account with address and derivedKey, on-chain stored report',
      params: {
        branchID: '0xb1',
        period: 7,
        eventID: '0xe1'
      },
      state: {
        augur: {
          accounts: {
            account: {
              address: '0xb0b',
              derivedKey: new Buffer('000000000000000000000000000000000000000000000000000000000000000d', 'hex')
            }
          }
        }
      },
      blockchain: {
        encryptedReports: {
          '0xe1': {
            report: augur.abi.fix('1', 'hex'),
            salt: '0x1337',
            ethics: '0x1'
          }
        }
      },
      assertions: (err, decryptedReport) => {
        assert.isNull(err);
        assert.deepEqual(decryptedReport, {
          reportedOutcomeID: augur.abi.fix('1', 'hex'),
          salt: '0x1337',
          isUnethical: false
        });
      }
    });
  });
});
