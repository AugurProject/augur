import React from "react";
import classNames from "classnames";
import Media from "react-media";

import ToggleRow from "modules/common-elements/toggle-row";
import { Order } from "modules/portfolio/types";
import OpenOrderExpandedContent from "modules/portfolio/components/common/rows/open-order-expanded-content";
import FilledOrdersTable from "modules/portfolio/components/common/tables/filled-orders-table";
import { FilledOrderInterface } from "modules/portfolio/types";
import PositionExpandedContent from "modules/portfolio/components/common/rows/position-expanded-content";
import RowColumn from "modules/common-elements/row-column";
import { Properties } from "modules/common-elements/row-column";
import { SMALL_MOBILE } from "modules/common-elements/constants";

import Styles from "modules/common-elements/row.styles";

export interface StyleOptions {
  position?: Boolean;
  openOrder?: Boolean;
  filledOrder?: Boolean;
  noToggle?: Boolean;
  showExpandedToggleOnMobile?: Boolean;
  isFirst?: Boolean;
  outcome?: Boolean;
  colorId?: string;
  active?: Boolean;
}

export interface RowProps {
  rowProperties: Order | FilledOrderInterface;
  columnProperties: Array<Properties>;
  styleOptions: StyleOptions;
  isSingle?: Boolean;
  rowOnClick?: Function;
  extendedView?: Boolean;
  extendedViewNotOnMobile?: Boolean;
}

const RowContent = (props: RowProps) => {
   const {
    extendedView,
    columnProperties,
    styleOptions,
  } = props;
  const { position, openOrder, filledOrder, active, outcome, colorId } = styleOptions;

  return (<ul
      className={classNames(Styles.Row, {
        [Styles.Row2]: filledOrder,
        [Styles.Row2_a]:
          filledOrder && extendedView,
        [Styles.Row1]:
          openOrder && !extendedView,
        [Styles.Row_a]:
          openOrder && extendedView,
        [Styles.Row3]: position,
        [Styles.Row3_a]:
          position && extendedView,
        [Styles.Row4]:
          outcome,
        [`${Styles[`Row4-${colorId}`]}`]: outcome && colorId,
        [`${Styles.active}`]:
          outcome && active
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
}

const Row = (props: RowProps) => {
  const {
    rowProperties,
    isSingle,
    extendedView,
    extendedViewNotOnMobile,
    columnProperties,
    styleOptions,
    rowOnClick
  } = props;

  if (!rowProperties) {
    return null;
  }

  const { position, openOrder, filledOrder, showExpandedToggleOnMobile, noToggle, isFirst, outcome, active } = styleOptions;

  const rowContent = (
    <Media query={SMALL_MOBILE}>
      {matches => (matches && extendedViewNotOnMobile) ?
        (<RowContent {...props} extendedView={extendedView} />) : 
        (<RowContent {...props} extendedView={extendedViewNotOnMobile || extendedView}/>)
      }
    </Media>
  );

  if (noToggle) {
    return (
      <div onClick={rowOnClick} className={classNames(Styles.SingleRow, Styles.BottomBorder, {[Styles.Row4Parent]: outcome})}>
        {rowContent}
      </div>
    );
  }

  return (
    <Media query={SMALL_MOBILE}>
      {matches =>
       (matches && showExpandedToggleOnMobile) ? (
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
        ) : (
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
                    showExpandedToggleOnMobile={showExpandedToggleOnMobile}
                    position={rowProperties}
                  />
                )}
              </>
            }
          />
        </div>
      )}
    </Media>
  );
};

export default Row;
