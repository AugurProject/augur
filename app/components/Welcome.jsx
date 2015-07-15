var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Alert = ReactBootstrap.Alert;

var Welcome = React.createClass({

  getInitialState: function() {
    return {
      alertVisible: true
    };
  },

  render: function () {

    if (this.state.alertVisible) {

      return (
        <Alert className="welcome" bsStyle='success' onDismiss={ this.handleAlertDismiss }>
          <h3>Welcome to the Augur Alpha release!</h3>
          <p>This release showcases the basic features of our decentralized prediction market. It's by no means feature complete and certainly prone to bugs.</p>
          <p>Tell us what you think and report any issues you have using the "Feedback" link below.</p>
        </Alert>
      );

    } else {

      return <span />;
    }
  },

  handleAlertDismiss: function() {

    this.setState({alertVisible: false});
  }

});

module.exports = Welcome;
