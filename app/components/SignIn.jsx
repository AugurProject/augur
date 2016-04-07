let React = require("react");
let FluxMixin = require("fluxxor/lib/flux_mixin")(React);
let Button = require('react-bootstrap/lib/Button');
let Input = require('react-bootstrap/lib/Input');
let Modal = require('react-bootstrap/lib/Modal');
let request = require("browser-request");
let utilities = require("../libs/utilities");

let SignInModal = React.createClass({

  mixins: [FluxMixin],

  getInitialState: function () {
    return {
      handle: '',
      password: '',
      persist: false,
      handleHelp: null,
      passwordHelp: null
    };
  },

  onSignIn: function (event) {
    event.preventDefault();

    if (this.isValid()) {
      let flux = this.getFlux();
      let self = this;

      // NOTE: this is here because the signin flux action in config does not
      // return a value and it's important to communicate any server-side error
      // to the user here
      flux.augur.web.login(this.state.handle, this.state.password, {
        persist: this.state.persist
      }, function (account) { 
        if (account) {
          if (account.error) {
            self.setState({handleHelp: account.message});
            flux.actions.config.updateAccount({
              currentAccount: null,
              privateKey: null,
              handle: null,
              keystore: null
            });
            flux.actions.asset.updateAssets();
            return;
          }
          console.log("signed in to account:", account);
          flux.actions.config.updateAccount({
            currentAccount: account.address,
            privateKey: account.privateKey,
            handle: account.handle,
            keystore: account.keystore
          });
          flux.actions.asset.updateAssets();
          flux.actions.market.loadMarkets();
          flux.actions.report.loadEventsToReport();
          flux.actions.asset.loadMeanTradePrices();
          self.props.onHide();
        } else {
          console.error(account);
        }
      });
    }
  },

  isValid: function () {
    if (this.state.handle === '') {
      this.setState({handleHelp: 'enter a valid handle'});
      return false;
    } else if (this.state.password === '') {
      this.setState({passwordHelp: 'enter a valid password'});
      return false;
    }
    return true;
  },

  componentDidMount: function (event) {

  },

  handleChange: function (event) {
    let form = {};
    let help = {};
    form[event.target.name] = event.target.value;
    help[event.target.name+'Help'] = null;
    this.setState(form);
    this.setState(help);
  },

  handlePersistChange: function (event) {
    this.setState({persist: event.target.checked});
  },

  render: function () {

    let handleStyle = this.state.handleHelp ? 'error' : null;
    let passwordStyle = this.state.passwordHelp ? 'error' : null;

    let submit = (
      <Button bsStyle='primary' type="submit">Sign In</Button>
    );

    return (
      <Modal {...this.props} className='send-modal' bsSize='small'>
        <div className='modal-body clearfix'>
          <h4>Sign In </h4>
          <form onSubmit={this.onSignIn}>
            <div className='row'>
              <div className="col-sm-12">
                <Input
                  type='text'
                  name="handle"
                  bsStyle={ handleStyle }
                  help={ this.state.handleHelp }
                  placeholder='email address / username'
                  onChange={ this.handleChange } />
              </div>

              <div className="col-sm-12">
                <Input
                  type="password"
                  name="password"
                  ref="input"
                  bsStyle={ passwordStyle }
                  help={ this.state.passwordHelp }
                  placeholder='password'
                  onChange={this.handleChange}
                  buttonAfter={ submit } />
              </div>

              <div className="col-sm-12">
                <Input
                  label="Remember Me"
                  type="checkbox"
                  name="persist"
                  id="persist-checkbox"
                  onChange={ this.handlePersistChange } />
              </div>
            </div>
          </form>
        </div>
      </Modal>
    );
  }
});

module.exports = SignInModal;
