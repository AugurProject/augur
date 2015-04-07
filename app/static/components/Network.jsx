var _ = require('lodash');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;


var Network = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('config', 'network')],

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var networkState = flux.store('network').getState();
    // Add in the miner variable, which will eventually go in the NetworkStore.
    networkState = _.extend(networkState, {
      miner: false
    })

    return {
      network: networkState,
      config: flux.store('config').getState()
    }
  },

  render: function () {
    return (
      <div className="panel panel-default network">
        <div className="panel-heading clearfix">
          <span className="pull-left">Ethereum</span>
        </div>
        <div className="panel-body">
          <p className="host">
            HOST<span className="pull-right">{this.state.config.host}</span>
          </p>
          <p className="peers">
            PEERS<span className="pull-right">{this.state.network.peerCount || '-'}</span>
          </p>
          <p className="blocks">
            BLOCKS<span className="pull-right">{this.state.network.blockNumber || '-'}</span>
          </p>
          <p className="miner">
            MINER<span className="pull-right">{this.state.network.miner ? 'on' : 'off'}</span>
          </p>
          <p className="gas">
            GAS<span className="pull-right">{this.state.network.gas || '-'}</span>
          </p>
          <p className="gas-price">
            GAS PRICE<span className="pull-right">{this.state.network.gasPrice || '-'}</span>
          </p>
        </div>
      </div>
    );
  }
});

module.exports = Network;
