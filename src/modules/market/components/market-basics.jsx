import React from 'react';
import ReactTooltip from 'react-tooltip';
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
							<li key={i} className={classnames('tag', { link: !!tag.name })} >
								<button
									className="unstyled"
									onClick={tag.onClick && tag.onClick}
								>
									{tag.name ? tag.name : tag}
								</button>
							</li>
						))}
					</ul>
				}
			</div>
			<div className="market-basics-header-group-2">
				{p.loginAccount && p.loginAccount.id && p.onClickToggleFavorite &&
					<button
						className={classnames('button unstyled favorite-button', { on: p.isFavorite })}
						onClick={p.onClickToggleFavorite}
					>
						{p.isFavorite ? <i></i> : <i></i>}
					</button>
				}

				{p.isUpdaterVisible &&
					<div className="updater">
						Market data loaded {p.marketDataAge.lastUpdatedBefore}
						<button
							className="button"
							disabled={p.marketDataAge.isMarketDataLoading}
							data-tip={p.marketDataAge.isMarketDataLoading ? 'Loading' : 'Reload market data'}
							onClick={() => p.updateData(p.id)}
						>
							Reload
						</button>
					</div>
				}
			</div>
		</div>

		<span className="market-description">{p.description}</span>

		<ul className="market-properties">
			{!!p.endDate &&
				<li className="property end-date">
					<a
						data-tip
						data-for={`${p.id}-end-date-tooltip`}
						data-event="click focus"
					>
						<span className="property-label">{p.endDateLabel}:</span>
						<ValueDate className="property-value" {...p.endDate} />
					</a>
					<ReactTooltip
						id={`${p.id}-end-date-tooltip`}
						type="light"
						effect="solid"
						place="top"
						globalEventOff="click"
					>
						<span className="tooltip-text">
							The outcome of this event will be known on or before {p.endDate.full}.
						</span>
					</ReactTooltip>
				</li>
			}
			<li className="property fee">
				<a
					data-tip
					data-for={`${p.id}-maker-fee-tooltip`}
					data-event="click focus"
				>
					<span className="property-label">Maker Fee:</span>
					<ValueDenomination className="property-value" {...p.makerFeePercent} />
				</a>
				<ReactTooltip
					id={`${p.id}-maker-fee-tooltip`}
					type="light"
					effect="solid"
					place="top"
					globalEventOff="click"
				>
					<span className="tooltip-text">
						{p.makerFeePercent.full} discounted fee for placing bids or asks on the books
					</span>
				</ReactTooltip>
			</li>
			<li className="property fee">
				<a
					data-tip
					data-for={`${p.id}-taker-fee-tooltip`}
					data-event="click focus"
				>
					<span className="property-label">Taker Fee:</span>
					<ValueDenomination className="property-value" {...p.takerFeePercent} />
				</a>
				<ReactTooltip
					id={`${p.id}-taker-fee-tooltip`}
					type="light"
					effect="solid"
					place="top"
					globalEventOff="click"
				>
					<span className="tooltip-text">
						{p.takerFeePercent.full} fee for taking bids or asks from the books
					</span>
				</ReactTooltip>
			</li>
			<li className="property volume">
				<a
					data-tip
					data-for={`${p.id}-volume-tooltip`}
					data-event="click focus"
				>
					<span className="property-label">Volume:</span>
					<ValueDenomination className="property-value" {...p.volume} formatted={p.volume.rounded} />
				</a>
				<ReactTooltip
					id={`${p.id}-volume-tooltip`}
					type="light"
					effect="solid"
					place="top"
					globalEventOff="click"
				>
					<span className="tooltip-text">
						{p.volume.fullPrecision || p.volume.formatted} total {p.volume.denomination} traded
					</span>
				</ReactTooltip>
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
