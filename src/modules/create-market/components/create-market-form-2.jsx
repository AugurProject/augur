import React, { PropTypes } from 'react';
import { CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import Form2Categorical from './create-market-form-2-categorical';
import Form2Scalar from './create-market-form-2-scalar';
import FormButtons from '../../create-market/components/create-market-form-buttons';
import Input from '../../common/components/input';
import { Calendar, DateField, TransitionView } from 'react-date-picker';

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
					onChange={(value) => p.onValuesUpdated({ description: value })}
				/>
				{p.errors.description &&
					<span className="error-message">{p.errors.description}</span>
				}
			</div>

			{typeSpecific}

			<div className="end-date">
				<h4>What&apos;s the end date for your question?</h4>

				<DateField
					forceValidDate
					expanded={true}
					minDate={new Date()}
					dateFormat="YYYY/MM/DD hh:mm:ss a"
					date={p.endDate}
					highlightWeekends={false}
					onChange={(dateText, dateMoment) =>
						p.onValuesUpdated({ endDate: new Date(dateText) })}
				>
					<TransitionView>
						<Calendar
							style={{padding: 10}}
							weekNumbers={false}
							highlightWeekends={false}
							showClock
						/>
					</TransitionView>
				</DateField>
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

CreateMarketForm2.propTypes = {
	type: PropTypes.string,
	description: PropTypes.string,
	endDate: PropTypes.object,
	descriptionPlaceholder: PropTypes.string,
	descriptionMaxLength: PropTypes.number,
	minEndDate: PropTypes.object,
	isValid: PropTypes.bool,
	errors: PropTypes.object,
	onValuesUpdated: PropTypes.func
};

export default CreateMarketForm2;
// 	expanded={true}
