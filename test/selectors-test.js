import selectors from '../src/selectors';
import assertions from '../src/assertions';

Object.keys(selectors).forEach(selectorKey => {
	console.log('-->', selectorKey);
	if (typeof assertions[selectorKey] !== 'function') {
		throw new Error(`missing assertion ${selectorKey}`)
	}
	assertions[selectorKey](selectors[selectorKey]);
});