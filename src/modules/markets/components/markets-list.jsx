import React, { PropTypes } from 'react';
import MarketPreview from '../../market/components/market-preview';

const MarketsList = (p) => (
	<article className="markets-list">
		{(p.markets || []).map(market =>
			<MarketPreview
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
	</article>
);

MarketsList.propTypes = {
	markets: PropTypes.array,
	pagination: PropTypes.object
};

export default MarketsList;
