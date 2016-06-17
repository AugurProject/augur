import React, { Component, PropTypes } from 'react';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';
import ValueDenomination from '../../common/components/value-denomination';

export default class Outcomes extends Component {
	static propTypes = {
		outcomes: PropTypes.array
	};
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = shouldComponentUpdatePure;
	}

	render() {
		const p = this.props;
		return (
			<div className="outcomes">
				{p.outcomes.map((outcome, i) => (
					<div key={outcome.id} className="outcome">
						{!!outcome.lastPricePercent &&
							<ValueDenomination
								className="outcome-price"
								{...outcome.lastPricePercent}
								formatted={outcome.lastPricePercent.rounded}
								formattedValue={outcome.lastPricePercent.roundedValue}
							/>
						}
						<span className="outcome-name">{outcome.name}</span>
					</div>
				))}
			</div>
		);
	}
}
