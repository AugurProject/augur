import rawSelectors from 'src/selectors-raw';

const accum = {};

Object.keys(rawSelectors).forEach(selectorKey =>
 Object.defineProperty(accum,
    selectorKey,
    { get: rawSelectors[selectorKey], enumerable: true }
));

export default accum;

if (module.hot) {
  module.hot.accept();

  module.hot.accept('./selectors-raw', () => {
    const hotSelectors = require('src/selectors-raw');

    module.exports = {};

    Object.keys(hotSelectors).forEach(selectorKey =>
      Object.defineProperty(module.exports,
        selectorKey,
        { get: hotSelectors[selectorKey], enumerable: true }
    ));
  });
}
