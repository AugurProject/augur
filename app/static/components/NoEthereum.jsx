var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;

var NoEthereumModal = React.createClass({
  mixins: [FluxMixin],

  getInitialState: function () {
    return {
      amount: '',
      destination: ''
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();

    return {
      balance: flux.store('asset').getState().balance
    }
  },

  startDemoMode: function (event) {
    this.setState({amount: event.target.value});
  },

  render: function () {
    return (
      <Modal {...this.props} id='no-eth-modal' bsSize='small'>
        <div className="modal-body clearfix">
            <h4>Ethereum not found</h4>
            <p>Augur requires a local node of the Ethereum client running</p>
            <p>Visit <a href="https://github.com/ethereum/cpp-ethereum/wiki">the ethereum github wiki</a> for help installing the lastest client</p>
            <p><a className="pull-right start-demo-mode" onClick={ this.startDemoMode } href="javascript:void(0)" data-dismiss="modal">Proceed in demo mode</a></p>
        </div>
      </Modal>
    );
  }
});

module.exports = {
  NoEthereumModal: NoEthereumModal
};
