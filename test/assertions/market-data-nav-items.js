import { assert } from 'chai';

export default function (marketDataNavItems) {
	assert.isDefined(marketDataNavItems, `marketDataNavItems isn't defined`);
	assert.isObject(marketDataNavItems, `marketDataNavItems isn't an object`);

	Object.keys(marketDataNavItems).forEach(navItem => {
		assert.isDefined(marketDataNavItems[navItem].label, `marketDataNavItems.navItem.label isn't defined`);
		assert.isString(marketDataNavItems[navItem].label, `marketDataNavItems.navItem.label isn't a string`);
	});
}
