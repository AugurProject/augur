import { assert } from 'chai';

export default function (selectedOutcome) {
	assert.isObject(selectedOutcome, `selectedOutcome isn't an object`);
	assert.isDefined(selectedOutcome.selectedOutcomeID, `selectedOutcome isn't defined`);
	assert.isFunction(selectedOutcome.updateSelectedOutcome, `updateSelectedOutcome isn't a function`);
	assert.isDefined(selectedOutcome.updateSelectedOutcome, `updateSelectedOutcome isn't defined`);
}

