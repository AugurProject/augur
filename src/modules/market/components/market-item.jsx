import React from 'react';
import classnames from 'classnames';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

import Basics from '../../market/components/basics';
import Outcomes from '../../market/components/outcomes';
import Link from '../../link/components/link';

module.exports = React.createClass({
	propTypes: {
		description: React.PropTypes.string,

		outcomes: React.PropTypes.array,
		isOpen: React.PropTypes.bool,
		isFavorite: React.PropTypes.bool,
		isPendingReport: React.PropTypes.bool,

		endDate: React.PropTypes.object,
		tradingFeePercent: React.PropTypes.object,
		volume: React.PropTypes.object,

		endBlock: React.PropTypes.number,
		matured: React.PropTypes.bool,

		tags: React.PropTypes.array,

		marketLink: React.PropTypes.object,

		onClickToggleFavorite: React.PropTypes.func
	},

	shouldComponentUpdate: shouldComponentUpdatePure,

	render: function() {
		var p = this.props;
		return (
			<article className="market-item">
				<div className="basics-container">
					<Basics { ...p } />

					{ !!p.marketLink &&
						<div className="buttons">
							<Link { ...p.marketLink } className={ classnames('button', p.marketLink.className) }>{ p.marketLink.text }</Link>
						</div>
					}
				</div>

				{ p.outcomes &&
					<Outcomes outcomes={ p.outcomes } />
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