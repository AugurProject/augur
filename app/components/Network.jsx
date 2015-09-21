var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var utilities = require('../libs/utilities');

var Network = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('config', 'network')],

  getStateFromFlux: function () {
    var flux = this.getFlux();

    return {
      network: flux.store('network').getState(),
      host: flux.store('config').getState().host
    }
  },

  render: function () {

    var formattedGasPrice = '-';
    if (this.state.network.gasPrice) {
      formattedGasPrice = this.state.network.gasPrice.value + ' ' +  this.state.network.gasPrice.unit;
    }
    var formattedBlockTime = '-';
    if (this.state.network.blocktime) {
      formattedBlockTime = this.state.network.blocktime.format('MMM Do, HH:mm');
    }

    return (
      <div className="panel panel-default network">
        <div className="panel-heading clearfix">
          <span className="pull-left">Ethereum</span>
        </div>
        <div className="panel-body">
          <p className="client">
            CLIENT<span className="pull-right">{ this.state.network.clientVersion }</span>
          </p>
          <p className="network-id">
            NETWORK ID<span className="pull-right">{ this.state.network.networkId }</span>
          </p>
          <p className="host">
            HOST<span className="pull-right">{ this.state.host }</span>
          </p>
          <p className="peers">
            PEERS<span className="pull-right">{ this.state.network.peerCount || '-' }</span>
          </p>
          <p className="blocks">
            BLOCKS<span className="pull-right">{ this.state.network.blockNumber || '-' }</span>
          </p>
          <p className="miner">
            MINER<span className="pull-right">{ this.state.network.mining ? this.state.network.hashrate : 'off' }</span>
          </p>
          <p className="gas-price">
            GAS PRICE<span className="pull-right">{ formattedGasPrice }</span>
          </p>
          <p className="block-time">
            BLOCK TIME<span className="pull-right">{ formattedBlockTime }</span>
          </p>
        </div>
      </div>
    );
  }
});

module.exports = Network;
