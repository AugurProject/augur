let React = require('react');

let OrderTicketStep3 = React.createClass({
    render() {
        let style = {
            display: this.props.isVisible ? "" : "none"
        };
        return (
            <div className="orderTicket-step" style={style}>
                <div className="orderTicket-step-content">
                    <p ng-show="orderTicket.process.isEnteringOrder">
                        Entering order...
                    </p>

                    <div className="orderTicket-result" style={{width: '100%'}} ng-if="!app.isUserLoggedIn">
                        <div className="info">
                            {/*<%@ include file="/assets/svg/user.svg" %>*/}
                        </div>
                        <div>
                            That's how an order to buy or sell shares is created.
                            <a href="/login">Login</a> or <a href="/sign-up">sign-up</a> to make
                            this trade for real.
                        </div>
                    </div>
                    <div className="orderTicket-result"
                         ng-show="!orderTicket.process.isEnteringOrder" ng-if="app.isUserLoggedIn">
                        <div className="success" ng-show="orderTicket.process.success === true"
                             style={{width: '100%'}}>
                            {/*<%@ include file="/assets/svg/check.svg" %>*/}
                            <p>Your order has been sent</p>
                        </div>
                        <div className="failure" ng-show="orderTicket.process.success === false"
                             style={{width: '100%'}}>
                            {/*<%@ include file="/assets/svg/attention.svg" %>*/}
                            <p>There was a problem</p>

                            <p>Your order has not been sent</p>

                            <p>{/*orderTicket.process.errorMessage*/}</p>
                        </div>
                    </div>
                    <div>
                        <button
                            className="btn btn-block btn-md btn-fill btn-info orderTicket-submitAction"
                            onClick={this.props.onContinue}
                            ng-show="!orderTicket.process.isEnteringOrder">
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = OrderTicketStep3;