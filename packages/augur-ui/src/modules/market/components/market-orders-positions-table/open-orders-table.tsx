/* eslint react/no-array-index-key: 0 */

import React, { useRef, useEffect, useState } from "react";
import classNames from 'classnames';

import OpenOrder from "modules/portfolio/containers/open-order";
import OpenOrdersHeader from "modules/portfolio/components/common/open-orders-header";
import { UIOrder } from 'modules/types';

import Styles from "modules/market/components/market-orders-positions-table/open-orders-table.styles";



interface OpenOrdersTableProps {
  openOrders?: UIOrder[];
}

const OpenOrdersTable: React.FC<OpenOrdersTableProps> = ({ openOrders }) => {
  const dataTable = useRef(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const { scrollHeight, clientHeight } = dataTable.current;
    const test = clientHeight < scrollHeight;
    if (scrollable != test) {
      setScrollable(test);
    }
  })
  
  return (
    <div className={classNames(Styles.Table, Styles.TableHeight, {
      [Styles.scrollable]: scrollable
    })}>
      <OpenOrdersHeader extendedView />
      <div ref={dataTable}>
        {openOrders.length > 0 && openOrders.map((order, i) => (
          <OpenOrder key={i} openOrder={order} extendedViewNotOnMobile />
        ))}
      </div>
    </div>
  );
};
OpenOrdersTable.defaultProps = {
  openOrders: []
};

export default OpenOrdersTable;
