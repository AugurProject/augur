import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';

const updateMultipleQueries = (filterTypesAndValues, location, history) => {
  let updatedSearch = parseQuery(location.search);

  filterTypesAndValues.forEach(({filterType, value}) => {
    if (value === '') {
      delete updatedSearch[filterType];
    } else {
      updatedSearch[filterType] = value;
    }
  });

  updatedSearch = makeQuery(updatedSearch);

  history.push({
    ...location,
    search: updatedSearch,
  });
};

export default updateMultipleQueries;
