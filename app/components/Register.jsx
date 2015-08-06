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

    return {};
  },

  getStateFromFlux: function () {

    return {};
  },

  onRegister: function (event) {

    var flux = this.getFlux();
    flux.actions.config.register(this.state.handle, this.state.password);
    this.props.onHide();
  },

  componentDidMount: function (event) {

  },

  handleChange: function (event) {

    var updated = {};
    updated[event.target.name] = event.target.value;
    this.setState(updated);
  },

  render: function () {

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
                name="handle"
                placeholder='email address / username'
                onChange={ this.handleChange }
              />
            </div>
            <div className="col-sm-12">
              <Input
                type="password"
                name="password"
                ref="input"
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

module.exports = RegisterModal;
