import selectors from '../src/selectors';
import assertions from '../src/assertions';

Object.keys(selectors).forEach(selectorKey => {
	const assertionKey = `assert${selectorKey.charAt(0).toUpperCase() + selectorKey.slice(1)}`;
	console.log('*-->', selectorKey, `(${assertionKey})`);
	assertions[assertionKey](selectors[selectorKey]);
});
