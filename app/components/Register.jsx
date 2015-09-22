var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Modal = ReactBootstrap.Modal;
var utilities = require('../libs/utilities');

var RegisterModal = React.createClass({

  mixins: [FluxMixin],

  getInitialState: function () {

    return {
      handle: '',
      password: '',
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

      augur.web.register(this.state.handle, this.state.password, [
        function (account) {
          if (account) {
            if (account.error) {
              console.error(account);
              flux.actions.market.updateSharesHeld(null);
              flux.actions.config.updateAccount({
                currentAccount: null,
                privateKey: null,
                handle: null
              });
              self.setState({ handleHelp: account.message });
              return;
            }
            console.log("registered account:", account.handle, account.address);
            flux.actions.config.updateAccount({
              currentAccount: account.address,
              privateKey: account.privateKey,
              handle: account.handle
            });
            self.props.onHide();
          } else {
            console.error(account);
          }
        },
        flux.actions.asset.updateAssets,
        flux.actions.asset.updateAssets
      ]);
    }
  },

  componentDidMount: function (event) {

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
    help[event.target.name+'Help'] = null;
    this.setState(form);
    this.setState(help);
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
                onChange={ this.handleChange }
              />
            </div>
            <div className="col-sm-12">
              <Input
                type="password"
                name="password"
                ref="input"
                bsStyle={ passwordStyle }
                help={ this.state.passwordHelp }
                placeholder='password'
                onChange={ this.handleChange }
              />
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
                buttonAfter={ submit }
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
});

module.exports = RegisterModal;
