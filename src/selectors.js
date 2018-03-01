// NOTE -- no longer used, leaving temporarily for historical ref

const rawSelectors = require('src/selectors-raw').default

module.exports = {}

Object.keys(rawSelectors).forEach(selectorKey =>
  Object.defineProperty(
    module.exports,
    selectorKey,
    { get: rawSelectors[selectorKey], enumerable: true },
  ))

// if (module.hot) {
//   module.hot.accept('./selectors-raw', () => {
//     const hotSelectors = require('src/selectors-raw').default;
//
//     module.exports = {};
//
//     Object.keys(hotSelectors).forEach(selectorKey =>
//       Object.defineProperty(module.exports,
//         selectorKey,
//         { get: hotSelectors[selectorKey], enumerable: true }
//     ));
//   });
// }
