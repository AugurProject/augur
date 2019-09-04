import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';

const updateQuery = (filterType, value, location, history) => {
  let updatedSearch = parseQuery(location.search);
  if (value === '') {
    delete updatedSearch[filterType];
  } else {
    updatedSearch[filterType] = value;
  }

  updatedSearch = makeQuery(updatedSearch);

  history.push({
    ...location,
    search: updatedSearch,
  });
};

export default updateQuery;
