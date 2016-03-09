let React = require('react');

let MarketCreateStep4 = React.createClass({
    getOutcomeInfo() {
        let marketType = this.props.marketType;
        switch (marketType) {
            case "binary":
            case "categorical":
                return (
                    <div className="">
                        <div className="">Answers:</div>
                        <div className="">
                            {this.props.choices.map((choice, index) => {
                                return (
                                    <p key={index}>{ choice }</p>
                                )
                            }, this)}
                        </div>
                    </div>
                );
            case "scalar":
                return (
                    <div>
                        <div className="">
                            <div className="">Min value:</div>
                            <div className="">{this.props.minValue}</div>
                        </div>
                        <div className="">
                            <div className="">Max value:</div>
                            <div className="">{this.props.maxValue}</div>
                        </div>
                    </div>
                );
            default:
                console.warn("MarketCreateStep4[getOutcomeInfo]: Unknown market type %o", marketType);
                return "";
        }
    },
    getStartingPrices() {
        let marketType = this.props.marketType;
        switch (marketType) {
            case "binary":
            case "categorical":
                return (
                    <div className="">
                        <div className="">Starting prices:</div>
                        <div className="">
                            {this.props.choices.map((choice, index) => {
                                return (
                                    <p>{choice}: {this.props.outcomePrices[index]}</p>
                                )
                            }, this)}
                        </div>
                    </div>
                );
            case "scalar":
                return (
                    <div className="">
                        <div className="">Starting price:</div>
                        <div className="">
                            <p>{this.props.outcomePrices[0]}</p>
                        </div>
                    </div>
                );
            default:
                console.warn("MarketCreateStep4[getStartingPrices]: Unknown market type %o", marketType);
                return "";
        }
    },
    render() {
        return (
            <div>
                <h1>
                    Review and open your new market
                </h1>

                <div className="form-group">
                    <h3>Your question</h3>
                    <div className="">
                        <div className="">Question:</div>
                        <div className="">{this.props.marketText}</div>
                    </div>
                    { this.getOutcomeInfo() }
                    <div className="">
                        <div className="">End date:</div>
                        <div className="">{this.props.maturationDate}</div>
                    </div>
                </div>

                <div className="form-group">
                    <h3>Additional information</h3>
                    <div className="">
                        <div className="">Expiry source:</div>
                        <div className="">
                            {this.props.expirySourceUrl != "" ? this.props.expirySourceUrl : "Local, national or international news media"}
                        </div>
                    </div>
                    <div className="">
                        <div className="">Tags:</div>
                        <div className="">{this.props.tags.join(", ")}</div>
                    </div>
                    <div className="">
                        <div className="">Further explanation:</div>
                        <div className="">{this.props.detailsText}</div>
                    </div>
                    <div className="">
                        <div className="">Helpful links:</div>
                        <div className="">{this.props.resources.join(", ")}</div>
                    </div>
                    <div className="">
                        <div className="">Image:</div>
                        <div className="">
                            {
                                this.props.imageDataURL != null
                                ? <img className="metadata-image" src={this.props.imageDataURL} />
                                : "No image uploaded"
                            }
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <h3>Trading fee and liquidity</h3>
                    <div className="">
                        <div className="">Trading fee:</div>
                        <div className="">
                            {this.props.tradingFee}%
                        </div>
                    </div>
                    <div className="">
                        <div className="">Initial liquidity:</div>
                        <div className="">{this.props.marketInvestment}</div>
                    </div>
                    { this.getStartingPrices() }
                </div>

                <div className="form-group">
                    <button type="button" onClick={this.props.goToPreviousStep}>
                        back
                    </button>
                    <button type="button" onClick={this.props.sendNewMarketRequest}>
                        Open market
                    </button>
                </div>
            </div>
        )
    }
});

module.exports = MarketCreateStep4;