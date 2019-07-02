import React from "react";
import PropTypes from "prop-types";
import parseQuery from "modules/routes/helpers/parse-query";
import { createPath } from "history";

import makeQuery from "modules/routes/helpers/make-query";

export const RewriteUrlParams = windowRef => BaseCmp => {
  const WrapperCmp = props => {
    const { location } = props;
    const searchValues = parseQuery(location.search);
    const {
      ethereum_node_http,
      ethereum_node_ws,
      ...remainingSearchValues
    } = searchValues;
    if (ethereum_node_http || ethereum_node_ws) {
      const path = createPath({
        ...location,
        search: makeQuery(remainingSearchValues)
      });
      const paramsToMove = { ethereum_node_http, ethereum_node_ws };
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
      ethereumNodeWs: parsedParams.ethereum_node_ws
    };
    // filter out the undefined paramsToMove key/values
    Object.keys(windowParams).forEach(
      key => !windowParams[key] && delete windowParams[key]
    );
    return <BaseCmp {...props} {...windowParams} />;
  };

  WrapperCmp.propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
      createHref: PropTypes.func.isRequired
    }).isRequired
  };

  return WrapperCmp;
};
