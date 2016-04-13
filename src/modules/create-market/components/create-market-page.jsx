import React from 'react';

import SiteHeader from '../../site/components/site-header';
import CreateMarketForm from '../../create-market/components/create-market-form';

module.exports = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		siteHeader: React.PropTypes.object,
		createMarketForm: React.PropTypes.object
	},

	render: function() {
		var p = this.props;
		return (
			<main className="page create-market">
				<SiteHeader { ...p.siteHeader } />

				<header className="page-header">
					<span className="big-line">Be the market maker</span>.
					Earn fees by making markets for people to trade.
					The more people <b><i>trade</i></b> your markets, the more fees you will <b><i>make</i></b>.
				</header>

				<CreateMarketForm
					className="page-content create-market-content"
					{ ...p.createMarketForm } />
			</main>
		);
	}
});