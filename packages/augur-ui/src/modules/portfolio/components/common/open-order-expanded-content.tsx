import React, { useEffect } from "react";
import classNames from "classnames";

import getValue from "utils/get-value";
import { LinearPropertyLabel } from "modules/common/labels";
import { CancelTextButton } from "modules/common/buttons";
import MarketTitle from 'modules/market/containers/market-title';
import { Order } from "modules/portfolio/types";

import Styles from "modules/portfolio/components/common/expanded-content.styles.less";
import { augurSdk } from "services/augursdk";

export interface OpenOrderExpandedContentProps {
  openOrder: Order;
  isSingle?: boolean;
}

const OpenOrderExpandedContent = (props: OpenOrderExpandedContentProps) => {
  const { isSingle, openOrder } = props;

  const tokensEscrowed = getValue(openOrder, "tokensEscrowed");
  const sharesEscrowed = getValue(openOrder, "sharesEscrowed");
  const creationTime = getValue(openOrder, "creationTime.formattedLocalShortDateTimeNoTimezone");
  const expiry = getValue(openOrder, 'expiry.formattedLocalShortDateTimeNoTimezone');

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
              <MarketTitle id={openOrder.marketId} />
            ) : (
              openOrder.marketDescription
            )}
          </span>
        )}
        <div>
          <div>
            <LinearPropertyLabel
              label="Total Cost ($)"
              highlightFirst
              value={(tokensEscrowed && tokensEscrowed.full) || 0}
            />
            <LinearPropertyLabel
              label="Total Cost (Shares)"
              highlightFirst
              value={(sharesEscrowed && sharesEscrowed.formatted) || 0}
            />
            <LinearPropertyLabel
              highlightFirst
              label="Expiry"
              value={expiry}
            />
          </div>
          {openOrder.cancelOrder && (
            <CancelTextButton
              disabled={openOrder.pending}
              action={(e: Event) => {
                e.stopPropagation();
                console.log(openOrder.id);
                const augur = augurSdk.get();
                augur.cancelOrder(openOrder.id)
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
