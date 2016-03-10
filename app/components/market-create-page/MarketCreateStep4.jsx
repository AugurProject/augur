let React = require('react');

let MarketCreateStep4 = React.createClass({
    getOutcomeInfo() {
        let marketType = this.props.marketType;
        switch (marketType) {
            case "binary":
            case "categorical":
                return (
                    <tr className="">
                        <td className="">Answers:</td>
                        <td className="">
                            {this.props.choices.join(", ")}
                        </td>
                    </tr>
                );
            case "scalar":
                return (
                    <tr className="">
                        <td className="">Min-max value:</td>
                        <td className="">{this.props.minValue} - {this.props.maxValue}</td>
                    </tr>
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
                    <tr className="">
                        <td className="">Starting prices:</td>
                        <td className="">
                            {this.props.choices.map((choice, index) => {
                                return (
                                    <p>{choice}: {this.props.outcomePrices[index]}</p>
                                )
                            }, this)}
                        </td>
                    </tr>
                );
            case "scalar":
                return (
                    <tr className="">
                        <td className="">Starting price:</td>
                        <td className="">
                            <p>{this.props.outcomePrices[0]}</p>
                        </td>
                    </tr>
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

                <hr/>

                <div className="form-group">
                    <h3>Your question</h3>
                    <table className="table">
                        <tbody>
                            <tr className="">
                                <td className="">Question:</td>
                                <td className="">{this.props.marketText}</td>
                            </tr>
                            { this.getOutcomeInfo() }
                            <tr className="">
                                <td className="">End date:</td>
                                <td className="">{this.props.maturationDate}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                <hr/>

                <div className="form-group">
                    <h3>Additional information</h3>
                    <table className="table">
                        <tbody>
                            <tr className="">
                                <td className="">Expiry source:</td>
                                <td className="">
                                    {this.props.expirySourceUrl != "" ? this.props.expirySourceUrl : "Local, national or international news media"}
                                </td>
                            </tr>
                            <tr className="">
                                <td className="">Tags:</td>
                                <td className="">{this.props.tags.length > 0 ? this.props.tags.join(", ") : "-"}</td>
                            </tr>
                            <tr className="">
                                <td className="">Further explanation:</td>
                                <td className="">{this.props.detailsText != "" ? this.props.detailsText : "-"}</td>
                            </tr>
                            <tr className="">
                                <td className="">Helpful links:</td>
                                <td className="">{this.props.resources.length > 0 ? this.props.resources.join(", ") : "-"}</td>
                            </tr>
                            <tr className="">
                                <td className="">Image:</td>
                                <td className="">
                                    {
                                        this.props.imageDataURL != null
                                        ? <img className="metadata-image" src={this.props.imageDataURL} />
                                        : "No image uploaded"
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <hr/>

                <div className="form-group">
                    <h3>Trading fee and liquidity</h3>
                    <table className="table">
                        <tbody>
                            <tr className="">
                                <td className="">Trading fee:</td>
                                <td className="">
                                    {this.props.tradingFee}%
                                </td>
                            </tr>
                            <tr className="">
                                <td className="">Initial liquidity:</td>
                                <td className="">{this.props.marketInvestment}</td>
                            </tr>
                            { this.getStartingPrices() }
                        </tbody>
                    </table>
                </div>

                <div className="form-group">
                    <button className="btn btn-primary" type="button" onClick={this.props.goToPreviousStep}>
                        Back
                    </button>
                    <button className="btn btn-primary" type="button" onClick={this.props.sendNewMarketRequest}>
                        Open market
                    </button>
                </div>
            </div>
        )
    }
});

module.exports = MarketCreateStep4;