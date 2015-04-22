var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var ModalTrigger = ReactBootstrap.ModalTrigger;

var SendRepModal = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('asset')],

  getInitialState: function () {
    return {
      amount: '',
      destination: ''
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();

    return {
      reputation: flux.store('asset').getState().reputation,
      ethereumClient: flux.store('config').getEthereumClient()
    }
  },

  onChangeDestination: function (event) {
    this.setState({destination: event.target.value});
  },

  onChangeAmount: function (event) {
    this.setState({amount: event.target.value});
  },

  onSend: function (event) {

    // TODO: validation and error handling
    var status = this.state.ethereumClient.sendRep(this.state.destination, this.state.amount);

    this.props.onRequestHide();
  },

  render: function () {
    return (
      <Modal {...this.props} id='send-rep-modal' bsSize='small'>
        <div className='modal-body clearfix'>
          <h4>Send reputation</h4>
          <form className='form-horizontal' role='form'>
            <div className='form-group'>
              <div className="col-sm-12">
                <input
                  type='text'
                  className='form-control dest-address'
                  placeholder='destination address'
                  onChange={this.onChangeDestination} />
              </div>
              <div className="col-sm-12">
                <div className='input-group'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='amount'
                    onChange={this.onChangeAmount} />
                  <span className="input-group-btn">
                    <Button bsStyle='primary' onClick={this.onSend}>Send</Button>
                  </span>
                </div>
              </div>
            </div>
          </form>
          <p>REPUTATION: <b className='rep-balance'>{this.state.reputation}</b></p>
        </div>
      </Modal>
    );
  }
});

var SendRepTrigger = React.createClass({
  mixins: [FluxMixin],

  render: function () {
    return (
      <ModalTrigger modal={<SendRepModal {...this.props} />}>
        <a href='#'>{ this.props.text }</a>
      </ModalTrigger>
    );
  }
});

module.exports = {
  SendRepModal: SendRepModal,
  SendRepTrigger: SendRepTrigger
};
