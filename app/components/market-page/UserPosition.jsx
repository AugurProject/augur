let React = require('react');

let UserPosition = React.createClass({
    render() {
        let positionRow;
        if (this.props.position == null) {
            let market = this.props.market;
            let priceFormatted = market.price ? Math.abs(market.price).toFixed(3) : '-';
            positionRow = (
                <tr>
                    <td colSpan="4">
                        to be done
                    </td>
                    {/*
                    <td className="text-right">
                        0
                    </td>
                    <td className="text-right">
                        -
                    </td>
                    <td className="text-right">
                        <span in-highlight="app.contract.lastTradeCostPerShare">
                            { priceFormatted }
                        </span>
                    </td>
                    <td className="text-right">
                        -
                    </td>
                    */}
                </tr>
            );
        } else {
            positionRow = (
                <tr ng-if="position.position">
                    <td className="text-right" ng-click="position.onQuantityClicked(position.position.quantity)"
                        title="Fill in this quantity to order ticket">
                        <strong ng-bind="position.position.quantityFormatted"
                                in-pos-neg="{{position.position.quantity}}"
                                in-highlight="position.position.quantity"></strong>
                    </td>
                    <td className="text-right">
                        <span
                            ng-bind="position.position.averageCostPerShareFormatted"
                            in-highlight="position.position.averageCostPerShare"></span>
                    </td>
                    <td className="text-right">
                        <span ng-bind="app.contract.lastTradeCostPerShareFormatted"
                              in-highlight="app.contract.lastTradeCostPerShare"></span>
                    </td>
                    <td className="text-right">
                        <span ng-bind="position.position.totalProfitLossFormatted"
                              in-pos-neg="{{position.position.totalProfitLoss}}"
                              in-highlight="position.position.totalProfitLoss"></span>
                    </td>
                </tr>
            );
        }
        return (
            <div ng-controller="PositionController as position">
                <h4>
                    <span className="hidden-xs">My Position</span>
                    <a className="visible-xs-inline-block collapsibleTitle collapsed" data-toggle="collapse"
                       href="#myPositionCollapse" aria-expanded="true" aria-controls="myPositionCollapse">
                        My Position
                    </a>
                    <a className="helpPopover" data-toggle="modal" data-target="#help-markets-my-positions"
                       ng-include="'question-icon'">
                    </a>
                </h4>

                <jspinclude page="../../include/help-popover.jsp">
                    <jspparam name="contentCmsName" value="help-markets-my-positions"/>
                    <jspparam name="labelCmsName" value="help-markets-my-positions-label"/>
                    <jspparam name="labelDefaultValue" value="My Position"/>
                </jspinclude>

                <div id="myPositionCollapse" className="collapse collapsedOnMobile">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="text-right">Position</th>
                                <th className="text-right">Avg. Price</th>
                                <th className="text-right">Last Trade</th>
                                <th className="text-right">Profit/Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            { positionRow }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = UserPosition;