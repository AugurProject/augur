import { assert } from 'chai';

export default function (settings) {
	assert.isDefined(settings, `settings isn't defined`);
	assert.isObject(settings, `settings isn't an object`);

	// TODO -- needs to be fleshed out
}
