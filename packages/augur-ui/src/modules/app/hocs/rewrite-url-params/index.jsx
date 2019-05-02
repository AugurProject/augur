import React from "react";
import PropTypes from "prop-types";
import parseQuery from "modules/routes/helpers/parse-query";
import {
  AUGUR_NODE_URL,
  ETHEREUM_NODE_HTTP,
  ETHEREUM_NODE_WS
} from "src/modules/common-elements/constants";

import { createPath } from "history";

import { camelCase, compose, isEmpty, mapKeys, omit, pick } from "lodash/fp";
import makeQuery from "src/modules/routes/helpers/make-query";

const keys = {
  AUGUR_NODE_URL,
  ETHEREUM_NODE_HTTP,
  ETHEREUM_NODE_WS
};

const valuesToGet = Object.values(keys);
const grabParams = pick(valuesToGet);

const grabAndCamelCaseWindowParams = compose(
  mapKeys(camelCase),
  grabParams,
  parseQuery
);

export const RewriteUrlParams = windowRef => BaseCmp => {
  const WrapperCmp = props => {
    const { location } = props;
    const searchValues = parseQuery(location.search);

    const paramsToMove = grabParams(searchValues);
    if (!isEmpty(paramsToMove)) {
      const remainingSearchValues = omit(valuesToGet, searchValues);
      const path = createPath({
        ...location,
        search: makeQuery(remainingSearchValues)
      });

      windowRef.location.href = createPath({
        pathname: windowRef.location.origin,
        search: makeQuery(paramsToMove),
        hash: path
      });
    }

    // Discover params added to window location and pass to wrapped component.
    const windowParams = grabAndCamelCaseWindowParams(
      windowRef.location.search
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
