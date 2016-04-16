import React from 'react';
import classnames from 'classnames';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

import Positions from '../../positions/components/positions';
import PositionsSummary from '../../positions/components/positions-summary';

module.exports = React.createClass({
	propTypes: {
		positionsSummary: React.PropTypes.object,
		outcomes: React.PropTypes.array
	},

	shouldComponentUpdate: shouldComponentUpdatePure,

	render: function() {
		var p = this.props;
		return (
			<section key="positions" className="market-positions">
				<PositionsSummary { ...p.positionsSummary } className="market-section-header" />
				<Positions key="positions" outcomes={ p.outcomes } />
			</section>
		);
	}
});