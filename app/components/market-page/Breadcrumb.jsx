let React = require('react');

let Router = require("react-router");
let Link = Router.Link;

let Breadcrumb = React.createClass({
    render() {
        return (
            <div className="row">
                <ul className="breadcrumb">
                    <li>
                        <Link to='markets'>
                            Markets
                        </Link>
                    </li>
                    {/*<li>
                        <a ui-sref="markets.listing({ nodeId: marketDetail.branch._id })">
                            {{ marketDetail.branch.description }}
                        </a>
                    </li>*/}
                    <li>
                        {/*<a href="#" data-toggle="dropdown">*/}
                        <span>
                            {this.props.market.description}
                        </span>
                        {/*<span className="caret"></span>*/}
                        {/*</a>*/}

                        {/*<table className="dropdown-menu table table-hover" role="menu"*/}
                        {/*style="max-width: none; width: auto;">*/}
                        {/*<tbody>*/}
                        {/*<tr ng-repeat="market in breadcrumb.markets track by market._id" ng-className="{highlighted: breadcrumb.market._id === marketDetail.market._id}">*/}
                        {/*<td className="text-nowrap">*/}
                        {/*<a ui-sref="marketDetail({ marketId: market._id })"*/}
                        {/*ng-if="market._id !== marketDetail.market._id">*/}
                        {/*{{market.description}}*/}
                        {/*</a>*/}
                        {/*<span ng-if="market.id === marketDetail.market._id">*/}
                        {/*{{market.description}}*/}
                        {/*</span>*/}
                        {/*</td>*/}
                        {/*<td className="text-nowrap text-right">*/}
                        {/*Last: <strong>{{market.lastTradeCostPerShareFormatted}}*/}
                        {/*({{market.lastTradePriceFormatted}}%)</strong>*/}
                        {/*</td>*/}
                        {/*</tr>*/}
                        {/*</tbody>*/}
                        {/*</table>*/}
                    </li>
                </ul>
            </div>
        );
    }
});

module.exports = Breadcrumb;