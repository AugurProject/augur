let React = require('react');

let Button = require("react-bootstrap/lib/Button");
let Input = require("react-bootstrap/lib/Input");

let MarketCreateStep3 = React.createClass({

    generateInputs(marketType) {
        switch (marketType) {
            case "binary":
            case "categorical":
                return (
                    <div>
                        <h4>
                            Set the starting price of each outcome (required)
                        </h4>
                        <p>
                            These are your estimates of the percentage probability that each possible answer to your
                            question will be the correct outcome. The Market Maker will start selling the shares
                            purchased with your initial liquidity at these prices.
                        </p>
                        <p>
                            Your estimated probabilities must equal 100%.
                        </p>
                        <div className="row">
                            <div className="col-sm-6 form-horizontal">
                                {
                                    this.props.choices.map((outcome, index) => {
                                      return (
                                          <Input
                                              key={index}
                                              type="text"
                                              standalone={true}
                                              label={outcome}
                                              labelClassName="col-sm-2"
                                              wrapperClassName="col-sm-5"
                                              groupClassName="form-group"
                                              data-index={index}
                                              value={this.props.outcomePrices[index]}
                                              bsStyle={this.props.outcomePriceErrors[index] != null ? "error" : null}
                                              help={this.props.outcomePriceErrors[index]}
                                              addonAfter='%'
                                              onChange={this.props.onOutcomePriceChange}
                                              />
                                      );
                                    })
                                }
                                { this.props.outcomePriceGlobalError != null &&
                                    <p className="has-error">
                                        <span className="help-block">
                                            { this.props.outcomePriceGlobalError }
                                        </span>
                                    </p>
                                }
                            </div>
                        </div>
                    </div>
                );
            case "scalar": {
                let index = 0;
                return (
                    <div className="form-horizontal">
                        <h4>
                            Set the starting price for your question (required)
                        </h4>
                        <p>
                            Enter what you believe is a fair and accurate estimate of the answer to your question. This
                            must lie between the minimum and maximum values set above. The Market Maker will start
                            selling the shares purchased with your initial liquidity at this prices.
                        </p>
                        <Input
                            type="text"
                            key={index}
                            data-index={index}
                            value={this.props.outcomePrices[index]}
                            bsStyle={this.props.outcomePriceErrors[index] != null ? "error" : null}
                            labelClassName="col-xs-2"
                            wrapperClassName="col-xs-10"
                            help={this.props.outcomePriceErrors[index]}
                            onChange={this.props.onOutcomePriceChange}
                          />
                        <div>
                            Min: {this.props.minValue}, max: {this.props.maxValue}
                        </div>
                    </div>
                );
            }
            default:
                console.warn("MarketCreateStep3[generateInputs]: Unknown market type %o", marketType);
                return "";


        }

    },
    render() {
        return (
            <div>
                <h1>
                    Trading fee and liquidity
                </h1>

                <form>
                    <div className="form-group">
                        <h4>
                            Set the trading fee for your market (required)
                        </h4>
                        <p>
                            The Trading Fee is a percentage fee charged against the value of any trade made in the market.
                            You'll receive 50% of all fees charged during the lifetime of your market - with the other
                            50% being awarded to those reporting the outcome.
                        </p>

                        <div className="row">
                            <div className="col-sm-3">
                                <Input
                                    type='text'
                                    standalone={true}
                                    bsStyle={this.props.tradingFeeError != null ? "error" : null}
                                    help={ this.props.tradingFeeError }
                                    addonAfter='%'
                                    value={ this.props.tradingFee }
                                    onChange={ this.props.onChangeTradingFee } />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <h4>
                            Set the amount of initial liquidity (required)
                        </h4>
                        <p>
                            Initial liquidity is the amount of cash you're putting into the market to get trading started.
                            The Market Maker will use these funds to buy shares - which are then sold back to those
                            wanting to trade your market when the market opens. Any initial liquidity remaining when
                            the market is expired will be returned to you (along with any profit generated by the Market
                            Maker from selling shares).
                        </p>
                        <div className="row">
                            <div className="col-sm-3">
                                <Input
                                    type="text"
                                    standalone={true}
                                    help={ this.props.marketInvestmentError }
                                    bsStyle={this.props.marketInvestmentError != null ? "error" : null}
                                    value={ this.props.marketInvestment }
                                    onChange={ this.props.onChangeMarketInvestment } />
                            </div>
                        </div>
                    </div>

                    {/*<div className="form-group">
                        {
                            this.generateInputs(this.props.marketType)
                        }
                    </div>*/}

                    <div className="form-group">
                        <button className="btn btn-primary" type="button" onClick={this.props.goToPreviousStep}>
                            Back
                        </button>
                        <button className="btn btn-primary" type="button" onClick={this.props.goToNextStep}>
                            Next (Review)
                        </button>
                    </div>
                </form>
            </div>
        )
    }
});

module.exports = MarketCreateStep3;