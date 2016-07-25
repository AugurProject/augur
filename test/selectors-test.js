import selectors from '../src/selectors';
import assertions from '../src/assertions';

Object.defineProperty(selectors, 'render', {
	value: () => console.log('fake render'),
	enumerable: false
});

Object.keys(selectors).forEach(selectorKey => {
	console.log('-->', selectorKey);
	assertions[selectorKey](selectors[selectorKey]);
});
