import React from "react";
import classNames from "classnames";

import { LinearPropertyLabelMovement } from "modules/common/labels";
import { Order } from "modules/portfolio/types";

import Styles from "modules/portfolio/components/common/expanded-content.styles.less";

export interface PositionExpandedContentProps {
  position: Order;
  showExpandedToggle?: Boolean;
}

const PositionExpandedContent = (props: PositionExpandedContentProps) => {
  const { position, showExpandedToggle } = props;

  return (
    <div
      className={classNames(Styles.PositionInfo, {
        [Styles.BottomBorder]: showExpandedToggle
      })}
    >
      <div>
        <LinearPropertyLabelMovement
          highlightFirst
          showPercent
          showBrackets
          showPlusMinus
          useFull
          useValueLabel
          label="Total Returns"
          value={position.totalReturns}
          movementValue={position.totalPercent}
        />
        <LinearPropertyLabelMovement
          highlightFirst
          showPercent
          showBrackets
          showPlusMinus
          useFull
          useValueLabel
          label="Realized P/L"
          value={position.realizedNet}
          movementValue={position.realizedPercent}
        />
        <LinearPropertyLabelMovement
          highlightFirst
          showPercent
          showBrackets
          showPlusMinus
          useFull
          useValueLabel
          label="Unrealized P/L"
          value={position.unrealizedNet}
          movementValue={position.unrealizedPercent}
        />
      </div>
    </div>
  );
};

export default PositionExpandedContent;
