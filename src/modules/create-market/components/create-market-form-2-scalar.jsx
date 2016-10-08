import React from 'react';
import Input from '../../common/components/input';

const CreateMarketForm2Scalar = p => (
	<div className="scalar">
		<h4>What are the minimum and maximum values allowed when answering?</h4>
		<p>
			The answer to your question must be a number that falls between the minimum and maximum
			values you&apos;re about to set.
		</p>

		<div className="scalar-num min">
			<label
				htmlFor="minimum-answer"
			>
				Minimum
			</label>
			<Input
				type="text"
				name="minimum-answer"
				value={p.scalarSmallNum}
				placeholder="Minimum answer"
				maxLength={6}
				onChange={value => p.onValuesUpdated({ scalarSmallNum: value })}
			/>

			{p.errors.scalarSmallNum &&
				<span className="error-message">{p.errors.scalarSmallNum}</span>
			}
		</div>

		<div className="scalar-num min">
			<label
				htmlFor="maximum-answer"
			>
				Maximum
			</label>
			<Input
				type="text"
				name="maximum-answer"
				value={p.scalarBigNum}
				placeholder="Maximum answer"
				maxLength={6}
				onChange={value => p.onValuesUpdated({ scalarBigNum: value })}
			/>

			{p.errors.scalarBigNum &&
				<span className="error-message">{p.errors.scalarBigNum}</span>
			}
		</div>
	</div>
);

// TOOD -- Prop Validations
// CreateMarketForm2Scalar.propTypes = {
// 	scalarSmallNum: PropTypes.string,
// 	scalarBigNum: PropTypes.string,
// 	onValuesUpdated: PropTypes.func
// };

export default CreateMarketForm2Scalar;
