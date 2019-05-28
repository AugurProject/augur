import React from "react";
import * as constants from "modules/common-elements/constants";
import {
  LinearPropertyLabel,
  PendingLabel,
  PositionTypeLabel,
  ValueLabel,
  TextLabel,
  MovementLabel
} from "modules/common-elements/labels";
import { CancelTextButton } from "modules/common-elements/buttons";
import MarketOutcomeTradingIndicator from "modules/market/containers/market-outcome-trading-indicator";

const { COLUMN_TYPES } = constants;

export interface Properties {
  text?: string;
  keyId?: string;
  type?: string;
  pastTense?: Boolean;
  pending?: Boolean;
  disabled?: Boolean;
  action?: Function;
  showPercent?: string;
  showBrackets?: string;
  showPlusMinus?: string;
  showColors?: Boolean;
  value?: string;
  size?: string;
  showEmptyDash?: Boolean;
  addIndicator?: Boolean;
  outcome?: string;
  location?: string;
  showExtraNumber?: Boolean;
}

function selectColumn(columnType: string, properties: Properties) {
  switch (columnType) {
    case COLUMN_TYPES.TEXT:
      return (
        <>
          <TextLabel text={properties.text} keyId={properties.keyId} />
          {properties.showExtraNumber &&
            <span>{properties.value}</span>
          }
        </>
      );
    case COLUMN_TYPES.POSITION_TYPE:
      return (
        <PositionTypeLabel
          type={properties.type}
          pastTense={properties.pastTense}
        />
      );
    case COLUMN_TYPES.VALUE:
      return (
        (properties.value || properties.showEmptyDash) && (
          <>
            {properties.addIndicator &&
              <MarketOutcomeTradingIndicator
                outcome={properties.outcome}
                location={properties.location}
              />
            }
            <ValueLabel value={properties.value} keyId={properties.keyId} showEmptyDash={properties.showEmptyDash} />
          </>
        )
      );
    case COLUMN_TYPES.CANCEL_TEXT_BUTTON:
      return properties.pending ? (
        <span>
          {" "}
          <PendingLabel />{" "}
        </span>
      ) : (
        <CancelTextButton
          disabled={properties.disabled}
          text={properties.text}
          action={properties.action}
        />
      );
    case COLUMN_TYPES.PLAIN:
      return properties.value;
    case COLUMN_TYPES.MOVEMENT_LABEL:
      return (
        <MovementLabel
          showPercent={properties.showPercent}
          showBrackets={properties.showBrackets}
          showPlusMinus={properties.showPlusMinus}
          showColors={properties.showColors}
          size={properties.size}
          value={properties.value}
        />
      );
    default:
      return <div />;
  }
}

export interface RowColumnProps {
  columnType: string;
  hide?: Boolean;
  properties: Properties;
}

const RowColumn = (props: RowColumnProps) => {
  const { columnType, hide, properties } = props;

  if (hide) return null;

  const Column = selectColumn(columnType, properties);

  return <li>{Column}</li>;
};

export default RowColumn;
