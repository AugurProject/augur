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

const { COLUMN_TYPES } = constants;

function selectColumn(columnType, properties) {
  switch (columnType) {
    case COLUMN_TYPES.TEXT:
      return <TextLabel text={properties.text} keyId={properties.keyId} />;
    case COLUMN_TYPES.POSITION_TYPE:
      return <PositionTypeLabel type={properties.type} pastTense={properties.pastTense} />;
    case COLUMN_TYPES.VALUE:
      return properties.value && <ValueLabel value={properties.value} keyId={properties.keyId} />;
    case COLUMN_TYPES.CANCEL_TEXT_BUTTON:
      return (properties.pending ? <span> <PendingLabel /> </span> : <CancelTextButton disabled={properties.disabled} text={properties.text} action={properties.action} />);
    case COLUMN_TYPES.PLAIN:
      return properties.value;
    case COLUMN_TYPES.MOVEMENT_LABEL:
      return (<MovementLabel
              showPercent={properties.showPercent}
              showBrackets={properties.showBrackets}
              showPlusMinus={properties.showPlusMinus}
              showColors={properties.showColors}
              size={properties.size}
              value={properties.value}
            />);
    default:
      return <div/>;
  }
}

export interface RowColumnProps {
  columnType: String;
  hide?: Boolean;
  properties: Object;
}

const RowColumn = (props: RowColumnProps) => {
  const { columnType, hide, properties } = props;

  const Column = selectColumn(columnType, properties);

  if (hide) return null;

  return <li>{Column}</li>;
}

export default RowColumn;
