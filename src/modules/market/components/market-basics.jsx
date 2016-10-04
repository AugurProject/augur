import React from 'react';
import classnames from 'classnames';

import ValueDenomination from '../../common/components/value-denomination';
import ValueDate from '../../common/components/value-date';

const MarketBasics = p => (
	<article className="market-basics">
		<div className="market-basics-header">
			<div className="market-basics-header-group-1">
				{!!p.tags && !!p.tags.length &&
					<ul className="tags">
						{p.tags.map((tag, i) => (
							<li key={i} className={classnames('tag', { link: !!tag.name })} ><button className="button-unstyled" onClick={tag.onClick && tag.onClick}>{tag.name ? tag.name : tag}</button></li>
						))}
					</ul>
				}
			</div>
			<div className="market-basics-header-group-2">
				{p.onClickToggleFavorite &&
					<button
						className={classnames('button', 'favorite-button', { on: p.isFavorite })}
						onClick={p.onClickToggleFavorite}
					>
						&#xf005;
					</button>
				}

				{p.isUpdaterVisible &&
					<div className="updater">
						Market data loaded {p.marketDataAge.lastUpdatedBefore}
						<button
							className="button"
							disabled={p.marketDataAge.isMarketDataLoading}
							title={p.marketDataAge.isMarketDataLoading ? 'Loading' : 'Reload market data'}
							onClick={() => p.updateData(p.id)}
						>
							Reload
						</button>
					</div>
				}
			</div>
		</div>

		<span className="market-description" title={p.description}>{p.description}</span>

		<ul className="market-properties">
			{!!p.endDate &&
				<li className="property end-date" title={`${p.endDateLabel}: ${p.endDate.full}`}>
					<span className="property-label">{p.endDateLabel}:</span>
					<ValueDate className="property-value" {...p.endDate} />
				</li>
			}
			<li className="property fee" title={`${p.makerFeePercent.full} discounted fee for placing bids or asks on the books`}>
				<span className="property-label">Maker Fee:</span>
				<ValueDenomination className="property-value" {...p.makerFeePercent} />
			</li>
			<li className="property fee" title={`${p.takerFeePercent.full} fee for taking bids or asks from the books`}>
				<span className="property-label">Taker Fee:</span>
				<ValueDenomination className="property-value" {...p.takerFeePercent} />
			</li>
			<li className="property volume" title={`${p.volume.rounded} total ${p.volume.denomination} traded`}>
				<span className="property-label">Volume:</span>
				<ValueDenomination className="property-value" {...p.volume} formatted={p.volume.rounded} />
			</li>
		</ul>
	</article>
);

// TODO -- Prop Validations
// MarketBasics.propTypes = {
// 	description: PropTypes.string,
// 	endDate: PropTypes.object,
// 	makerFeePercent: PropTypes.object,
// 	takerFeePercent: PropTypes.object,
// 	volume: PropTypes.object,
// 	tags: PropTypes.array,
// 	lastUpdatedBefore: PropTypes.string,
// 	updateData: PropTypes.func,
// 	isMarketDataLoading: PropTypes.bool,
// 	updateIntervalSecs: PropTypes.number,
// 	isUpdaterVisible: PropTypes.bool,
// 	marketDataAge: React.PropTypes.shape({
// 		lastUpdatedBefore: PropTypes.string.isRequired,
// 		isMarketDataLoading: PropTypes.bool.isRequired
// 	})
// };

export default MarketBasics;
