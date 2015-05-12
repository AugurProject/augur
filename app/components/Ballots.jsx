var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var utilities = require('../libs/utilities');

var Ballots = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('asset', 'branch', 'config')],

  getInitialState: function () {
    return {
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();
    var account = flux.store('network').getAccount();

    return {
      account: account,
      asset: flux.store('asset').getState(),
      ethereumClient: flux.store('config').getEthereumClient(),
      votePeriod: flux.store('branch').getState().currentVotePeriod,
      votePeriodLength: flux.store('branch').getState().currentVotePeriodLength
    }
  },

  render: function () {

    var periodEndDate = '-';
    if (this.state.votePeriod) {
      var periodEndMoment = utilities.blockToDate(this.state.votePeriod.times(this.state.votePeriodLength).toNumber());
      periodEndDate = periodEndMoment.format('MMM Do, YYYY');
    }

    var ballotList = _.map(_.sortBy(this.props.events, 'expirationBlock'), function (event) {
      return (
        <div key={ event.id } className={ this.props.classNameWrapper }>
          <Ballot event={ event } {...this.props} />
        </div>
      );
    }, this);

    return (
      <div id="ballots">
        <h3>Ballots</h3>
        <div className='subheading clearfix'>
          Period { this.state.votePeriod }
          <span className='pull-right'>Ending { periodEndDate }</span>
        </div>
        <div className='row'>
          { ballotList }
        </div>
      </div>
    );
  }
});

var Ballot = React.createClass({

  render: function() {

  }

});

module.exports = Ballots;
