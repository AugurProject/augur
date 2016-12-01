import React from 'react';
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';

const CreateMarketForm1 = p => (
	<div className="step-1">
		<h1>Select the type of market you want to create</h1>
		<hr />
		<div className="market-types">
			<div className="market-type binary">
				<h4>A market with a YES or NO outcome</h4>
				<button className="button select" onClick={() => p.onValuesUpdated({ type: BINARY, step: 2 })}>
					Yes / No
				</button>
				<p>Ask a question that has a simple YES or NO answer</p>
			</div>
			<hr />
			<div className="market-type categorical">
				<h4>A market with a MULTIPLE CHOICE outcome</h4>
				<button className="button select" onClick={() => p.onValuesUpdated({ type: CATEGORICAL, step: 2 })}>
					Multiple Choice
				</button>
				<p>Ask a question and provide a set of multiple choice answers</p>
			</div>
			<hr />
			<div className="market-type scalar">
				<h4>A market with a NUMERIC outcome</h4>
				<button className="button select" onClick={() => p.onValuesUpdated({ type: SCALAR, step: 2 })}>
					Numeric
				</button>
				<p>Ask a question that has an answer within a range of numbers</p>
			</div>
		</div>
		<hr />
		<div className="important-message">
			<h4>Important:</h4>
			<p>
				There is a 30.00 ETH bond charged to your account when you create a new market. If the
				outcome of your market cannot be determined (and the market cannot be expired as a result)
				or if your market is ruled unethical, this bond will be forfeited. If your market is expired the
				bond will be returned to you in full.
			</p>
		</div>
	</div>
);

// TODO -- Prop Validations
// CreateMarketForm1.propTypes = {
// 	onValuesUpdated: PropTypes.func
// };

export default CreateMarketForm1;
