import React, { PropTypes } from 'react';
import Form1 from 'modules/create-market/components/create-market-form-1';
import Form2 from 'modules/create-market/components/create-market-form-2';
import Form3 from 'modules/create-market/components/create-market-form-3';
import Form4 from 'modules/create-market/components/create-market-form-4';
import Form5 from 'modules/create-market/components/create-market-form-5';

import { SHARE } from 'modules/market/constants/share-denominations';

import getValue from 'utils/get-value';

const CreateMarketForm = (p) => {
	let form;

	const shareDenominations = getValue(p, 'scalarShareDenomination.denominations');

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
			form = (<Form5
				{...p}
				selectedShareDenomination={SHARE}
				shareDenominations={shareDenominations}
			/>);
			break;
	}

	return (
		<article className={p.className}>
			{form}
		</article>
	);
};

CreateMarketForm.propTypes = {
	className: PropTypes.string,
	step: PropTypes.number
};

export default CreateMarketForm;
