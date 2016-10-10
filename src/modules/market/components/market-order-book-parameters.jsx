// NOTE -- This is no longer used, but leaving for reference until functionality is re-employed

import React from 'react';
import ValueDenomination from '../../common/components/value-denomination';

const OrderBookParameters = p => (
	<section className="advanced">
		<ul className="properties">
			<li className="property">
				<span className="property-label">initial liquidity</span>
				<ValueDenomination className="property-value" {...p.initialLiquidityFormatted} />
			</li>
			<li className="property fee">
				<span className="property-label">initial prices: </span>
				<span>
					{
						p.initialFairPrices.values.map((cV, i, arr) =>
							(<div key={`${cV}${i}`} className="distinct">
								<ValueDenomination className="property-value" {...p.initialFairPrices.formatted[`${i}`]} />
							</div>)
						)
					}
				</span>
			</li>
			<li className="property">
				<span className="property-label">best starting quantity</span>
				<ValueDenomination className="property-value" {...p.bestStartingQuantityFormatted} />
			</li>
			<li className="property">
				<span className="property-label">starting quantity</span>
				<ValueDenomination className="property-value" {...p.startingQuantityFormatted} />
			</li>
			<li className="property">
				<span className="property-label">price width</span>
				<ValueDenomination className="property-value" {...p.priceWidthFormatted} />
			</li>
		</ul>
	</section>
);

// TODO -- Prop Validations
// OrderBookParameters.propTypes = {
// 	initialFairPrices: PropTypes.object.isRequired,
// 	initialLiquidityFormatted: PropTypes.object.isRequired,
// 	bestStartingQuantityFormatted: PropTypes.object.isRequired,
// 	startingQuantityFormatted: PropTypes.object.isRequired,
// 	priceWidthFormatted: PropTypes.object.isRequired
// };

export default OrderBookParameters;
