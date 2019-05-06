import React from "react";
import classNames from "classnames";

import { EthPercentButton } from "modules/common-elements/buttons";

import Styles from "modules/portfolio/components/common/headers/data-table-header.styles";
import SharedStyles from "modules/portfolio/components/common/rows/open-order.styles";

interface PositionsHeaderProps {
  showPercent: Boolean;
  updateShowPercent: Function;
  extendedView?: Boolean;
}

const PositionsHeader = (props: PositionsHeaderProps) => (
  <ul
    className={classNames(Styles.DataTableHeader, Styles.PositionHeader, {
      [SharedStyles.Position]: !props.extendedView,
      [Styles.DataTableHeader__extended]: props.extendedView,
      [Styles.PositionHeader__extended]: props.extendedView
    })}
  >
    <li>Outcome</li>
    <li>Type</li>
    <li>Quantity</li>
    <li>
      Average
      {props.extendedView ? " " : <br />}
      Price
    </li>
    {!props.extendedView && (
      <li>
        Total
        <br />
        Cost
      </li>
    )}
    {!props.extendedView && (
      <li>
        Current
        <br />
        Value
      </li>
    )}
    {!props.extendedView && (
      <li>
        Last
        <br />
        Price
      </li>
    )}
    {!props.extendedView && (
      <li>
        <span>
          Total
          <br />
          Returns
        </span>
        <EthPercentButton
          showEth={props.showPercent}
          title="eth/percent"
          action={props.updateShowPercent}
        />
      </li>
    )}
    {props.extendedView && <li>Unrealized P/L</li>}
    {props.extendedView && <li>Realized P/L</li>}
  </ul>
);

export default PositionsHeader;
