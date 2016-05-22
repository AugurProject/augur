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
			<section className="basics">
				{ !!p.tags && !!p.tags.length &&
					<ul className="tags">
						{ p.tags.map((tag, i) => (
							<li key={ i } className="tag" onClick={ tag.onClick }>{ tag.name }</li>
						))}
					</ul>
				}

				<span className="description">{ p.description }</span>

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
						<ValueDenomination className="property-value" { ...p.volume } formatted={ p.volume.rounded } />
					</li>
				</ul>
			</section>
		);
	}
});