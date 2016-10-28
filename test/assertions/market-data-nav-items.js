import { assert } from 'chai';

export default function (marketDataNavItems) {
	assert.isDefined(marketDataNavItems, `marketDataNavItems isn't defined`);
	assert.isObject(marketDataNavItems, `marketDataNavItems isn't an object`);

	assert.isDefined(marketDataNavItems.selected, `marketDataNavItems.selected isn't defined`);
	assert.isString(marketDataNavItems.selected, `marketDataNavItems.selected isn't a string`);

	assert.isDefined(marketDataNavItems.navItems, `marketDataNavItems.navItems isn't defined`);
	assert.isObject(marketDataNavItems.navItems, `marketDataNavItems.navItems isn't an object`);

	const navItems = marketDataNavItems.navItems;

	Object.keys(navItems).forEach(navItem => {
		assert.isDefined(navItems[navItem].label, `marketDataNavItems.navItem.label isn't defined`);
		assert.isString(navItems[navItem].label, `marketDataNavItems.navItem.label isn't a string`);

		assert.isDefined(navItems[navItem].onClick, `marketDataNavItems.navItem.onClick isn't defined`);
		assert.isFunction(navItems[navItem].onClick, `marketDataNavItems.navItem.onClick isn't a function`);
	});
}
