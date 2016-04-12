import React from 'react';
import classnames from 'classnames';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

import Basics from '../../markets/components/basics';
import Outcomes from '../../markets/components/outcomes';
import Link from '../../link/components/link';

module.exports = React.createClass({
	propTypes: {
		description: React.PropTypes.string,

		outcomes: React.PropTypes.array,
		isFavorite: React.PropTypes.bool,
		isRecentlyExpired: React.PropTypes.bool,
		isPendingReport: React.PropTypes.bool,

		endDate: React.PropTypes.object,
		tradingFeePercent: React.PropTypes.object,
		volume: React.PropTypes.object,

		endBlock: React.PropTypes.number,
		matured: React.PropTypes.bool,

		tags: React.PropTypes.array,

		detailsLabel: React.PropTypes.string,
		detailsClassName: React.PropTypes.string,
		marketLink: React.PropTypes.object,

		onClickToggleFavorite: React.PropTypes.func
	},

	shouldComponentUpdate: shouldComponentUpdatePure,

	render: function() {
		var p = this.props;
		return (
			<article className="market">
				<div className="basics-container">
					<Basics { ...p } />

					{ !!p.marketLink && !!p.detailsLabel &&
						<div className="buttons">
							<Link className={ classnames('button', p.detailsClassName) } { ...p.marketLink }>{ p.detailsLabel }</Link>
						</div>
					}
				</div>

				{ p.outcomes &&
					<Outcomes outcomes={ p.outcomes } isRounded={ true } />
				}

				{ p.onClickToggleFavorite &&
					<button
						className={ classnames('button', 'favorite-button', { 'on': p.isFavorite }) }
						onClick={ p.onClickToggleFavorite }>&#xf005;</button>
				}
			</article>
		);
	}
});