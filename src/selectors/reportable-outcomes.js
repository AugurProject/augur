import { BINARY, CATEGORICAL } from '../../src/modules/markets/constants/market-types';

const reportableOutcomes = (type, outcomes) => {
	switch(type) {
		case BINARY:
			return [
				{
					id: '1',
					name: 'No'
				},
				{
					id: '2',
					name: 'Yes'
				}
			];
		case CATEGORICAL:
			return outcomes;
		default:
			return [];
	}
};

export default reportableOutcomes;