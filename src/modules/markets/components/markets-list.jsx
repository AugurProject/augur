import React from 'react';
import MarketPreview from '../../market/components/market-preview';
import MarketsPagination from '../../markets/components/markets-pagination';

const MarketsList = p => (
	<article className="markets-list">
		{(p.markets || []).map(market =>
			<MarketPreview
				key={market.id}
				{...market}
			/>
		)}

		{!!p.pagination && !!p.pagination.numUnpaginated &&
			<MarketsPagination pagination={p.pagination} />
		}
	</article>
);

// TODO -- Prop Validations
// MarketsList.propTypes = {
// 	markets: PropTypes.array,
// 	pagination: PropTypes.object
// };

export default MarketsList;
