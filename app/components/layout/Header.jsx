let React = require("react");
let Fluxxor = require("fluxxor");
let FluxMixin = Fluxxor.FluxMixin(React);
let SendModal = require("../SendModal");
let SendCashModal = SendModal.SendCashModal;
let SendRepModal = SendModal.SendRepModal;
let SendEtherModal = SendModal.SendEtherModal;
let Button = require("react-bootstrap/lib/Button");
let Link = require("react-router/lib/components/Link");
let utilities = require("../../libs/utilities");
let BigNumber = require("bignumber.js");

let Header = React.createClass({

    mixins: [FluxMixin], // only to dispatch action

    handleSignInClick(event){
        event.preventDefault();
        this.props.toggleSignInModal();
    },

    handleRegisterClick(event){
        event.preventDefault();
        this.props.toggleRegisterModal();
    },

    handleSendCashClick(event){
        event.preventDefault();
        this.props.toggleSendCashModal();
    },

    handleSendRepClick(event){
        event.preventDefault();
        this.props.toggleSendRepModal();
    },

    handleSendEtherClick(event){
        event.preventDefault();
        this.props.toggleSendEtherModal();
    },

    handleSignOutClick: function (event) {
        event.preventDefault();
        this.getFlux().actions.config.signOut();
    },

    getCashText() {
        let hasCash = this.props.asset.cash && this.props.asset.cash > 0;
        if (!hasCash && this.props.isNewRegistration) {
            return "-";
        } else {
            return this.props.asset.cash ?
                utilities.commafy(this.props.asset.cash.toFixed(2)) : "-";
        }
    },

    getRepText() {
        let hasRep = this.props.asset.reputation && this.props.asset.reputation > 0;
        if (!hasRep && this.props.isNewRegistration) {
            return "-";
        } else {
            return this.props.asset.reputation ?
                utilities.commafy(this.props.asset.reputation.toFixed(2)) : "-";
        }
    },

    getEtherText() {
        let hasEther = this.props.asset.ether && this.props.asset.ether > 0;
        if (!hasEther && this.props.isNewRegistration) {
            return "-";
        } else {
            return this.props.asset.ether ?
                utilities.commafy((utilities.formatEther(this.props.asset.ether).value)) : "-";
        }
    },

    render() {
        let isUserLoggedIn = this.props.userAccount;
        let menuItemsOnLeft, menuItemsOnRight;

        if (isUserLoggedIn) {
            menuItemsOnLeft = (
                <ul className="nav navbar-nav">
                    <li>
                        <Link to="markets">
                            Markets{/* ({this.props.marketsCount})*/}
                        </Link>
                    </li>
                    <li>
                        <Link to="portfolio">
                            Portfolio
                        </Link>
                    </li>
                    <li>
                        <Link to="reports">
                            Reporting{/* ({this.props.ballotsCount})*/}
                        </Link>
                    </li>
                    <li>
                        <Link to="overview">
                            My Markets
                        </Link>
                    </li>
                </ul>
            );

            let cashBalance = this.getCashText();
            let repBalance = this.getRepText();
            let etherBalance = this.getEtherText();
            menuItemsOnRight = (
                <ul className="nav navbar-nav navbar-right">
                    <li onClick={this.handleSendCashClick}>
                        <a href="#" className="">
                            Cash: {cashBalance}
                        </a>
                    </li>
                    <li onClick={this.handleSendRepClick}>
                        <a href="#" className="">
                            Rep: {repBalance}
                        </a>
                    </li>
                    <li onClick={this.handleSendEtherClick}>
                        <a href="#" className="">
                            Ether: {etherBalance}
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={this.handleSignOutClick}>
                            Sign Out
                        </a>
                    </li>
                </ul>
            );
        } else {
            menuItemsOnLeft = (
                <ul className="nav navbar-nav">
                    <li>
                        <Link to="markets">
                            Markets ({this.props.marketsCount})
                        </Link>
                    </li>
                </ul>
            );

            menuItemsOnRight = (
                <ul className="nav navbar-nav navbar-right">
                    <li onClick={this.handleSignInClick}>
                        <a href="#">Sign in</a>
                    </li>
                    <li onClick={this.handleRegisterClick}>
                        <a href="#">Register</a>
                    </li>
                </ul>
            );
        }

        return (
            <nav className="navbar" role="navigation">
                <div className="navbar-brandbox">
                    <Link className="navbar-brand" to="markets"></Link>
                </div>
                <div className="container">
                    <div className="navbar-header">
                        <a href="#" type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-main-collapse">
                            <strong>Menu</strong>
                        </a>
                    </div>

                    <div className="collapse navbar-collapse" id="navbar-main-collapse">
                        {menuItemsOnLeft}
                        {menuItemsOnRight}
                    </div>
                </div>
            </nav>
        );
    }
});

module.exports = Header;
