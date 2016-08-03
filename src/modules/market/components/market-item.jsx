import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';
import Basics from '../../market/components/basics';
import Outcomes from '../../market/components/outcomes';
import Link from '../../link/components/link';
import Advanced from '../../market/components/advanced';

export default class MarketItem extends Component {
	static propTypes = {
		description: PropTypes.string,
		outcomes: PropTypes.array,
		isOpen: PropTypes.bool,
		isFavorite: PropTypes.bool,
		isPendingReport: PropTypes.bool,
		endDate: PropTypes.object,
		tradingFeePercent: PropTypes.object,
		volume: PropTypes.object,
		tags: PropTypes.array,
		marketLink: PropTypes.object,
		onClickToggleFavorite: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = shouldComponentUpdatePure;
	}

	render() {
		const p = this.props;
		const advancedParamsArrow = !!p.showAdvancedMarketParams ? '▲' : '▼';

		return (
			<article className="market-item">
				<div className="basics-container">
					<Basics {...p} />

					{!!p.creatingMarket &&
						<div className="advanced-market-params" >
							<h6 className="horizontal-divider" onClick={() => { p.onValuesUpdated({ showAdvancedMarketParams: !p.showAdvancedMarketParams }); }}><span>{advancedParamsArrow}</span> Advanced <span>{advancedParamsArrow}</span></h6>
							<div className={classnames({ displayNone: !p.showAdvancedMarketParams })}>
								<Advanced {...p} />
							</div>
						</div>
					}

					{!!p.marketLink &&
						<div className="buttons">
							<Link {...p.marketLink} className={classnames('button', p.marketLink.className)}>{p.marketLink.text}</Link>
						</div>
					}
				</div>

				{p.outcomes &&
					<Outcomes outcomes={p.outcomes} />
				}

				{p.onClickToggleFavorite &&
					<button
						className={classnames('button', 'favorite-button', { on: p.isFavorite })}
						onClick={p.onClickToggleFavorite}
					>
						&#xf005;
					</button>
				}
			</article>
		);
	}
}
