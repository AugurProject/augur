import memoizerific from 'memoizerific';

export default function() {
	return selectSortOptions();
}

export const selectSortOptions = memoizerific(1)(function() {
    return [
    	{ label: 'Creation Date', value: 'creationSortOrder' },
    	{ label: 'End Date', value: 'endBlock' },
    	{ label: 'Volume', value: 'volume' },
    	{ label: 'Fee', value: 'tradingFeePercent' },
    	{ label: 'Description', value: 'description' }
    ];
});

