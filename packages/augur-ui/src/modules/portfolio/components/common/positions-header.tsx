import React from "react";
import classNames from "classnames";

import { DaiPercentButton } from "modules/common/buttons";

import Styles from "modules/portfolio/components/common/data-table-header.styles.less";
import SharedStyles from "modules/common/row.styles.less";

interface PositionsHeaderProps {
  showPercent: boolean;
  updateShowPercent: Function;
  extendedView?: boolean;
}

const PositionsHeader = (props: PositionsHeaderProps) => (
  <ul
    className={classNames(Styles.DataTableHeader, Styles.PositionHeader, {
      [SharedStyles.Row3]: !props.extendedView,
      [Styles.DataTableHeader__extended]: props.extendedView,
      [Styles.PositionHeader__extended]: props.extendedView,
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
        <DaiPercentButton
          showDai={!props.showPercent}
          title="dai/percent"
          action={props.updateShowPercent}
        />
      </li>
    )}
    {props.extendedView && <li>Unrealized P/L</li>}
    {props.extendedView && <li>Realized P/L</li>}
  </ul>
);

export default PositionsHeader;
