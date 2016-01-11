var React = require("react");
var augur = require("augur.js");
var abi = require("augur-abi");
var Fluxxor = require("fluxxor");
var keys = require("keythereum");
var uuid = require("node-uuid");
var FluxMixin = Fluxxor.FluxMixin(React);
var ReactBootstrap = require("react-bootstrap");
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Modal = ReactBootstrap.Modal;
var utilities = require("../libs/utilities");

var ImportAccountModal = React.createClass({

  mixins: [FluxMixin],

  getInitialState: function () {
    return {
      handle: '',
      password: '',
      persist: false,
      handleHelp: null,
      passwordHelp: 'The password used for this account on your local Ethereum node'
    };
  },

  onImportAccount: function (event) {
    if (this.isValid()) {
      var handle = this.state.handle;
      var password = this.state.password;
      var options = {persist: this.state.persist};
      var keystore = this.props.params.keystore;
      var address = abi.prefix_hex(keystore.address);
      var flux = this.getFlux();
      var self = this;
      keys.recover(password, keystore, function (privateKey) {
        if (!privateKey || privateKey.error) {
          return console.error("onImportAccount keys.recover:", privateKey);
        }
        var account = {
            ciphertext: abi.prefix_hex(keystore.Crypto.ciphertext),
            iv: abi.prefix_hex(keystore.Crypto.cipherparams.iv),
            mac: abi.prefix_hex(keystore.Crypto.mac),
            cipher: keystore.Crypto.cipher,
            kdf: keystore.Crypto.kdf,
            kdfparams: {
                c: keystore.Crypto.kdfparams.c,
                dklen: keystore.Crypto.kdfparams.dklen,
                prf: keystore.Crypto.kdfparams.prf,
                salt: abi.prefix_hex(keystore.Crypto.kdfparams.salt)
            },
            id: abi.prefix_hex(new Buffer(uuid.parse(keystore.id)).toString("hex"))
        };
        augur.db.put(handle, account, function (result) {
          if (!result || result.error) {
            return console.error("onImportAccount augur.db.put:", result);
          }
          account.ciphertext = account.ciphertext.toString("hex");
          account.address = abi.strip_0x(address);
          account.iv = account.iv.toString("hex");
          account.kdfparams.salt = account.kdfparams.salt.toString("hex");
          account.mac = account.mac.toString("hex");
          account.id = uuid.unparse(new Buffer(abi.strip_0x(account.id), "hex"));
          augur.web.account = {
              handle: handle,
              privateKey: privateKey,
              address: address,
              keystore: account
          };
          if (options.persist) {
              augur.db.putPersistent(augur.web.account);
          }
          console.log("account import successful:", augur.web.account);
          flux.actions.config.updateAccount({
            currentAccount: address,
            privateKey: privateKey,
            handle: handle,
            keystore: account
          });
          flux.actions.asset.updateAssets();
          flux.actions.report.loadEventsToReport();
          flux.actions.report.loadPendingReports();
          self.props.onHide();
        });
      });
    }    
  },

  isValid: function () {
    if (this.state.handle === '') {
      this.setState({handleHelp: 'enter a valid handle'});
      return false;
    } else if (this.state.password === '') {
      this.setState({passwordHelp: 'enter the same password used for this account on your local Ethereum node'});
      return false;
    }
    return true;
  },

  handleChange: function (event) {
    var form = {};
    var help = {};
    form[event.target.name] = event.target.value;
    help[event.target.name+'Help'] = null;
    this.setState(form);
    this.setState(help);
  },

  handlePersistChange: function (event) {
    this.setState({persist: event.target.checked});
  },

  render: function () {
    var handleStyle = this.state.handleHelp ? 'error' : null;
    var passwordStyle = this.state.passwordHelp ? 'error' : null;
    var submit = (
      <Button bsStyle='primary' onClick={this.onImportAccount}>Import</Button>
    );
    return (
      <Modal {...this.props} className='send-modal' bsSize='small'>
        <div className='modal-body clearfix'>
          <h4>Import Account </h4>
          <div className='row'>
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
                help={this.state.passwordHelp}
                placeholder='password'
                onChange={this.handleChange}
                buttonAfter={submit} />
            </div>
            <div className="col-sm-12">
              Remember Me 
              <Input
                type="checkbox"
                name="persist"
                id="persist-checkbox"
                onChange={this.handlePersistChange} />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
});

module.exports = ImportAccountModal;
