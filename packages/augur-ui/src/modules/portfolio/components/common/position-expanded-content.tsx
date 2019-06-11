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
};

export default PositionExpandedContent;
