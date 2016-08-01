import React from 'react';
import PortfolioMarketsRow from '../../../modules/markets/components/portfolio-row';

const PortfolioMarkets = (p) => {
	return (
		<table className="full-width-table">
			<thead>
				<tr className="cells-bordered solid dark">
					<th className="no-cell-border"></th>
					<th>Ends</th>
					<th>Fees Collected</th>
					<th>Volume</th>
					<th># Trades</th>
					<th>Avg Trade Size</th>
					<th>Open Volume</th>
				</tr>
			</thead>
			{p.markets.map((market, id) => (
				<PortfolioMarketsRow
					key={id}
					market={market}
				/>
			))}
		</table>
	);
};

PortfolioMarkets.propTypes = {
	markets: React.PropTypes.array.isRequired
};

export default PortfolioMarkets;
