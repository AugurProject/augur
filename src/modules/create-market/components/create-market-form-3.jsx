import React from 'react';
import classnames from 'classnames';
import InputList from '../../common/components/input-list';
import FormButtons from '../../create-market/components/create-market-form-buttons';
import Input from '../../common/components/input';

const CreateMarketForm4 = p => (
	<div className="step-3">
		<h1>Additional market information</h1>
		<div className="expiry">
			<h4>What is the source of expiry information for your question?</h4>
			<span className="expiry-source-option">
				<input
					value={p.expirySourceTypes.generic}
					type="radio"
					checked={p.expirySource === p.expirySourceTypes.generic}
					onChange={() => p.onValuesUpdated({ expirySource: p.expirySourceTypes.generic })}
				/>
				<span>Outcome will be covered by local, national or international news media.</span>
			</span>
			<span className="expiry-source-option">
				<input
					value={p.expirySourceTypes.specific}
					type="radio"
					checked={p.expirySource === p.expirySourceTypes.specific}
					onChange={() => p.onValuesUpdated({ expirySource: p.expirySourceTypes.specific })}
				/>
				<span>Outcome will be detailed on a specific publicly available website:</span>
			</span>
			<div className={classnames('expiry-source-url', { displayNone: p.expirySource !== p.expirySourceTypes.specific })}>
				<Input
					type="text"
					value={p.expirySourceUrl}
					placeholder="http://www.boxofficemojo.com"
					onChange={value => p.onValuesUpdated({ expirySourceUrl: value })}
				/>
			</div>
			{(p.errors.expirySource || p.errors.expirySourceUrl) &&
				<span className="error-message">{p.errors.expirySource || p.errors.expirySourceUrl}</span>
			}
		</div>
		<div className="tags">
			<h4>Add some tags to your market (optional)</h4>
			<p>
				Up to three tags can be added to categorize your market. For example: politics, sports,
				entertainment or technology.
			</p>
			<InputList
				className="tags-list"
				list={p.tags}
				errors={p.errors && p.errors.tags}
				listMaxElements={p.tagsMaxNum}
				itemMaxLength={p.tagMaxLength}
				onChange={newTags => p.onValuesUpdated({ tags: newTags })}
			/>
		</div>

		<div className="details-text">
			<h4>Does your question need further explanation? (optional)</h4>
			<p>Your question: {p.description}</p>
			<Input
				className="details-text-input"
				value={p.detailsText}
				maxLength={500}
				placeholder="Optional: enter a more detailed description of your market."
				onChange={value => p.onValuesUpdated({ detailsText: value })}
			/>
		</div>

		<FormButtons
			disabled={!p.isValid}
			onNext={() => p.onValuesUpdated({ step: p.step + 1 })}
			onPrev={() => p.onValuesUpdated({ step: p.step - 1 })}
		/>
	</div>
);

// TODO -- Prop Validations
// CreateMarketForm4.propTypes = {
// 	expirySource: PropTypes.string,
// 	expirySourceUrl: PropTypes.string,
// 	expirySourceTypes: PropTypes.object,
// 	tags: PropTypes.array,
// 	tagsMaxNum: PropTypes.number,
// 	tagMaxLength: PropTypes.number,
// 	description: PropTypes.string,
// 	detailsText: PropTypes.string,
// 	isValid: PropTypes.bool,
// 	errors: PropTypes.object,
// 	onValuesUpdated: PropTypes.func
// };

export default CreateMarketForm4;
