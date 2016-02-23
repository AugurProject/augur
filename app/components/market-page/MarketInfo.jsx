let React = require('react');

let abi = require("augur-abi");
let moment = require("moment");
let _ = require("lodash");

let MarketInfo = React.createClass({
    render() {
        let market = this.props.market;
        let priceFormatted = market.price ? Math.abs(market.price).toFixed(3) : '-';
        let outstandingShares =_.reduce(market.outcomes, (outstandingShares, outcome) => {
            return outcome ? outstandingShares + parseFloat(outcome.outstandingShares) : outstandingShares;
        }, 0);
        let outstandingSharesFormatted = outstandingShares != 0 ? +outstandingShares.toFixed(2) : '-';

        let tradingFeeFormatted = market.tradingFee ? market.tradingFee.times(100).toFixed(1)+'%' : '-';
        let tradersCountFormatted = market.traderCount ? +market.traderCount.toNumber() : '-';
        let authorFormatted = market.author ? abi.format_address(abi.hex(market.author)) : '-';
        let creationDateFormatted = market.creationDate ? moment(market.creationDate).format('MMM D, YYYY') : '-';
        let endDateLabel = (market.endDate != null && market.matured) ? 'Matured:' : 'End date:';
        let endDateFormatted = market.endDate != null ? moment(market.endDate).format('MMM D, YYYY') : '-';
        let expirySource = "";
        if (market.metadata) expirySource = market.metadata.source;

        return (
            <div className='row marketInfo'>
                <div className="col-sm-6">
                    <table className="table table-condensed table--leftRightAlignment">
                        <tbody>
                            <tr className="labelValue">
                                <td className="labelValue-label">Price:</td>
                                <td className="labelValue-value">{ priceFormatted }</td>
                            </tr>
                            <tr className="labelValue">
                                <td className="labelValue-label">Outstanding shares:</td>
                                <td className="labelValue-value">{ outstandingSharesFormatted }</td>
                            </tr>
                            <tr className="labelValue">
                                <td className="labelValue-label">Fee:</td>
                                <td className="labelValue-value">{ tradingFeeFormatted }</td>
                            </tr>
                            <tr className="labelValue">
                                <td className="labelValue-label">Traders:</td>
                                <td className="labelValue-value">{ tradersCountFormatted }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-sm-6">
                    <table className="table table-condensed table--leftRightAlignment">
                        <tbody>
                            <tr className="labelValue">
                                <td className="labelValue-label">Author:</td>
                                <td className="labelValue-value">
                                    <div className="marketInfo-author-value">
                                        { authorFormatted }
                                    </div>
                                </td>
                            </tr>
                            <tr className="labelValue">
                                <td className="labelValue-label">Creation date:</td>
                                <td className="labelValue-value">{ creationDateFormatted }</td>
                            </tr>
                            <tr className="labelValue">
                                <td className="labelValue-label">{ endDateLabel }</td>
                                <td className="labelValue-value">{ endDateFormatted }</td>
                            </tr>
                            <tr className="labelValue">
                                <td className="labelValue-label">Expiry source:</td>
                                <td className="labelValue-value">{ expirySource }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = MarketInfo;