import React from "react";
import { Link } from "react-router-dom";

import makePath from "modules/routes/helpers/make-path";
import makeQuery from "modules/routes/helpers/make-query";
import {
  MARKET,
  MARKET_ID_PARAM_NAME,
} from 'modules/constants';

interface MarketLinkProps {
  id: string;
  ammId?: string;
  children?: any;
}

export const MarketLink = ({ id, ammId, children }: MarketLinkProps) => {
  const idString = `${id}${ammId ? '-'+ammId : ''}`;
  return (
    <Link
      data-testid={`link-${idString}`}
      to={{
        pathname: makePath(MARKET),
        search: makeQuery({
          [MARKET_ID_PARAM_NAME]: idString
        }),
      }}
    >
      {children}
    </Link>
  );
};

export default MarketLink;