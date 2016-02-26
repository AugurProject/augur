let React = require("react");
let abi = require("augur-abi");
let keys = require("keythereum");
let uuid = require("node-uuid");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let Button = require('react-bootstrap/lib/Button');
let Input = require('react-bootstrap/lib/Input');
let Modal = require('react-bootstrap/lib/Modal');
let utilities = require("../libs/utilities");
let ProgressModal = require("./ProgressModal");
let ReactTabs = require('react-tabs');
let Tab = ReactTabs.Tab;
let Tabs = ReactTabs.Tabs;
let TabList = ReactTabs.TabList;
let TabPanel = ReactTabs.TabPanel;

let RegisterModal = React.createClass({

  mixins: [FluxMixin],

  getInitialState: function () {
    return {
      handle: '',
      password: '',
      persist: false,
      verifyPassword: '',
      handleHelp: null,
      passwordHelp: null,
      verifyPasswordHelp: null,
      progressModal: {
        open: false,
        status: "",
        header: "",
        detail: null,
        complete: null,
        steps: 5,
        step: 0
      },
      tab: 0,
      keystore: null
    };
  },

  toggleProgressModal: function (event) {
    var progressModal = this.state.progressModal;
    progressModal.open = !progressModal.open;
    this.setState({progressModal: progressModal});
  },

  updateProgressModal: utilities.updateProgressModal,

  onRegister: function (event) {
    if (this.isValid()) {
      let flux = this.getFlux();
      let self = this;
      this.props.onHide();
      this.updateProgressModal({
        header: "Creating New Account",
        status: "Creating new account <i>" + this.state.handle + "</i>...",
        detail: {handle: this.state.handle, persist: this.state.persist}
      });
      this.toggleProgressModal();
      flux.augur.web.register(this.state.handle, this.state.password, {
        persist: this.state.persist
      }, {
        onRegistered: function (account) {
          if (!account || account.error) {
            self.updateProgressModal({
              detail: {account},
              status: "Could not create new account.",
              complete: true
            });
            flux.actions.config.updateAccount({
              currentAccount: null,
              privateKey: null,
              handle: null,
              keystore: null
            });
            return self.setState({handleHelp: account.message});
          }
          self.updateProgressModal([{
              detail: {account},
              status: "Account created! Your new address is:<br /><i>" + account.address + "</i>"
            },
            "Waiting for free Ether..."
          ]);
          flux.actions.config.userRegistered();
          flux.actions.config.updateAccount({
            currentAccount: account.address,
            privateKey: account.privateKey,
            handle: account.handle,
            keystore: account.keystore
          });
          flux.actions.asset.updateAssets();
        },
        onSendEther: function (account) {
          self.updateProgressModal("Received " + flux.augur.constants.FREEBIE + " Ether.");
        },
        onSent: function (res) {
          self.updateProgressModal("Requesting free Cash and Reputation...");
        },
        onSuccess: function (res) {
          self.updateProgressModal({
            detail: {res},
            status: "Registration complete!",
            complete: true
          });
          flux.actions.asset.updateAssets();
        },
        onFailed: function (err) {
          console.error(err);
          self.updateProgressModal({
            detail: {err},
            status: "Registration failed.",
            complete: true
          });
        }
      });
    }
  },

  onImportAccount: function (event) {
    if (this.isValid()) {
      var handle = this.state.handle;
      var password = this.state.password;
      var options = {persist: this.state.persist};
      var keystore = this.state.keystore;
      var address = abi.prefix_hex(keystore.address);
      var flux = this.getFlux();
      var self = this;
      this.props.onHide();
      this.updateProgressModal({
        header: "Importing Account",
        status: "Decrypting private key for " + address + "...",
        detail: keystore
      });
      this.toggleProgressModal();
      keys.recover(password, keystore, function (privateKey) {
        if (!privateKey || privateKey.error) {
          self.updateProgressModal({
            status: "Private key decryption failed. Please double-check that you entered the same password you used locally!",
            detail: privateKey,
            complete: true
          });
          return console.error("onImportAccount keys.recover:", privateKey);
        }
        var keystoreCrypto = keystore.Crypto || keystore.crypto;
        var account = {
            ciphertext: abi.prefix_hex(keystoreCrypto.ciphertext),
            iv: abi.prefix_hex(keystoreCrypto.cipherparams.iv),
            mac: abi.prefix_hex(keystoreCrypto.mac),
            cipher: keystoreCrypto.cipher,
            kdf: keystoreCrypto.kdf,
            kdfparams: {
                c: keystoreCrypto.kdfparams.c,
                dklen: keystoreCrypto.kdfparams.dklen,
                prf: keystoreCrypto.kdfparams.prf,
                salt: abi.prefix_hex(keystoreCrypto.kdfparams.salt)
            },
            id: abi.prefix_hex(new Buffer(uuid.parse(keystore.id)).toString("hex"))
        };
        self.updateProgressModal([{
            status: "Private key decrypted!",
            detail: account
          },
          "Saving account to your browser (localStorage)..."
        ]);
        flux.augur.db.put(handle, account, function (result) {
          if (!result || result.error) {
            self.updateProgressModal({
              status: "Could not save account.",
              detail: result,
              complete: true
            });
            return console.error("onImportAccount augur.db.put:", result);
          }
          account.ciphertext = account.ciphertext.toString("hex");
          account.address = abi.strip_0x(address);
          account.iv = account.iv.toString("hex");
          account.kdfparams.salt = account.kdfparams.salt.toString("hex");
          account.mac = account.mac.toString("hex");
          account.id = uuid.unparse(new Buffer(abi.strip_0x(account.id), "hex"));
          flux.augur.web.account = {
              handle: handle,
              privateKey: privateKey,
              address: address,
              keystore: account
          };
          if (options.persist) {
              flux.augur.db.putPersistent(flux.augur.web.account);
          }
          self.updateProgressModal([{
              status: "Account saved.",
              detail: account
            }, {
              status: "Your account has been successfully imported. This dialogue can now be safely closed.",
              complete: true
            }
          ]);
          console.log("account import successful:", flux.augur.web.account);
          flux.actions.config.updateAccount({
            currentAccount: address,
            privateKey: privateKey,
            handle: handle,
            keystore: account
          });
          flux.actions.asset.updateAssets();
          flux.actions.report.loadEventsToReport();
          flux.actions.report.loadPendingReports();
        });
      });
    }
  },

  loadAccountFile: function (event) {
    var self = this;
    if (event.target && event.target.files && event.target.files.length) {
      var keystoreFile = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (function (f) {
        return function (e) {
          try {
            var keystore = JSON.parse(e.target.result);
            self.setState({keystore: keystore});
          } catch (exc) {
            console.error("loadAccountFile: couldn't parse account file:", exc);
          }
        };
      })(keystoreFile);
      reader.readAsText(keystoreFile);
    }
  },

  handleSelect: function (index, last) {
    this.setState({tab: index});
  },

  isValid: function () {
    if (this.state.handle === '') {
      this.setState({handleHelp: 'enter a valid handle'});
      return false;
    } else if (this.state.tab === 0 && this.state.password.length < 6) {
      this.setState({passwordHelp: 'must be at least 6 characters'});
      return false;
    } else if (this.state.password === '') {
      if (this.state.tab === 0) {
        this.setState({passwordHelp: 'enter a valid password'});
      } else if (this.state.tab === 1) {
        this.setState({passwordHelp: 'enter the same password used for this account on your local Ethereum node'});
      }
      return false;
    } else if (this.state.tab === 0 && (this.state.password !== this.state.verifyPassword)) {
      this.setState({verifyPasswordHelp: "passwords don't match"});
      return false;
    }
    return true;
  },

  handleChange: function (event) {
    let form = {};
    let help = {};
    form[event.target.name] = event.target.value;
    help[event.target.name + 'Help'] = null;
    this.setState(form);
    this.setState(help);
  },

  handlePersistChange: function (event) {
    this.setState({persist: event.target.checked});
  },

  render: function () {
    let handleStyle = this.state.handleHelp ? 'error' : null;
    let passwordStyle = this.state.passwordHelp ? 'error' : null;
    let verifyPasswordStyle = this.state.verifyPasswordHelp ? 'error' : null;
    let submit = (
      <Button bsStyle='primary' onClick={this.onRegister}>Register</Button>
    );
    let importSubmit = (
      <Button bsStyle='primary' onClick={this.onImportAccount}>Import</Button>
    );
    let loadAccountFile;
    if (this.state.keystore === null) {
      loadAccountFile = (
        <div className="col-sm-12">
          <label
            htmlFor="importAccountId"
            className="send-button btn btn-default load-account-file-button">
            Load Account File
          </label>
          <input
            id="importAccountId"
            type="file"
            onChange={this.loadAccountFile} />
        </div>
      );
    } else {
      loadAccountFile = (
        <div className="col-sm-12">
          <label
            htmlFor="importAccountId"
            className="send-button btn btn-success load-account-file-button">
            ✓ {abi.format_address(this.state.keystore.address)}
          </label>
          <input
            id="importAccountId"
            type="file"
            onChange={this.loadAccountFile} />
        </div>
      );
    }

    return (
      <div>
        <Modal
          show={this.props.show}
          onHide={this.props.onHide}
          className="send-modal register-modal"
          bsSize="large">
          <div className='modal-body clearfix'>
            <h4>Register</h4>
            <Tabs onSelect={this.handleSelect} selectedIndex={this.state.tab}>
              <TabList>
                <Tab>New Account</Tab>
                <Tab>Import Account</Tab>
              </TabList>
              <TabPanel>
                <div className='row'>
                  <div className="col-sm-12">
                    <Input
                      type='text'
                      name='handle'
                      bsStyle={handleStyle}
                      help={this.state.handleHelp}
                      placeholder='email address / username'
                      onChange={this.handleChange} />
                  </div>
                  <div className="col-sm-12">
                    <Input
                      type="password"
                      name="password"
                      ref="input"
                      bsStyle={passwordStyle}
                      help={this.state.passwordHelp}
                      placeholder='password'
                      onChange={this.handleChange} />
                  </div>
                  <div className="col-sm-12">
                    <Input
                      type="password"
                      name="verifyPassword"
                      bsStyle={verifyPasswordStyle}
                      help={this.state.verifyPasswordHelp}
                      ref="input"
                      placeholder='verify password'
                      onChange={this.handleChange}
                      buttonAfter={submit} />
                  </div>
                  <div className="col-sm-12">
                    <Input
                      type="checkbox"
                      name="persist"
                      id="persist-checkbox"
                      label="Remember Me"
                      onChange={this.handlePersistChange} />
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className='row'>
                  {loadAccountFile}
                  <div className="col-sm-12">
                    <Input
                      type='text'
                      name="handle"
                      bsStyle={handleStyle}
                      help={this.state.handleHelp}
                      placeholder='email address / username'
                      onChange={this.handleChange} />
                  </div>
                  <div className="col-sm-12">
                    <Input
                      type="password"
                      name="password"
                      ref="input"
                      bsStyle={passwordStyle}
                      help="The password used for this account on your local Ethereum node"
                      placeholder='password'
                      onChange={this.handleChange}
                      buttonAfter={importSubmit} />
                  </div>
                  <div className="col-sm-12">
                    <Input
                      type="checkbox"
                      name="persist"
                      id="persist-checkbox"
                      label="Remember Me"
                      onChange={this.handlePersistChange} />
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </Modal>
        <ProgressModal
          backdrop="static"
          show={this.state.progressModal.open}
          numSteps={this.state.progressModal.steps}
          step={this.state.progressModal.step}
          header={this.state.progressModal.header}
          status={this.state.progressModal.status}
          detail={JSON.stringify(this.state.progressModal.detail, null, 2)}
          complete={this.state.progressModal.complete}
          onHide={this.toggleProgressModal} />
      </div>
    );
  }
});

module.exports = RegisterModal;
