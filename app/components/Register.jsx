let React = require("react");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let Button = require('react-bootstrap/lib/Button');
let Input = require('react-bootstrap/lib/Input');
let Modal = require('react-bootstrap/lib/Modal');
let utilities = require("../libs/utilities");
let ProgressModal = require("./ProgressModal");

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
      progressModalOpen: false,
      registerStatus: "",
      registerHeader: "",
      registerDetail: null,
      registerComplete: null
    };
  },

  toggleProgressModal: function (event) {
    this.setState({progressModalOpen: !this.state.progressModalOpen});
  },

  onRegister: function (event) {
    if (this.isValid()) {
      let flux = this.getFlux();
      let self = this;
      this.props.onHide();
      this.setState({
        registerHeader: "Creating New Account",
        registerStatus: "Creating new account " + this.state.handle + "...",
        registerDetail: {handle: this.state.handle, persist: this.state.persist}
      });
      this.toggleProgressModal();
      flux.augur.web.register(this.state.handle, this.state.password, {
        persist: this.state.persist
      }, {
        onRegistered: function (account) {
          if (!account) return console.error("registration error");
          if (account.error) {
            console.error("registration error:", account);
            self.setState({
              registerHeader: "Creating New Account",
              registerDetail: {account},
              registerComplete: true
            });
            self.setState({registerStatus: self.state.registerStatus + "<br />Could not create new account."});
            flux.actions.config.updateAccount({
              currentAccount: null,
              privateKey: null,
              handle: null,
              keystore: null
            });
            self.setState({handleHelp: account.message});
            return;
          }
          console.log("account created:", account);
          self.setState({
            registerHeader: "Creating New Account",
            registerDetail: {account},
            registerComplete: false
          });
          self.setState({registerStatus: self.state.registerStatus + "<br />Account created! Your new address is:<br /><i>" + account.address + "</i><br />Waiting for free Ether..."});
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
          console.log("Register.jsx: onSendEther %o", arguments);
          self.setState({
            registerHeader: "Creating New Account",
            registerDetail: {account},
            registerComplete: false
          });
          self.setState({registerStatus: self.state.registerStatus + "<br />Received " + flux.augur.constants.FREEBIE + " Ether.<br />Resetting blockchain listeners...<br />Exchanging " + (flux.augur.constants.FREEBIE / 2) + " Ether for CASH..."});
          flux.augur.filters.ignore(true, function (err) {
            if (err) return console.error(err);
            console.log("reset filters");
            self.setState({
              registerHeader: "Creating New Account",
              registerDetail: {
                block: flux.augur.filters.block_filter.id,
                contracts: flux.augur.filters.contracts_filter.id,
                creation: flux.augur.filters.creation_filter.id,
                price: flux.augur.filters.price_filter.id
              },
              registerComplete: false
            });
            self.setState({registerStatus: self.state.registerStatus + "<br />Blockchain listeners reset."})
            flux.actions.config.initializeData();
            flux.actions.asset.updateAssets();
          });
        },
        onFunded: function (response) {
          console.log("register sequence complete %o", response);
          self.setState({
              registerHeader: "Creating New Account",
              registerDetail: {response},
              registerComplete: true
            });
            self.setState({registerStatus: self.state.registerStatus + "<br />Received initial CASH and Reputation.<br />Registration complete! You can safely close this dialogue."})
          flux.actions.asset.updateAssets();
        }
      });
    }
  },

  isValid: function () {
    if (this.state.handle === '') {
      this.setState({handleHelp: 'enter a valid handle'});
      return false;
    } else if (this.state.password.length < 6) {
      this.setState({passwordHelp: 'must be at least 6 characters'});
      return false;
    } else if (this.state.password === '') {
      this.setState({passwordHelp: 'enter a valid password'});
      return false;
    } else if (this.state.password !== this.state.verifyPassword) {
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
      <Button bsStyle='primary' onClick={ this.onRegister }>Register</Button>
    );

    return (
      <div>
        <Modal show={this.props.show} onHide={this.props.onHide} className='send-modal' bsSize='small'>
          <div className='modal-body clearfix'>
            <h4>Register</h4>
            <div className='row'>
              <div className="col-sm-12">
                <Input
                  type='text'
                  name='handle'
                  bsStyle={ handleStyle }
                  help={ this.state.handleHelp }
                  placeholder='email address / username'
                  onChange={ this.handleChange } />
              </div>
              <div className="col-sm-12">
                <Input
                  type="password"
                  name="password"
                  ref="input"
                  bsStyle={ passwordStyle }
                  help={ this.state.passwordHelp }
                  placeholder='password'
                  onChange={ this.handleChange } />
              </div>
              <div className="col-sm-12">
                <Input
                  type="password"
                  name="verifyPassword"
                  bsStyle={ verifyPasswordStyle }
                  help={ this.state.verifyPasswordHelp }
                  ref="input"
                  placeholder='verify password'
                  onChange={ this.handleChange }
                  buttonAfter={ submit } />
              </div>
              <div className="col-sm-12">
                <Input
                  type="checkbox"
                  name="persist"
                  id="persist-checkbox"
                  label="Remember Me"
                  onChange={ this.handlePersistChange } />
              </div>
            </div>
          </div>
        </Modal>
        <ProgressModal
          backdrop="static"
          show={this.state.progressModalOpen}
          header={this.state.registerHeader}
          status={this.state.registerStatus}
          detail={JSON.stringify(this.state.registerDetail, null, 2)}
          complete={this.state.registerComplete}
          onHide={this.toggleProgressModal} />
      </div>
    );
  }
});

module.exports = RegisterModal;
