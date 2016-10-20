import React, { PropTypes } from 'react';
import Form1 from './create-market-form-1';
import Form2 from './create-market-form-2';
import Form3 from './create-market-form-3';
import Form4 from './create-market-form-4';
import Form5 from './create-market-form-5';

const CreateMarketForm = (p) => {
	let form;

	switch (p.step) {
		case 1:
		default:
			form = <Form1 {...p} />;
			break;
		case 2:
			form = <Form2 {...p} />;
			break;
		case 3:
			form = <Form3 {...p} />;
			break;
		case 4:
			form = <Form4 {...p} />;
			break;
		case 5:
			form = <Form5 {...p} />;
			break;
	}

	return (
		<section className={p.className}>
			{form}
		</section>
	);
};

CreateMarketForm.propTypes = {
	className: PropTypes.string,
	step: PropTypes.number
};

export default CreateMarketForm;
