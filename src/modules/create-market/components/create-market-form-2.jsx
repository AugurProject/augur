import React from 'react';
import classnames from 'classnames';

import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';

import Form2Categorical from './create-market-form-2-categorical';
import Form2Scalar from './create-market-form-2-scalar';
import FormButtons from '../../create-market/components/create-market-form-buttons';

import Input from '../../common/components/input';
import DatePicker from 'react-date-picker';

module.exports = React.createClass({
	propTypes: {
		type: React.PropTypes.string,

		description: React.PropTypes.string,
		endDate: React.PropTypes.object,

		descriptionPlaceholder: React.PropTypes.string,
		descriptionMaxLength: React.PropTypes.number,

		minEndDate: React.PropTypes.object,

		isValid: React.PropTypes.bool,
		errors: React.PropTypes.object,

		onValuesUpdated: React.PropTypes.func
	},

	render: function() {
		var p = this.props,
			typeSpecific;

		switch (p.type) {
			case CATEGORICAL:
				typeSpecific = <Form2Categorical { ...p } />;
				break;

			case SCALAR:
				typeSpecific = <Form2Scalar { ...p } />;
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
						value={ p.description }
						placeholder={ p.descriptionPlaceholder }
						maxLength={ p.descriptionMaxLength }
						onChange={ (value) => p.onValuesUpdated({ description: value }) } />
					{ p.errors.description &&
						<span className="error-message">{ p.errors.description }</span>
					}
				</div>

				{ typeSpecific }

				<div className="end-date">
					<h4>What's the end date for your question?</h4>

					<DatePicker
						minDate={ new Date() }
						date={ p.endDate }
						hideFooter={ true }
						onChange={ (dateText, dateMoment) => p.onValuesUpdated({ endDate: dateMoment.toDate() }) } />

					{ p.errors.endDate &&
						<span className="error-message">{ p.errors.endDate }</span>
					}
				</div>

				<FormButtons
					disabled={ !p.isValid }
					onNext={ () => p.onValuesUpdated({ step: this.props.step + 1 }) }
					onPrev={ () => p.onValuesUpdated({ step: this.props.step - 1 }) } />
			</div>
		);
	}
});