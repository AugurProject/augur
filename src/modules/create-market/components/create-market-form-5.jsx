import React from 'react';
import MarketItem from '../../market/components/market-preview';
import FormButtons from '../../create-market/components/create-market-form-buttons';
import ValueDenomination from '../../common/components/value-denomination';

const CreateMarketForm5 = p => (
	<div className="step-5">
		<h1>Review and submit your new market</h1>
		<MarketItem {...p} />
		<ValueDenomination className="market-creation-fee" {...p.marketCreationFee} prefix="Market creation fee:" />
		<br />
		<ValueDenomination className="gas-fees" {...p.gasFees} prefix="Gas cost:" />
		<br />
		<ValueDenomination className="event-bond" {...p.eventBond} prefix="Bond (refundable):" />
		<br />
		<FormButtons
			nextLabel="submit new market"
			onNext={p.onSubmit}
			onPrev={() => p.onValuesUpdated({ step: p.step - 1 })}
		/>
	</div>
);

// TOOD -- Prop Validations
// CreateMarketForm5.propTypes = {
// 	marketCreationFee: PropTypes.object,
// 	gasCost: PropTypes.object,
// 	eventBond: PropTypes.object,
// 	onSubmit: PropTypes.func
// };

export default CreateMarketForm5;
