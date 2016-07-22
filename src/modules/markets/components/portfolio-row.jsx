import React from 'react';

const PortfolioMarketsRow = (p) => (
	<tbody>
		<tr className="cells-bordered solid dark">
			<th className="cell-left-aligned">{p.market.description}</th>
			<td>{p.market.endDate.formatted}</td>
			<td>{p.market.fees.full}</td>
			<td>{p.market.volume.formatted}</td>
			<td>{p.market.numberOfTrades.formatted}</td>
			<td>{p.market.averageTradeSize.full}</td>
			<td>{p.market.openVolume.formatted}</td>
		</tr>
	</tbody>
);

PortfolioMarketsRow.propTypes = {
	market: React.PropTypes.object
};

export default PortfolioMarketsRow;
