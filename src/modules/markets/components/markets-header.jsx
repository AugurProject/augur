import React from 'react';
import classnames from 'classnames';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';

module.exports = React.createClass({
    propTypes: {
		selectedMarketsHeader: React.PropTypes.string,

		numMarkets: React.PropTypes.number,
		numFavorites: React.PropTypes.number,
		numPendingReports: React.PropTypes.number,

		onClickAllMarkets: React.PropTypes.func,
		onClickFavorites: React.PropTypes.func,
		onClickPendingReports: React.PropTypes.func
    },

    shouldComponentUpdate: shouldComponentUpdatePure,

    render: function() {
        var p = this.props;
        return (
            <header className="markets-header">
                <div className={ classnames('markets-header-item', 'all-markets', { 'active': !p.selectedMarketsHeader}) } onClick={ p.onClickAllMarkets }>
                    <span className="name">Markets</span>

                    { (!!p.numMarkets || p.numMarkets === 0) &&
                        <span className="num">{ '(' + p.numMarkets + ')' }</span>
                    }
                </div>

                { !!p.numPendingReports &&
					<div className={ classnames('markets-header-item', 'pending-reports', { 'active': p.selectedMarketsHeader === PENDING_REPORTS }) } onClick={ p.onClickPendingReports }>
	                    <span className="name">Pending Reports</span>
	                    <span className="num">{ '(' + p.numPendingReports + ')' }</span>
	                </div>
                }
                <div className={ classnames('markets-header-item', 'favorites', { 'active': p.selectedMarketsHeader === FAVORITES }) } onClick={ p.onClickFavorites }>
                    <span className="name">Favorites</span>

                    { (!!p.numFavorites || p.numFavorites === 0) &&
                        <span className="num">{ '(' + p.numFavorites + ')' }</span>
                    }
                </div>
            </header>
        );
    }
});