import React from 'react';
import classnames from 'classnames';

import ValueDenomination from '../../common/components/value-denomination';

module.exports = React.createClass({
	propTypes: {
		description: React.PropTypes.string,

		endBlock: React.PropTypes.number,
		matured: React.PropTypes.bool,

		endDate: React.PropTypes.object,
		tradingFeePercent: React.PropTypes.object,
		volume: React.PropTypes.object,

		tags: React.PropTypes.array
	},

	render: function() {
		var p = this.props;
		return (
			<div className="basics">
				<span className="description">{ p.description }</span>

				{ !!p.tags && !!p.tags.length &&
					<ul className="tags">
						{ p.tags.map(tag => (
							<li key={ tag } className="tag">{ tag }</li>
						))}
					</ul>
				}

				<ul className="properties">
					{ !!p.endDate &&
						<li className="property end-date">
							<span className="property-label">{ (p.endBlock != null && p.matured) ? 'ended': 'ends' }</span>
							<ValueDenomination className="property-value" { ...p.endDate } />
						</li>
					}
					<li className="property fee">
						<span className="property-label">fee</span>
						<ValueDenomination className="property-value" { ...p.tradingFeePercent } />
					</li>
					<li className="property volume">
						<span className="property-label">volume</span>
						<ValueDenomination className="property-value" { ...p.volume } isRounded={ true } />
					</li>
				</ul>
			</div>
		);
	}
});