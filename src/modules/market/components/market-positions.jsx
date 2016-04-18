import React from 'react';
import classnames from 'classnames';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

import Positions from '../../positions/components/positions';
import PositionsSummary from '../../positions/components/positions-summary';

module.exports = React.createClass({
	propTypes: {
		positionsSummary: React.PropTypes.object,
		positionOutcomes: React.PropTypes.array
	},

	shouldComponentUpdate: shouldComponentUpdatePure,

	render: function() {
		var p = this.props;
		return (
			<section className="market-positions">
				<PositionsSummary { ...p.positionsSummary } className="market-section-header" />
				<Positions outcomes={ p.positionOutcomes } />
			</section>
		);
	}
});