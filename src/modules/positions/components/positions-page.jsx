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
						{ !!p.positionsSummary && !!p.positionsSummary.numPositions &&
							<ValueDenomination { ...p.positionsSummary.numPositions } />
						}

						{ !!p.positionsSummary && p.positionsSummary.totalValue &&
							<ValueDenomination { ...p.positionsSummary.totalValue } />
						}

						{ !!p.positionsSummary && p.positionsSummary.gainPercent &&
							<span>
							(<ValueDenomination
								{ ...p.positionsSummary.gainPercent }
								formatted={ p.positionsSummary.gainPercent.formatted } />)
							</span>
						}
					</span>
				</header>

				{ !!p.positions && !!p.positions.length &&
					<Positions
						className="page-content positions-content"
						positions={ p.positions }/>
				}
			</main>
		);
	}
});