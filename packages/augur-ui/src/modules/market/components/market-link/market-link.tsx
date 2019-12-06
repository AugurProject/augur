import React from "react";
import { Link } from "react-router-dom";

import makePath from "modules/routes/helpers/make-path";
import makeQuery from "modules/routes/helpers/make-query";

import {
  TYPE_REPORT,
  TYPE_DISPUTE,
  TYPE_MIGRATE_REP
} from "modules/common/constants";
import {
  MARKET,
  REPORTING,
  DISPUTING,
  MIGRATE_REP,
} from "modules/routes/constants/views";
import {
  MARKET_ID_PARAM_NAME,
  RETURN_PARAM_NAME,
  OUTCOME_ID_PARAM_NAME
} from "modules/routes/constants/param-names";

interface MarketLinkProps {
  id: string;
  linkType?: string;
  className?: string;
  outcomeId?: string;
}

const MarketLink: React.FC<MarketLinkProps> = ({ linkType, className, id, outcomeId, children }) => {
  let path;

  switch (linkType) {
    case TYPE_REPORT:
      path = makePath(REPORTING);
      break;
    case TYPE_DISPUTE:
      path = makePath(DISPUTING);
      break;
    case TYPE_MIGRATE_REP:
      path = makePath(MIGRATE_REP);
      break;
    default:
      path = makePath(MARKET);
  }

  let queryLink = {
    [MARKET_ID_PARAM_NAME]: id,
  };

  if (outcomeId) {
    queryLink[OUTCOME_ID_PARAM_NAME] = outcomeId;
  }

  if (linkType === TYPE_DISPUTE || linkType === TYPE_REPORT) {
    queryLink[RETURN_PARAM_NAME] = location.hash;
  }

  return (
    <span>
      {id ? (
        <Link
          data-testid={"link-" + id}
          className={className}
          to={{
            pathname: path,
            search: makeQuery(queryLink)
          }}
        >
          {children}
        </Link>
      ) : (
          children
        )}
    </span>
  );
};

MarketLink.defaultProps = {
  linkType: null,
  className: ""
};

export default MarketLink;
