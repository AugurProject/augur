var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Alert = ReactBootstrap.Alert;

var Welcome = React.createClass({

  mixins: [FluxMixin],

  getInitialState: function() {
    return {
      alertVisible: false
    };
  },

  getStateFromFlux: function() {

    var flux = this.getFlux();

    return {};
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

module.exports = Welcome;
