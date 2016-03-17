let React = require('react');

let ConfirmNewMarketModal = require("./ConfirmNewMarketModal");

let MarketCreateStep4 = React.createClass({
    getOutcomeInfo() {
        let marketType = this.props.marketType;
        switch (marketType) {
            case "binary":
            case "categorical":
                return (
                    <tr className="">
                        <td className="col-xs-3">Answers:</td>
                        <td className="">
                            {this.props.choices.join(", ")}
                        </td>
                    </tr>
                );
            case "scalar":
                return (
                    <tr className="">
                        <td className="col-xs-3">Min-max value:</td>
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
                        <td className="col-xs-3 text--verticalTop">Starting prices:</td>
                        <td className="text--verticalTop">
                            {this.props.choices.map((choice, index) => {
                                return (
                                    <p key={index}>{choice}: {this.props.outcomePrices[index]}</p>
                                )
                            }, this)}
                        </td>
                    </tr>
                );
            case "scalar":
                return (
                    <tr className="">
                        <td className="col-xs-3">Starting price:</td>
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
    onEditClick(event) {
        let step = parseInt(event.currentTarget.getAttribute("data-targetstep"), 10);
        this.props.goToStep(step);
    },
    render() {
        return (
            <div>
                <h1>
                    Review and open your new market
                </h1>

                <hr/>

                <div className="form-group">
                    <div className="layout--titleWithAction">
                        <h3>Your question</h3>
                        <button className="btn btn-xs" onClick={this.onEditClick} data-targetstep="1">
                            Edit
                        </button>
                    </div>
                    <table className="table table-condensed table-no-border">
                        <tbody>
                            <tr className="">
                                <td className="col-xs-3">Question:</td>
                                <td className="">{this.props.marketText}</td>
                            </tr>
                            { this.getOutcomeInfo() }
                            <tr className="">
                                <td className="col-xs-3">End date:</td>
                                <td className="">{this.props.maturationDate}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                <hr/>

                <div className="form-group">
                    <div className="layout--titleWithAction">
                        <h3>Additional information</h3>
                        <button className="btn btn-xs" onClick={this.onEditClick} data-targetstep="2">
                            Edit
                        </button>
                    </div>
                    <table className="table table-condensed table-no-border">
                        <tbody>
                            <tr className="">
                                <td className="col-xs-3">Expiry source:</td>
                                <td className="">
                                    {this.props.expirySourceUrl != "" ? this.props.expirySourceUrl : "Local, national or international news media"}
                                </td>
                            </tr>
                            <tr className="">
                                <td className="col-xs-3">Tags:</td>
                                <td className="">{this.props.tags.length > 0 ? this.props.tags.join(", ") : "-"}</td>
                            </tr>
                            <tr className="">
                                <td className="col-xs-3">Further explanation:</td>
                                <td className="">{this.props.detailsText != "" ? this.props.detailsText : "-"}</td>
                            </tr>
                            <tr className="">
                                <td className="col-xs-3">Helpful links:</td>
                                <td className="">{this.props.resources.length > 0 ? this.props.resources.join(", ") : "-"}</td>
                            </tr>
                            <tr className="">
                                <td className="col-xs-3">Image:</td>
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
                    <div className="layout--titleWithAction">
                        <h3>Trading fee and liquidity</h3>
                        <button className="btn btn-xs" onClick={this.onEditClick} data-targetstep="3">
                            Edit
                        </button>
                    </div>
                    <table className="table table-condensed table-no-border">
                        <tbody>
                            <tr className="">
                                <td className="col-xs-3">Trading fee:</td>
                                <td className="">
                                    {this.props.tradingFee}%
                                </td>
                            </tr>
                            <tr className="">
                                <td className="col-xs-3">Initial liquidity:</td>
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
                    <button className="btn btn-success" type="button" onClick={this.props.toggleConfirmNewMarketModal}>
                        Open market
                    </button>
                </div>
                <ConfirmNewMarketModal
                    goToNextStep={this.props.goToNextStep}
                    sendNewMarketRequest={this.props.sendNewMarketRequest}
                    show={this.props.confirmNewMarketModalOpen}
                    onHide={this.props.toggleConfirmNewMarketModal} />

            </div>
        )
    }
});

module.exports = MarketCreateStep4;