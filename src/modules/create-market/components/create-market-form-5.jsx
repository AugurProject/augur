import React, { PropTypes } from 'react';
import MarketItem from '../../market/components/market-item';
import FormButtons from '../../create-market/components/create-market-form-buttons';

const CreateMarketForm5 = (p) => (
	<div className="step-5">
		<h1>Review and submit your new market</h1>
		<MarketItem {...p} />
		<FormButtons
			nextLabel="submit new market"
			onNext={p.onSubmit}
			onPrev={() => p.onValuesUpdated({ step: p.step - 1 })}
		/>
	</div>
);

CreateMarketForm5.propTypes = {
	onSubmit: PropTypes.func
};

export default CreateMarketForm5;
