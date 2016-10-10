import React, { Component } from 'react';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';
import Positions from '../../../modules/my-positions/components/my-positions';
import PositionsSummary from '../../../modules/my-positions/components/my-positions-summary';

export default class MarketPositions extends Component {
	// TODO -- Prop Validations
	// static propTypes = {
	// 	market: PropTypes.object
	// };

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = shouldComponentUpdatePure;
	}

	render() {
		const p = this.props;
		return (
			<section className="market-positions">
				{p.market.myPositionsSummary && p.market.myPositionsSummary.numPositions && p.market.myPositionsSummary.numPositions.value &&
					<PositionsSummary {...p.market.myPositionsSummary} className="market-section-header" />
				}
				<Positions market={p.market} />
			</section>
		);
	}
}
