import React from 'react';

import SiteHeader from '../../site/components/site-header';
import Positions from '../../positions/components/positions';
import ValueDenomination from '../../common/components/value-denomination';

module.exports = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		siteHeader: React.PropTypes.object,
		positions: React.PropTypes.array,
		positionsSummary: React.PropTypes.object
	},

	render: function() {
		var p = this.props;
		return (
			<main className="page positions">
				<SiteHeader { ...p.siteHeader } />

				<header className="page-header">
					<span className="big-line">
						{ p.positionsSummary.numPositions.minimized }
						&nbsp; Positions worth
						&nbsp; <ValueDenomination { ...p.positionsSummary.totalValue } />
						&nbsp; (<ValueDenomination { ...p.positionsSummary.gainPercent } />)
					</span>
				</header>

				<Positions
					className="page-content positions-content"
					positions={ p.positions }/>
			</main>
		);
	}
});