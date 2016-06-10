import React from 'react';
import classnames from 'classnames';

import ValueDenomination from '../../common/components/value-denomination';

module.exports = React.createClass({
	propTypes: {
		description: React.PropTypes.string,

		endDate: React.PropTypes.object,
		tradingFeePercent: React.PropTypes.object,
		makerFee: React.PropTypes.object,
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

				<span className="description" title={ p.description }>{ p.description }</span>

				<ul className="properties">
					{ !!p.endDate &&
						<li className="property end-date">
							<span className="property-label">{ (p.endDate && p.endDate.value < new Date()) ? 'ended': 'ends' }</span>
							<ValueDenomination className="property-value" { ...p.endDate } />
						</li>
					}
					<li className="property fee">
						<span className="property-label">fee</span>
						<ValueDenomination className="property-value" { ...p.tradingFeePercent } />
					</li>
					<li className="property fee">
						<span className="property-label">maker fee</span>
						<ValueDenomination className="property-value" { ...p.makerFee } />
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