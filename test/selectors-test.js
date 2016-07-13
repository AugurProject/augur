import selectors from '../src/selectors';
import assertions from '../src/assertions';

Object.keys(selectors).forEach(selectorKey => {
	console.log('-->', selectorKey);
	assertions[selectorKey](selectors[selectorKey]);
});
