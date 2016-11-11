import React from 'react';
import MarketPreview from 'modules/market/components/market-preview';
import MarketsPagination from 'modules/markets/components/markets-pagination';

import getValue from 'utils/get-value';

const MarketsList = p => (
	<article className="markets-list">
		{(p.markets || []).map((market) => {
			const selectedShareDenomination = getValue(p, `scalarShareDenomination.markets.${market.id}`);
			const shareDenominations = getValue(p, 'scalarShareDenomination.denominations');

			return (
				<MarketPreview
					key={market.id}
					loginAccount={p.loginAccount}
					{...market}
					selectedShareDenominatio={selectedShareDenomination}
					shareDenominations={shareDenominations}
				/>
			);
		})}
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
