import React from "react";
import classNames from "classnames";

import ToggleRow from "modules/portfolio/components/common/rows/toggle-row";
import { Order } from "modules/portfolio/types";
import OpenOrderExpandedContent from "modules/portfolio/components/common/rows/open-order-expanded-content";
import RowColumn from "modules/portfolio/components/common/rows/row-column";
import FilledOrdersTable from "modules/portfolio/components/common/tables/filled-orders-table";
import { FilledOrderInterface } from "modules/portfolio/types";
import PositionExpandedContent from "modules/portfolio/components/common/rows/position-expanded-content";

import Styles from "modules/portfolio/components/common/rows/open-order.styles";

export interface RowProps {
  rowProperties: Order | FilledOrderInterface;
  isSingle?: Boolean;
  extendedView?: Boolean;
  columnProperties: Array<any>;
  styleOptions: Object;
}

const Row = (props: RowProps) => {
  const { rowProperties, isSingle, extendedView, columnProperties, styleOptions } = props;

  if (!rowProperties) {
    return null;
  }

  const rowContent = (
    <ul
      className={classNames(Styles.GenericColumns, {
        [Styles.EightColumns]: styleOptions.filledOrder,
        [Styles.EightColumns__extendedView]: styleOptions.filledOrder && extendedView,
        [Styles.FiveColumns__extendedView]: styleOptions.openOrder && extendedView,
        [Styles.EightColumns_alternative]: styleOptions.position,
        [Styles.EightColumns_alternative__extendedView]: styleOptions.position && extendedView,
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

  if (styleOptions.showExpandedToggle) {
    return (
      <div
        className={classNames(
          Styles.Order__single,
          Styles.Position__single
        )}
      >
        <div
          className={Styles.Position__innerSingle}
        >
          {rowContent}
        </div>
        {styleOptions.position && <PositionExpandedContent showExpandedToggle position={rowProperties} />}
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
          [Styles.Order__single]: isSingle || styleOptions.position,
          [Styles.Order__group]: !isSingle && !styleOptions.position,
          [Styles.BottomBorder]: extendedView && !styleOptions.position,
          [Styles.Position__single]: styleOptions.position
        })}
        innerClassName={classNames({
          [Styles.Order__innerGroup]: !isSingle || styleOptions.position,
          [Styles.Order__innerGroupExtended]: extendedView || styleOptions.position && styleOptions.isFirst
        })}
        arrowClassName={Styles.Order__arrow}
        rowContent={rowContent}
        toggleContent={
          <>
            {styleOptions.openOrder && <OpenOrderExpandedContent openOrder={rowProperties} isSingle={isSingle} />}
            {styleOptions.filledOrder && <FilledOrdersTable
              filledOrder={rowProperties}
              showMarketInfo={isSingle}
            />}
            {styleOptions.position &&
              <PositionExpandedContent showExpandedToggle={styleOptions.showExpandedToggle} position={rowProperties} /> 
            }
          </>
        }
      />
    </div>
  );
};

export default Row;
