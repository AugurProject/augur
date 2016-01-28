var React = require("react");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let Button = require('react-bootstrap/lib/Button');
let Input = require('react-bootstrap/lib/Input');
let Modal = require('react-bootstrap/lib/Modal');
var utilities = require("../libs/utilities");

var RegisterModal = React.createClass({

  mixins: [FluxMixin],

  getInitialState: function () {
    return {
      handle: '',
      password: '',
      persist: false,
      verifyPassword: '',
      handleHelp: null,
      passwordHelp: null,
      verifyPasswordHelp: null
    };
  },

  onRegister: function (event) {
    if (this.isValid()) {
      var flux = this.getFlux();
      var self = this;
      flux.augur.web.register(this.state.handle, this.state.password, {
        persist: this.state.persist
      }, {
        onRegistered: function (account) {
          if (!account) return console.error("registration error");
          if (account.error) {
            console.error("registration error:", account);
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
          flux.actions.config.updateAccount({
            currentAccount: account.address,
            privateKey: account.privateKey,
            handle: account.handle,
            keystore: account.keystore
          });
          flux.actions.asset.updateAssets();
          self.props.onHide();
        },
        onSendEther: function (account) {
          flux.augur.filters.ignore(true, function (err) {
            if (err) return console.error(err);
            console.log("reset filters");
            flux.actions.config.initializeData();
            flux.actions.asset.updateAssets();
          });
        },
        onFunded: function (response) {
          console.log("register sequence complete");
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
    var form = {};
    var help = {};
    form[event.target.name] = event.target.value;
    help[event.target.name + 'Help'] = null;
    this.setState(form);
    this.setState(help);
  },

  handlePersistChange: function (event) {
    this.setState({persist: event.target.checked});
  },

  render: function () {
    var handleStyle = this.state.handleHelp ? 'error' : null;
    var passwordStyle = this.state.passwordHelp ? 'error' : null;
    var verifyPasswordStyle = this.state.verifyPasswordHelp ? 'error' : null;
    var submit = (
      <Button bsStyle='primary' onClick={ this.onRegister }>Register</Button>
    );

    return (
      <Modal {...this.props} className='send-modal' bsSize='small'>
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
                label="Remember Me"
                type="checkbox"
                name="persist"
                id="persist-checkbox"
                onChange={ this.handlePersistChange } />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
});

module.exports = RegisterModal;
