import React, { PropTypes } from 'react';
import ValueDenomination from '../../common/components/value-denomination';

const Advanced = (props) => {
	const p = this.props;
	return (
		<section className="advanced">
			<ul className="properties">
				<li className="property fee">
					<span className="property-label">initial prices: </span>
					<span>
						{
							p.initialFairPrices.values.map((cV, i, arr) =>
								(<div className="distinct">
									<ValueDenomination className="property-value" { ...p.initialFairPrices.formatted[`${i}`] } />
								</div>)
							)
						}
					</span>
				</li>
				<li className="property">
					<span className="property-label">best starting quantity</span>
					<ValueDenomination className="property-value" { ...p.bestStartingQuantityFormatted } />
				</li>
				<li className="property">
					<span className="property-label">starting quantity</span>
					<ValueDenomination className="property-value" { ...p.startingQuantityFormatted } />
				</li>
				<li className="property">
					<span className="property-label">price width</span>
					<ValueDenomination className="property-value" { ...p.priceWidthFormatted } />
				</li>
			</ul>
		</section>
	);
};

Advanced.propTypes = {
	initialFairPrices: PropTypes.object,
	bestStartingQuantityFormatted: PropTypes.any,
	startingQuantityFormatted: PropTypes.any,
	priceWidthFormatted: PropTypes.any
};

export default Advanced;
