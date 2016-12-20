import rawSelectors from 'src/selectors-raw';

module.exports = {};

Object.keys(rawSelectors).forEach(selectorKey =>
 Object.defineProperty(module.exports,
		selectorKey,
		{ get: rawSelectors[selectorKey], enumerable: true }
));

if (module.hot) {
	module.hot.accept('./selectors-raw');
}
