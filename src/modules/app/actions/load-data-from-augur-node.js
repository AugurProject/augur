import { stringify } from 'query-string';
import logError from 'utils/log-error';

const loadDataFromAugurNode = (augurNodeUrl, restApiEndpoint, queryObject, callback = logError) => {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      try {
        callback(null, JSON.parse(xhttp.responseText));
      } catch (exc) {
        callback(exc);
      }
    }
  };
  xhttp.open('GET', `${augurNodeUrl}/${restApiEndpoint}?${stringify(queryObject)}`, true);
  xhttp.send();
};

export default loadDataFromAugurNode;
