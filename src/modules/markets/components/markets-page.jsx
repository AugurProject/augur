import React from 'react';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

import SiteHeader from '../../app/components//site-header';
import Markets from '../../markets/components/markets';
import Link from '../../link/components/link';

module.exports = React.createClass({
    propTypes: {
        className: React.PropTypes.string,

        siteHeader: React.PropTypes.object,
        createMarketLink: React.PropTypes.object,

		markets: React.PropTypes.array,
		favoriteMarkets: React.PropTypes.array,

		keywords: React.PropTypes.string,
		filtersProps: React.PropTypes.object,
		marketsHeader: React.PropTypes.object,

		onChangeKeywords: React.PropTypes.func
    },

    shouldComponentUpdate: shouldComponentUpdatePure,

    render: function() {
        var p = this.props;
        return (
			<div className="page markets">
				<SiteHeader { ...p.siteHeader } />

				<header className="page-header">
					<Link className="button markets-header-item make" { ...p.createMarketLink }>Make a Market</Link>
					<span className="big-line">Augur lets you trade any market</span>.
					Find a market you can beat,
					and buy shares on the side that <b><i>you think</i></b> should go up.
					When you're right, you make money.
				</header>

				<Markets className="page-content" { ...p } />
			</div>
		);
    }
});