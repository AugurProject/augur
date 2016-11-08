import React from 'react';
import classnames from 'classnames';

import MarketProperties from 'modules/market/components/market-properties';
import Link from 'modules/link/components/link';

const MarketBasics = p => (
	<article className="market-basics">
		<div className="market-basics-header">
			<div className="market-basics-header-group-1">
				{!!p.tags && !!p.tags.length &&
					<ul className="tags">
						{p.tags.map((tag, i) => (
							<li key={i} className={classnames('tag', 'pointer', { link: !!tag.name })} >
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

		<Link
			{...p.marketLink}
			onClick={p.marketLink.onClick}
			className="market-description"
		>
			{p.description}
		</Link>

		<MarketProperties {...p} />
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
