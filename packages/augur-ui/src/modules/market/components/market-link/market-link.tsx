import React from "react";
import { Link } from "react-router-dom";

import makePath from "modules/routes/helpers/make-path";
import makeQuery from "modules/routes/helpers/make-query";

import {
  TYPE_REPORT,
  TYPE_DISPUTE,
  TYPE_MIGRATE_REP,
  HEADER_TYPE
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
  headerType?: string;
}

const MarketLink: React.FC<MarketLinkProps> = ({ linkType, className, id, outcomeId, children, headerType }) => {
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

  const linkOrNot = id ? (
    <Link
      data-testid={'link-' + id}
      to={{
        pathname: path,
        search: makeQuery(queryLink),
      }}
    >
      {children}
    </Link>
  ) : (
    children
  );

  switch (headerType) {
    case HEADER_TYPE.H1:
      return (
        <h1 className={className}>
          {linkOrNot}
        </h1>
      );
    case HEADER_TYPE.H2:
      return (
        <h2 className={className}>
          {linkOrNot}
        </h2>
      );
    case HEADER_TYPE.H3:
      return (
        <h3 className={className}>
          {linkOrNot}
        </h3>
      );
    default:
      return (
        <span className={className}>
          {linkOrNot}
        </span>
      );
  }
};

MarketLink.defaultProps = {
  linkType: null,
  className: ""
};

export default MarketLink;
