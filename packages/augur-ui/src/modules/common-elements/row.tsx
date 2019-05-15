import React from "react";
import classNames from "classnames";

import ToggleRow from "modules/common-elements/toggle-row";
import { Order } from "modules/portfolio/types";
import OpenOrderExpandedContent from "modules/portfolio/components/common/rows/open-order-expanded-content";
import FilledOrdersTable from "modules/portfolio/components/common/tables/filled-orders-table";
import { FilledOrderInterface } from "modules/portfolio/types";
import PositionExpandedContent from "modules/portfolio/components/common/rows/position-expanded-content";
import RowColumn from "modules/common-elements/row-column";
import { Properties } from "modules/common-elements/row-column";

import Styles from "modules/common-elements/row.styles";

export interface StyleOptions {
  position?: Boolean;
  openOrder?: Boolean;
  filledOrder?: Boolean;
  noToggle?: Boolean;
  showExpandedToggle?: Boolean;
  isFirst?: Boolean;
}

export interface RowProps {
  rowProperties: Order | FilledOrderInterface;
  columnProperties: Array<Properties>;
  styleOptions: StyleOptions;
  isSingle?: Boolean;
  extendedView?: Boolean;
}

const Row = (props: RowProps) => {
  const {
    rowProperties,
    isSingle, 
    extendedView, 
    columnProperties,
    styleOptions
  } = props;

  if (!rowProperties) {
    return null;
  }

  const { position, openOrder, filledOrder, noToggle, showExpandedToggle, isFirst } = styleOptions;

  const rowContent = (
    <ul
      className={classNames(Styles.Row, {
        [Styles.Row2]: filledOrder,
        [Styles.Row2_a]:
          filledOrder && extendedView,
        [Styles.Row_a]:
          openOrder && extendedView,
        [Styles.Row3]: position,
        [Styles.Row3_a]:
          position && extendedView
      })}
    >
      {columnProperties.map(column => (
        <RowColumn
          key={column.key}
          columnType={column.columnType}
          hide={column.hide}
          properties={column}
        />
      ))}
    </ul>
  );

  if (noToggle) {
    return (
      <div className={classNames(Styles.SingleRow, Styles.BottomBorder)}>
        {rowContent}
      </div>
    );
  }

  if (showExpandedToggle) {
    return (
      <div
        className={classNames(Styles.SingleRow, Styles.SingleRow3)}
      >
        <div>{rowContent}</div>
        {position && (
          <PositionExpandedContent
            showExpandedToggle
            position={rowProperties}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={classNames({
        [Styles.ParentSingleRow]: isSingle
      })}
    >
      <ToggleRow
        className={classNames({
          [Styles.SingleRow]: isSingle || position,
          [Styles.GroupRow]: !isSingle && !position,
          [Styles.BottomBorder]: extendedView && !position,
          [Styles.SingleRow3]: position
        })}
        innerClassName={classNames({
          [Styles.InnerGroupRow]: !isSingle || position,
          [Styles.InnerGroupRow_a]:
            extendedView || (position && isFirst)
        })}
        arrowClassName={Styles.Arrow}
        rowContent={rowContent}
        toggleContent={
          <>
            {openOrder && (
              <OpenOrderExpandedContent
                openOrder={rowProperties}
                isSingle={isSingle}
              />
            )}
            {filledOrder && (
              <FilledOrdersTable
                filledOrder={rowProperties}
                showMarketInfo={isSingle}
              />
            )}
            {position && (
              <PositionExpandedContent
                showExpandedToggle={showExpandedToggle}
                position={rowProperties}
              />
            )}
          </>
        }
      />
    </div>
  );
};

export default Row;
