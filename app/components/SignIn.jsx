var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Modal = ReactBootstrap.Modal;
var utilities = require('../libs/utilities');

var SignInModal = React.createClass({

  mixins: [FluxMixin],

  getInitialState: function () {

    return {
      handle: '',
      password: '',
      handleHelp: null,
      passwordHelp: null
    };
  },

  getStateFromFlux: function() {

    return {};
  },

  onSignIn: function (event) {

    if (this.isValid()) {
      this.getFlux().actions.config.signIn(this.state.handle, this.state.password);
      this.props.onHide();
    }
  },

  isValid: function () {

    if (this.state.handle === '') {
      this.setState({handleHelp: 'enter a valid handle'});
      return false;
    } else if (this.state.password === '') {
      this.setState({passwordHelp: 'enter a valid password'});
      return false;
    }

    return true;
  },

  componentDidMount: function (event) {

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

    var submit = (
      <Button bsStyle='primary' onClick={ this.onSignIn }>Sign In</Button>
    );

    return (
      <Modal {...this.props} className='send-modal' bsSize='small'>
        <div className='modal-body clearfix'>
          <h4>Sign In </h4>
          <div className='row'>
            <div className="col-sm-12">
              <Input
                type='text'
                name="handle"
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
                onChange={this.handleChange}
                buttonAfter={ submit }
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
});

module.exports = SignInModal;
