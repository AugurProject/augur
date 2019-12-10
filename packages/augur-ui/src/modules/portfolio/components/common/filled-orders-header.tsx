import React from "react";
import classNames from "classnames";

import Styles from "modules/portfolio/components/common/data-table-header.styles.less";

interface FilledOrdersHeaderProps {
  extendedView?: boolean;
}

const FilledOrdersHeader = (props: FilledOrdersHeaderProps) => (
  <ul
    className={classNames(Styles.DataTableHeader, Styles.FilledOrdersHeader, {
      [Styles.DataTableHeader__extended]: props.extendedView,
      [Styles.FilledOrdersHeader__extended]: props.extendedView,
    })}
  >
    <li>Outcome</li>
    <li>Type</li>
    <li>Quantity</li>
    <li>
      Quantity
      <br />
      Filled
    </li>
    <li>Price</li>
    <li>Fill Date</li>
    <li>
      Fills
    </li>
  </ul>
);

export default FilledOrdersHeader;
