/* eslint react/no-array-index-key: 0 */

import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';

import OpenOrder from 'modules/portfolio/containers/open-order';
import OpenOrdersHeader from 'modules/portfolio/components/common/open-orders-header';
import { UIOrder } from 'modules/types';

import Styles from 'modules/market/components/market-orders-positions-table/open-orders-table.styles.less';

interface OpenOrdersTableProps {
  openOrders?: UIOrder[];
  relative?: Boolean;
  marketId: string;
}

// Some component can be used in Betting UI
const OpenOrdersTable: React.FC<OpenOrdersTableProps> = ({ openOrders, marketId, relative }) => {
  const dataTable = useRef(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const { scrollHeight, clientHeight } = dataTable.current;
    const test = clientHeight < scrollHeight;
    if (scrollable != test) {
      setScrollable(test);
    }
  });

  return (
    <div
      className={classNames(Styles.Table, {
        [Styles.TableHeight]: !relative,
        [Styles.scrollable]: scrollable,
      })}
    >
      <OpenOrdersHeader extendedView />
      <div ref={dataTable}>
        {openOrders.length > 0 &&
          openOrders.map((order, i) => (
            <OpenOrder key={i} openOrder={order} marketId={marketId} extendedViewNotOnMobile />
          ))}

        {openOrders.length === 0 && (
          <div className={Styles.Empty}>no orders to show</div>
        )}
      </div>
    </div>
  );
};
OpenOrdersTable.defaultProps = {
  openOrders: [],
};

export default OpenOrdersTable;
