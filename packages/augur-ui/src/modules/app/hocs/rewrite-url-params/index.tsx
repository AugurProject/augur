import React from "react";
import parseQuery from "modules/routes/helpers/parse-query";
import { createPath } from "history";
import { RouteComponentProps } from "react-router-dom";

import makeQuery from "modules/routes/helpers/make-query";

export const RewriteUrlParams = (windowRef: Window) => (BaseCmp: React.ComponentType) => {
  const WrapperCmp: React.FC<RouteComponentProps<{}>> = props => {
    const { location } = props;
    const searchValues = parseQuery(location.search);
    const {
      ethereum_node_http,
      ethereum_node_ws,
      sdk_endpoint,
      ...remainingSearchValues
    } = searchValues;
    if (ethereum_node_http || ethereum_node_ws || sdk_endpoint) {
      const path = createPath({
        ...location,
        search: makeQuery(remainingSearchValues)
      });
      const paramsToMove = { ethereum_node_http, ethereum_node_ws, sdk_endpoint };
      // filter out the undefined paramsToMove key/values
      Object.keys(paramsToMove).forEach(
        key => !paramsToMove[key] && delete paramsToMove[key]
      );

      windowRef.location.href = createPath({
        pathname: windowRef.location.origin,
        search: makeQuery(paramsToMove),
        hash: path
      });
    }

    // Discover params added to window location and pass to wrapped component.
    const parsedParams = parseQuery(windowRef.location.search);
    const windowParams = {
      ethereumNodeHttp: parsedParams.ethereum_node_http,
      ethereumNodeWs: parsedParams.ethereum_node_ws,
      sdkEndpoint: parsedParams.sdk_endpoint
    };
    // filter out the undefined paramsToMove key/values
    Object.keys(windowParams).forEach(
      key => !windowParams[key] && delete windowParams[key]
    );
    return <BaseCmp {...props} {...windowParams} />;
  };

  return WrapperCmp;
};
