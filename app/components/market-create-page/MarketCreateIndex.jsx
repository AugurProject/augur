let React = require('react');

let Link = require("react-router/lib/components/Link");

let MarketCreateIndex = React.createClass({
    render() {
        return (
            <div>
                <h1>
                    Select the type of market you want to create
                </h1>

                <div className="">
                    <Link to="market-create" query={{type: "binary"}}>
                        <h4>
                            A market with a
                            <span className="text-uppercase">yes</span> or <span className="text-uppercase">no</span>
                            outcome
                        </h4>
                        <span>
                            Select
                        </span>
                    </Link>

                    <p>
                        Ask a question that has a simple <span className="text-uppercase">yes</span> or
                        <span className="text-uppercase">no</span> answer
                    </p>
                </div>
                <div className="">
                    <Link to="market-create" query={{type: "categorical"}}>
                        <h4>
                            A market with a <span className="text-uppercase">multiple choice</span> outcome
                        </h4>
                        <span>
                            Select
                        </span>
                    </Link>

                    <p>
                        Ask a question and provide a series of multiple choice answers
                    </p>
                </div>
                <div className="">
                    <Link to="market-create" query={{type: "scalar"}}>
                        <h4>
                            A market with a <span className="text-uppercase">numeric</span> outcome
                        </h4>
                        <span>
                            Select
                        </span>
                    </Link>

                    <p>
                        Ask a question that has an answer somewhere within a range of numbers
                    </p>
                </div>
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