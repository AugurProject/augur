import React from "react";
import classNames from "classnames";

import Styles from "modules/portfolio/components/common/data-table-header.styles.less";

interface OpenOrdersHeaderProps {
  extendedView?: Boolean;
  showTotalCost?: Boolean;
  noRightMargin?: Boolean;
  initialLiquidity?: Boolean;
}

const OpenOrdersHeader = (props: OpenOrdersHeaderProps) => (
  <ul
    className={classNames(Styles.DataTableHeader, {
      [Styles.DataTableHeader__extended]: props.extendedView,
      [Styles.Extended]: props.showTotalCost,
      [Styles.NoRightMargin]: props.noRightMargin,
      [Styles.InitialLiquidity]: props.initialLiquidity
    })}
  >
    <li>Outcome</li>
    <li>Type</li>
    <li>Quantity</li>
    <li>Price</li>
    {(props.extendedView || props.showTotalCost) && (
      <li>
        Total Cost
        <br />
        ($)
      </li>
    )}
    {props.extendedView && (
      <li>
        Total Cost
        <br />
        (Shares)
      </li>
    )}
  </ul>
);

export default OpenOrdersHeader;
