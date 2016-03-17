let React = require('react');

let MarketCreateIndex = React.createClass({
    render() {
        return (
            <div>
                <h1>
                    Select the type of market you want to create
                </h1>
                <hr/>
                <div className="">
                    <div className="layout--titleWithAction">
                        <h4>
                            <a href="#" data-type="binary" onClick={this.props.onMarketTypeChange}>
                                A market with a <span className="text-uppercase">yes</span> or <span className="text-uppercase">no</span> outcome
                            </a>
                        </h4>
                        <button className="btn btn-primary" data-type="binary" onClick={this.props.onMarketTypeChange}>
                            Select
                        </button>
                    </div>

                    <p>
                        Ask a question that has a
                        simple <span className="text-uppercase">yes</span> or <span className="text-uppercase">no</span> answer
                    </p>
                </div>
                <hr/>
                <div className="">
                    <div className="layout--titleWithAction">
                        <h4>
                            <a href="#" data-type="categorical" onClick={this.props.onMarketTypeChange}>
                                A market with a <span className="text-uppercase">multiple choice</span> outcome
                            </a>
                        </h4>
                        <button className="btn btn-primary" data-type="categorical" onClick={this.props.onMarketTypeChange}>
                            Select
                        </button>
                    </div>

                    <p>
                        Ask a question and provide a series of multiple choice answers
                    </p>
                </div>
                <hr/>
                <div className="">
                    <div className="layout--titleWithAction">
                        <h4>
                            <a href="#" data-type="scalar" onClick={this.props.onMarketTypeChange}>
                                A market with a <span className="text-uppercase">numeric</span> outcome
                            </a>
                        </h4>
                        <button className="btn btn-primary" data-type="scalar" onClick={this.props.onMarketTypeChange}>
                            Select
                        </button>
                    </div>

                    <p>
                        Ask a question that has an answer somewhere within a range of numbers
                    </p>
                </div>
                <hr/>
                <div>
                    <h4>
                        Important:
                    </h4>

                    <p>
                        There is a $30.00 bond charged to your account when you create a new market. If the
                        outcome
                        of your market cannot be determined (and the market cannot be expired as a result) or if
                        your market is ruled unethical, this bond will be forfeited. If your market is expired
                        the
                        bond will be returned to you in full.
                    </p>
                </div>
            </div>
        );
    }
});

module.exports = MarketCreateIndex;