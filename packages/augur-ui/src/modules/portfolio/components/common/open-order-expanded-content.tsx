import React from "react";
import classNames from "classnames";

import getValue from "utils/get-value";
import { LinearPropertyLabel } from "modules/common/labels";
import { CancelTextButton } from "modules/common/buttons";
import MarketLink from "modules/market/components/market-link/market-link";
import { Order } from "modules/portfolio/types";

import Styles from "modules/portfolio/components/common/expanded-content.styles.less";

export interface OpenOrderExpandedContentProps {
  openOrder: Order;
  isSingle?: boolean;
}

const OpenOrderExpandedContent = (props: OpenOrderExpandedContentProps) => {
  const { isSingle, openOrder } = props;

  const tokensEscrowed = getValue(openOrder, "tokensEscrowed");
  const sharesEscrowed = getValue(openOrder, "sharesEscrowed");
  const creationTime = getValue(openOrder, "creationTime.formattedShort");

  return (
    <div className={Styles.OrderInfo}>
      <div
        className={classNames({
          [Styles.Single]: isSingle,
        })}
      >
        {isSingle && (
          <span>
            {openOrder.marketId ? (
              <MarketLink id={openOrder.marketId}>
                {openOrder.marketDescription}
              </MarketLink>
            ) : (
              openOrder.marketDescription
            )}
          </span>
        )}
        <div>
          <div>
            <LinearPropertyLabel
              label="Total Cost (DAI)"
              highlightFirst
              value={(tokensEscrowed && tokensEscrowed.formatted) || 0}
            />
            <LinearPropertyLabel
              label="Total Cost (Shares)"
              highlightFirst
              value={(sharesEscrowed && sharesEscrowed.formatted) || 0}
            />
            <LinearPropertyLabel
              highlightFirst
              label="Date"
              value={creationTime}
            />
          </div>
          <div>{creationTime}</div>
          {openOrder.cancelOrder && (
            <CancelTextButton
              disabled={openOrder.pending}
              action={(e: Event) => {
                e.stopPropagation();
                openOrder.cancelOrder(openOrder);
              }}
              text="Cancel"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenOrderExpandedContent;
