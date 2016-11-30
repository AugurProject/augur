import React from 'react';
import { CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';
import Form2Categorical from 'modules/create-market/components/create-market-form-2-categorical';
import Form2Scalar from 'modules/create-market/components/create-market-form-2-scalar';
import FormButtons from 'modules/create-market/components/create-market-form-buttons';
import Input from 'modules/common/components/input';
import DatePicker from 'modules/common/components/datepicker';

const CreateMarketForm2 = (p) => {
	let	typeSpecific;
	// const tomorrow = new Date();
	// tomorrow.setDate(tomorrow.getDate() + 1);
	switch (p.type) {
		case CATEGORICAL:
			typeSpecific = <Form2Categorical {...p} />;
			break;
		case SCALAR:
			typeSpecific = <Form2Scalar {...p} />;
			break;
		default:
			break;
	}

	return (
		<div className="step-2">
			<div className="description">
				<h1>
					What do you want to ask?
				</h1>
				<Input
					type="text"
					value={p.description}
					placeholder={p.descriptionPlaceholder}
					maxLength={p.descriptionMaxLength}
					onChange={value => p.onValuesUpdated({ description: value })}
				/>
				{p.errors.description &&
					<span className="error-message">{p.errors.description}</span>
				}
			</div>

			{typeSpecific}

			<div className="end-date">
				<h4>What&apos;s the end date for your question?</h4>

				<DatePicker endDate={p.endDate} onValuesUpdated={p.onValuesUpdated} />

				{p.errors.endDate &&
					<span className="error-message">{p.errors.endDate}</span>
				}
			</div>
			<FormButtons
				disabled={!p.isValid}
				onNext={() => p.onValuesUpdated({ step: p.step + 1 })}
				onPrev={() => p.onValuesUpdated({ step: p.step - 1 })}
			/>
		</div>
	);
};

// TODO -- Prop Validations
// CreateMarketForm2.propTypes = {
// 	type: PropTypes.string,
// 	description: PropTypes.string,
// 	endDate: PropTypes.object,
// 	descriptionPlaceholder: PropTypes.string,
// 	descriptionMaxLength: PropTypes.number,
// 	minEndDate: PropTypes.object,
// 	isValid: PropTypes.bool,
// 	errors: PropTypes.object,
// 	onValuesUpdated: PropTypes.func
// };

export default CreateMarketForm2;
// 	expanded={true}
