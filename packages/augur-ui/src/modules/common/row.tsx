import React from "react";
import classNames from "classnames";
import Media from "react-media";

import ToggleRow from "modules/common/toggle-row";
import { Order } from "modules/portfolio/types";
import OpenOrderExpandedContent from "modules/portfolio/components/common/open-order-expanded-content";
import FilledOrdersTable from "modules/portfolio/components/common/filled-orders-table";
import { FilledOrderInterface } from "modules/portfolio/types";
import PositionExpandedContent from "modules/portfolio/components/common/position-expanded-content";
import RowColumn from "modules/common/row-column";
import { Properties } from "modules/common/row-column";
import { SMALL_MOBILE } from "modules/common/constants";

import Styles from "modules/common/row.styles";

export interface StyleOptions {
  position?: Boolean;
  openOrder?: Boolean;
  filledOrder?: Boolean;
  initialLiquidity?: Boolean;
  noToggle?: Boolean;
  showExpandedToggleOnMobile?: Boolean;
  isFirst?: Boolean;
  outcome?: Boolean;
  colorId?: string;
  active?: Boolean;
  isInvalid?: Boolean;
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
  const { 
    position, 
    openOrder, 
    filledOrder, 
    active, 
    isInvalid,
    outcome, 
    colorId, 
    initialLiquidity 
  } = styleOptions;

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
          position && extendedView || initialLiquidity,
        [Styles.Row4]:
          outcome,
        [`${Styles[`Row4-${colorId}`]}`]: outcome && colorId,
        [`${Styles.active}`]:
          outcome && active,
        [`${Styles.InvalidText}`]: outcome && isInvalid
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

  const { 
    position, 
    openOrder, 
    filledOrder, 
    showExpandedToggleOnMobile, 
    noToggle, 
    isFirst, 
    outcome, 
    active, 
    initialLiquidity 
  } = styleOptions;

  const rowContent = (
    <Media query={SMALL_MOBILE}>
      {matches => (matches && extendedViewNotOnMobile) ?
        (<RowContent {...props} extendedView={extendedView} />) : 
        (<RowContent {...props} extendedView={extendedViewNotOnMobile || extendedView}/>)
      }
    </Media>
  );

  if (noToggle && !extendedViewNotOnMobile) {
    return (
      <div 
        onClick={rowOnClick} 
        className={classNames(Styles.SingleRow, 
          {
            [Styles.Row4Parent]: outcome, 
            [Styles.DarkRow]: initialLiquidity, 
            [Styles.BottomBorder]: !initialLiquidity
          }
        )}
       >
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
        <>
          {(noToggle && extendedViewNotOnMobile && !matches) &&
            <div className={classNames(Styles.SingleRow, Styles.BottomBorder)}>
              {rowContent}
            </div>
          } 
          {!(noToggle && extendedViewNotOnMobile && !matches) &&
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
          }
          </>
      )}
    </Media>
  );
};

export default Row;
