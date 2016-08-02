import React from 'react';

const PortfolioMarkets = (p) => (
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
			<tbody key={id} >
				<tr className="cells-bordered solid dark">
					<th className="cell-left-aligned">{market.description}</th>
					<td>{market.endDate.formatted}</td>
					<td>{market.fees.full}</td>
					<td>{market.volume.formatted}</td>
					<td>{market.numberOfTrades.formatted}</td>
					<td>{market.averageTradeSize.full}</td>
					<td>{market.openVolume.formatted}</td>
				</tr>
			</tbody>
		))}
	</table>
);

PortfolioMarkets.propTypes = {
	markets: React.PropTypes.array.isRequired
};

export default PortfolioMarkets;
