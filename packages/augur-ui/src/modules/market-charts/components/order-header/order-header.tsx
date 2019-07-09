import React from "react";
import { ExpandIcon, CollapseIcon } from "modules/common/icons";

import StylesHeader from "modules/market/components/market-outcomes-list/market-outcomes-list.styles.less";
import Styles from "modules/market-charts/components/order-header/order-header.styles.less";

interface OrderHeaderProps {
  title: string;
  headers: Array<any>;
  extended: boolean;
  toggle: any;
  hide: boolean;
}

const OrderHeader = ({
  title,
  headers,
  extended,
  toggle,
  hide
}: OrderHeaderProps) => (
  <section className={Styles.OrderHeader}>
    <button
      className={StylesHeader.Heading}
      onClick={toggle}
    >
      {title}
      {toggle && <span>{extended ? ExpandIcon : CollapseIcon}</span>}
    </button>
    {!hide && (
      <div>
        <div>
          {headers[0]}
        </div>
        <div>
          {headers[1]}
        </div>
        <div>
          {headers[2]}
        </div>
      </div>
    )}
  </section>
);

export default OrderHeader;
