import parseQuery from "src/modules/routes/helpers/parse-query";
import { createPath } from "history";
import makeQuery from "src/modules/routes/helpers/make-query";
import { isEmpty } from "lodash";

export const editEndpointParams = (
  windowRef,
  { augurNode, ethereumNodeHTTP, ethereumNodeWS }
) => {
  const existingParams = parseQuery(windowRef.location.search);
  const paramsToModify = {};

  if (augurNode && existingParams.augur_node !== augurNode) {
    paramsToModify.augur_node = augurNode;
  }
  if (
    ethereumNodeHTTP &&
    existingParams.ethereum_node_http !== ethereumNodeHTTP
  ) {
    paramsToModify.ethereum_node_http = ethereumNodeHTTP;
  }
  if (ethereumNodeWS && existingParams.ethereum_node_ws !== ethereumNodeWS) {
    paramsToModify.ethereum_node_ws = ethereumNodeWS;
  }

  if (!isEmpty(paramsToModify)) {
    windowRef.location.href = createPath({
      pathname: windowRef.location.origin,
      search: makeQuery({
        ...existingParams,
        ...paramsToModify
      }),
      hash: windowRef.location.hash
    });
  } else {
    windowRef.location.reload();
  }
};
