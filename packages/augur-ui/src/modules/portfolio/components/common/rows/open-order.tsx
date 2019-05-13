import React from "react";
import classNames from "classnames";

import ToggleRow from "modules/portfolio/components/common/rows/toggle-row";
import { Order } from "modules/portfolio/types";
import OpenOrderExpandedContent from "modules/portfolio/components/common/rows/open-order-expanded-content";
import RowColumn from "modules/portfolio/components/common/rows/row-column";
import FilledOrdersTable from "modules/portfolio/components/common/tables/filled-orders-table";
import { FilledOrderInterface } from "modules/portfolio/types";

import Styles from "modules/portfolio/components/common/rows/open-order.styles";

export interface OpenOrderProps {
  rowProperties: Order | FilledOrderInterface;
  isSingle?: Boolean;
  extendedView?: Boolean;
  columnProperties: Array<any>;
  styleOptions: Object;
}

const OpenOrder = (props: OpenOrderProps) => {
  const { rowProperties, isSingle, extendedView, columnProperties, styleOptions } = props;

  if (!rowProperties) {
    return null;
  }

  const rowContent = (
    <ul
      className={classNames(Styles.GenericColumns, {
        [Styles.EightColumns]: styleOptions.filledOrder,
        [Styles.EightColumns__extendedView]: styleOptions.filledOrder && extendedView,
        [Styles.FiveColumns__extendedView]: styleOptions.openOrder && extendedView
      })}
    >
      {columnProperties.map(column => 
        <RowColumn key={column.key} columnType={column.columnType} hide={column.hide} properties={column} />
      )}
    </ul>
  );

  if (styleOptions.noToggle) {
    return (
      <div className={classNames(Styles.Order__single, Styles.BottomBorder)}>
        {rowContent}
      </div>
    );
  }

  return (
    <div
      className={classNames({
        [Styles.Order__parentSingle]: isSingle
      })}
    >
      <ToggleRow
        className={classNames({
          [Styles.Order__single]: isSingle,
          [Styles.Order__group]: !isSingle,
          [Styles.BottomBorder]: extendedView
        })}
        innerClassName={classNames({
          [Styles.Order__innerGroup]: !isSingle,
          [Styles.Order__innerGroupExtended]: extendedView
        })}
        arrowClassName={Styles.Order__arrow}
        rowContent={rowContent}
        toggleContent={
          styleOptions.openOrder ?
          <OpenOrderExpandedContent openOrder={rowProperties} isSingle={isSingle} /> 
          : 
          <FilledOrdersTable
            filledOrder={rowProperties}
            showMarketInfo={isSingle}
          />
        }
      />
    </div>
  );
};

export default OpenOrder;
