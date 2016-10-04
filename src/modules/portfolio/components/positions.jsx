import React from 'react';
import Positions from '../../../modules/my-positions/components/my-positions';
import PositionsMarketOverview from '../../my-positions/components/my-positions-market-overview';
import Link from '../../link/components/link';

const PortfolioPositions = p => (
	<div className="positions-content" >
		{!!p.markets && !!p.markets.length && p.markets.map(market => (
			<div key={market.id} className="positions-container" >
				<Link href={market.marketLink.href} onClick={market.marketLink.onClick} >
					<PositionsMarketOverview
						description={market.description}
						{...market.myPositionsSummary}
					/>
				</Link>
				{!!market.myPositionOutcomes && !!market.myPositionOutcomes.length &&
					<Positions
						className="page-content positions-content"
						market={market}
						marketLink={market.marketLink}
					/>
				}
			</div>
		))}
	</div>
);

// TODO -- Prop Validations
// PortfolioPositions.propTypes = {
// 	markets: React.PropTypes.array.isRequired
// };

export default PortfolioPositions;
