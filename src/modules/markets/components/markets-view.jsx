import React from 'react';
import MarketsHeader from '../../markets/components/markets-header';
import MarketItem from '../../market/components/market-item';
import Link from '../../link/components/link';

const MarketsView = (p) => {
	console.log('p -- ', p);

	return (
		<section >
			<div className="view-header">
				<Link className="button make" {...p.createMarketLink} disabled={!p.loginAccount.id}>
					Make a Market
				</Link>
				<MarketsHeader {...p.marketsHeader} />
			</div>

			<div className="markets-list">
				{(p.markets || []).map(market =>
					<MarketItem
						key={market.id}
						{...market}
					/>
				)}

				{!!p.pagination && !!p.pagination.numUnpaginated &&
					<div className="pagination">
					{!!p.pagination && !!p.pagination.previousPageNum &&
						<span className="button-container prev" onClick={() => p.pagination.onUpdateSelectedPageNum(p.pagination.previousPageNum)}>
							<button className="button prev">&#xf104;</button>
						</span>
					}
						<span className="displaying">{`${p.pagination.startItemNum}- ${p.pagination.endItemNum} of ${p.pagination.numUnpaginated}`}</span>
					{!!p.pagination && !!p.pagination.nextPageNum &&
						<span className="button-container next" onClick={() => p.pagination.onUpdateSelectedPageNum(p.pagination.nextPageNum)}>
							<button className="button next">&#xf105;</button>
						</span>
					}
					</div>
				}
			</div>
		</section>
	);
};

MarketsView.propTypes = {
	className: React.PropTypes.string,
	marketsHeader: React.PropTypes.object,
	markets: React.PropTypes.array,
	pagination: React.PropTypes.object,
	sortOptions: React.PropTypes.array
};

export default MarketsView;
