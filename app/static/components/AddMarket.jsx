var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;


var AddMarketModal = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market')],

  getInitialState: function () {
    return {
      marketText: '',
      marketInvestment: '',
      events: []
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();

    return {
    }
  },

  onChangeMarketText: function (event) {
    this.setState({destination: event.target.value});
  },

  onChangeMarketInvestment: function (event) {
    this.setState({amount: event.target.value});
  },

  onAddEvent: function (event) {

  },

  onSubmit: function (event) {
    // TODO: Validate the state, then call a contract to send the
    // transaction requested in the state.
    this.props.onRequestHide();
  },

  render: function () {
    return (
      <Modal {...this.props} id='add-market-modal'>
        <div className="modal-body clearfix">
          <h4>New Market</h4>
          <form role="form clearfix">
              <div className="form-group">
                  <label for="market-text">Market description</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="market-text" 
                    placeholder="Enter a a description for this market"  
                    onChange={ this.onChangeMarketText } 
                  />
              </div>
              <div className="form-group">
                  <label for="market-investment">Initial liquidity</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="market-investment" 
                    placeholder="The markets initial liquidity"
                    onChange={ this.onChangeMarketInvestment } 
                  />
              </div>
              <div className="form-group clearfix">
                  <label for="market-events">No Events</label>
                  <a href="#" onClick={ this.onAddEvent } className='pull-right'>Add Event</a>
              </div>
              <Button bsStyle='primary' onClick={ this.onSubmit } className='pull-right'>Submit Market</Button>
          </form>
        </div>
      </Modal>
    );
  }
});

var AddMarketTrigger = React.createClass({
  mixins: [FluxMixin],

  render: function () {
    return (
      <ModalTrigger modal={<AddMarketModal {...this.props} />}>
        <a href='#'>Submit a Market</a>
      </ModalTrigger>
    );
  }
});

module.exports = {
  AddMarketModal: AddMarketModal,
  AddMarketTrigger: AddMarketTrigger
};
