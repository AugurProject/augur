import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import makePath from "modules/routes/helpers/make-path";
import makeQuery from "modules/routes/helpers/make-query";

import {
  TYPE_REPORT,
  TYPE_DISPUTE,
  TYPE_MIGRATE_REP
} from "modules/market/constants/link-types";
import {
  MARKET,
  REPORT,
  DISPUTE,
  MIGRATE_REP
} from "modules/routes/constants/views";
import {
  MARKET_ID_PARAM_NAME,
  RETURN_PARAM_NAME
} from "modules/routes/constants/param-names";

const MarketLink = p => {
  let path;

  switch (p.linkType) {
    case TYPE_REPORT:
      path = makePath(REPORT);
      break;
    case TYPE_DISPUTE:
      path = makePath(DISPUTE);
      break;
    case TYPE_MIGRATE_REP:
      path = makePath(MIGRATE_REP);
      break;
    default:
      path = makePath(MARKET);
  }

  const queryLink = {
    [MARKET_ID_PARAM_NAME]: p.id
  };

  if (p.linkType === TYPE_DISPUTE || p.linkType === TYPE_REPORT) {
    queryLink[RETURN_PARAM_NAME] = location.hash;
  }

  return (
    <span>
      {p.id ? (
        <Link
          data-testid={"link-" + p.id}
          className={p.className}
          to={{
            pathname: path,
            search: makeQuery(queryLink)
          }}
        >
          {p.children}
        </Link>
      ) : (
        p.children
      )}
    </span>
  );
};

MarketLink.propTypes = {
  id: PropTypes.string.isRequired,
  linkType: PropTypes.string,
  className: PropTypes.string,
  location: PropTypes.object
};

export default MarketLink;
