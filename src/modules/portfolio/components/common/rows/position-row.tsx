import React from "react";
import classNames from "classnames";
import Media from "react-media";

import {
  LinearPropertyLabelMovement,
  PositionTypeLabel,
  MovementLabel,
  ValueLabel
} from "modules/common-elements/labels";
import ToggleRow from "modules/portfolio/components/common/rows/toggle-row";
import { Order } from "modules/portfolio/types";
import { SMALL_MOBILE } from "modules/common-elements/constants";

import Styles from "modules/portfolio/components/common/rows/open-order.styles";

export interface PositionRowProps {
  position: Order;
  isFirst: Boolean;
  showPercent: Boolean;
  extendedView?: Boolean;
}

const PositionRow = (props: PositionRowProps) => {
  const { position, isFirst, showPercent, extendedView } = props;

  const expandedContent = (
    <div className={Styles.Position_infoContainer}>
      <div className={Styles.Position__info}>
        <LinearPropertyLabelMovement
          highlightFirst
          showPercent
          showBrackets
          showPlusMinus
          showColors
          label="Total Returns"
          value={`${position.totalReturns.formatted}`}
          numberValue={`${position.totalPercent.roundedFormatted}`}
        />
        <LinearPropertyLabelMovement
          highlightFirst
          showPercent
          showBrackets
          showPlusMinus
          showColors
          label="Realized P/L"
          value={`${position.realizedNet.formatted}`}
          numberValue={`${position.realizedPercent.roundedFormatted}`}
        />
        <LinearPropertyLabelMovement
          highlightFirst
          showPercent
          showBrackets
          showPlusMinus
          showColors
          label="Unrealized P/L"
          value={`${position.unrealizedNet.formatted}`}
          numberValue={`${position.unrealizedPercent.roundedFormatted}`}
        />
      </div>
    </div>
  );

  const rowContent = (
    <ul
      className={classNames(Styles.Order, Styles.Position, {
        [Styles.Position__extended]: extendedView
      })}
    >
      <li>{position.outcomeName}</li>
      <li>
        <PositionTypeLabel type={position.type} />
      </li>
      <li>
        <ValueLabel value={position.quantity} />
      </li>
      <li>
        <ValueLabel value={position.purchasePrice} />
      </li>
      {!extendedView && (
        <li>
          <ValueLabel value={position.totalCost} />
        </li>
      )}
      {!extendedView && (
        <li>
          <ValueLabel value={position.totalValue} />
        </li>
      )}
      {!extendedView && (
        <li>
          <ValueLabel value={position.lastPrice} />
        </li>
      )}
      {!extendedView && (
        <li>
          {showPercent ? (
            <MovementLabel
              showPercent
              showBrackets
              showPlusMinus
              showColors
              size="medium"
              value={position.totalPercent.roundedFormatted}
            />
          ) : (
            position.totalReturns.formatted
          )}
        </li>
      )}
      {extendedView && <li>{position.unrealizedNet.formatted}</li>}
      {extendedView && <li>{position.realizedNet.formatted}</li>}
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
    <Media query={SMALL_MOBILE}>
      {matches =>
        matches ? (
          <div
            className={classNames(
              Styles.Order__single,
              Styles.Position__single
            )}
          >
            <div
              className={classNames(
                Styles.Position__innerSingle,
                Styles.Position__border
              )}
            >
              {rowContent}
            </div>
            {expandedContent}
          </div>
        ) : (
          <ToggleRow
            className={classNames(
              Styles.Order__single,
              Styles.Position__single
            )}
            innerClassName={classNames(Styles.Position__innerSingle, {
              [Styles.Position__border]: !isFirst
            })}
            arrowClassName={Styles.Position__arrow}
            rowContent={rowContent}
            toggleContent={expandedContent}
          />
        )
      }
    </Media>
  );
};

export default PositionRow;
