import React from "react";
import classNames from "classnames";

import {
  LinearPropertyLabel,
  PendingLabel,
  PositionTypeLabel,
  ValueLabel
} from "modules/common-elements/labels";
import ToggleRow from "modules/portfolio/components/common/rows/toggle-row";
import { Order } from "modules/portfolio/types";
import { CancelTextButton } from "modules/common-elements/buttons";
import MarketLink from "modules/market/components/market-link/market-link";
import getValue from "utils/get-value";

import Styles from "modules/portfolio/components/common/rows/open-order.styles";

export interface OpenOrderProps {
  openOrder: Order;
  isSingle?: Boolean;
  extendedView?: Boolean;
}

const OpenOrder = (props: OpenOrderProps) => {
  const { openOrder, isSingle, extendedView } = props;

  if (!openOrder) {
    return null;
  }

  const tokensEscrowed = getValue(openOrder, "tokensEscrowed");
  const sharesEscrowed = getValue(openOrder, "sharesEscrowed");
  const creationTime = getValue(openOrder, "creationTime.formattedShort");
  const avgPrice = getValue(openOrder, "avgPrice");
  const unmatchedShares = getValue(openOrder, "unmatchedShares");

  const rowContent = (
    <ul
      className={classNames(Styles.Order, {
        [Styles.Order__row]: !isSingle || extendedView,
        [Styles.Order__extendedView]: extendedView
      })}
    >
      <li>
        {openOrder.description || openOrder.name || openOrder.outcomeName}
      </li>
      <li>
        <PositionTypeLabel type={openOrder.type} />
        {(openOrder.pending || openOrder.pendingOrder) && (
          <span>
            <PendingLabel />
          </span>
        )}
      </li>
      <li>
        {openOrder.unmatchedShares && (
          <ValueLabel
            keyId={"openOrder-unmatchedShares-" + openOrder.id}
            value={unmatchedShares}
          />
        )}
      </li>
      <li>
        {openOrder.avgPrice && (
          <ValueLabel
            keyId={"openOrder-price-" + openOrder.id}
            value={avgPrice}
          />
        )}
      </li>
      {extendedView && (
        <li>
          <ValueLabel
            keyId={"openOrder-tokens-" + openOrder.id}
            value={tokensEscrowed}
          />
        </li>
      )}
      {extendedView && (
        <li>
          <ValueLabel
            keyId={"openOrder-shares-" + openOrder.id}
            value={sharesEscrowed}
          />
        </li>
      )}
      <li>
        {openOrder.cancelOrder && (
          <CancelTextButton
            disabled={openOrder.pending}
            action={e => {
              e.stopPropagation();
              openOrder.cancelOrder(openOrder);
            }}
            text="Cancel"
          />
        )}
        {(openOrder.pending || openOrder.pendingOrder) && (
          <span>
            <PendingLabel />
          </span>
        )}
      </li>
    </ul>
  );

  if (extendedView) {
    return (
      <div className={classNames(Styles.Order__single, Styles.Order__border)}>
        {rowContent}
      </div>
    );
  }

  return (
    <div
      className={classNames({
        [Styles.Order__parentSingle]: isSingle
      })}
    >
      <ToggleRow
        className={classNames({
          [Styles.Order__single]: isSingle,
          [Styles.Order__group]: !isSingle
        })}
        innerClassName={classNames({
          [Styles.Order__innerGroup]: !isSingle
        })}
        arrowClassName={Styles.Order__arrow}
        rowContent={rowContent}
        toggleContent={
          <div className={Styles.OpenOrder_infoContainer}>
            <div
              className={classNames(Styles.OpenOrder__info, {
                [Styles.OpenOrder__infoSingle]: isSingle
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
                <div className={Styles.OpenOrder__labels}>
                  <LinearPropertyLabel
                    label="Total Cost (ETH)"
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
                <div className={Styles.OpenOrder__timestamp}>
                  {creationTime}
                </div>
                {openOrder.cancelOrder &&
                  !openOrder.pending &&
                  !openOrder.pendingOrder && (
                    <CancelTextButton
                      disabled={openOrder.pending}
                      action={e => {
                        e.stopPropagation();
                        openOrder.cancelOrder(openOrder);
                      }}
                      text="Cancel"
                    />
                  )}
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default OpenOrder;
