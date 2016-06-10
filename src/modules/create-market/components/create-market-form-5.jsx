import React from 'react';

import MarketItem from '../../market/components/market-item';
import FormButtons from '../../create-market/components/create-market-form-buttons';

module.exports = React.createClass({
	propTypes: {
		onSubmit: React.PropTypes.func
	},

	render: function() {
		var p = this.props;
		
		return (
			<div className="step-5">
				<h1>Review and submit your new market</h1>

				<MarketItem { ...p } />

				<FormButtons
					nextLabel="submit new market"
					onNext={ p.onSubmit }
					onPrev={ () => p.onValuesUpdated({ step: this.props.step - 1 }) } />
			</div>
		);
	}
});