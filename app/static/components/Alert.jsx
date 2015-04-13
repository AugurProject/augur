var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;

var Alert = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('log')],

  getInitialState: function () {
    return {
      alertVisible: false
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();

    return {
      messages: flux.store('log').getState().log
    }
  },

  render: function () {

    if (this.state.alertVisible) {
      return (
        <Alert onDismiss={ this.handleAlertDismiss } id='alert'>
          <MessageList prop={ this.state.messages } />
        </Alert>
      );
    }
  },

  handleAlertDismiss: function() {

    this.setState({alertVisible: false});
  },

  handleAlertShow: function() {

    this.setState({alertVisible: true});
  }

});

var MessageList = React.createClass({

  render: function() {

    var messageList = _.map(this.props.messages, function (message) {
      return (
        <div className='message { message.type }'>{ message.text }</div>
      );
    });

    return messageList;
  }
});

module.exports = {
  Alert: Alert,
};
