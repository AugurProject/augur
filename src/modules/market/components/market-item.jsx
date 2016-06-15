import React from 'react';
import classnames from 'classnames';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

import Basics from '../../market/components/basics';
import Outcomes from '../../market/components/outcomes';
import Link from '../../link/components/link';

import Advanced from '../../market/components/advanced';

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

		tags: React.PropTypes.array,

		marketLink: React.PropTypes.object,

		onClickToggleFavorite: React.PropTypes.func
	},

	shouldComponentUpdate: shouldComponentUpdatePure,

	render: function() {
		var p = this.props;

		const advancedParamsArrow = !!p.showAdvancedMarketParams ? '▲' : '▼';

		return (
			<article className="market-item">
				<div className="basics-container">
					<Basics { ...p } />

					{ !!p.creatingMarket &&
						<div className="advanced-market-params" >
							<h6 className="horizontal-divider" onClick={() => {p.onValuesUpdated({ showAdvancedMarketParams: !p.showAdvancedMarketParams })}}><span>{ advancedParamsArrow }</span> Advanced <span>{ advancedParamsArrow }</span></h6>
							<div className={ classnames({ 'displayNone': !!!p.showAdvancedMarketParams }) }>
								<Advanced { ...p } />
							</div>
						</div>
					}

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