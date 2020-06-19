import React from 'react';
import * as constants from 'modules/common/constants';
import {
  MovementLabel,
  PositionTypeLabel,
  TextLabel,
  ValueLabel,
  CountdownLabel
} from 'modules/common/labels';
import InvalidLabel from 'modules/common/containers/labels';
import { CancelTextButton } from 'modules/common/buttons';
import MarketOutcomeTradingIndicator from 'modules/market/containers/market-outcome-trading-indicator';
import { DateFormattedObject } from 'modules/types';
import { TXEventName } from '@augurproject/sdk-lite';
import { XIcon } from 'modules/common/icons';

const { COLUMN_TYPES } = constants;

export interface Properties {
  text?: string;
  keyId?: string;
  type?: string;
  pastTense?: boolean;
  pending?: boolean;
  disabled?: boolean;
  action?: Function;
  showPercent?: string;
  showBrackets?: string;
  showPlusMinus?: string;
  showColors?: boolean;
  value?: string;
  size?: string;
  showEmptyDash?: boolean;
  addIndicator?: boolean;
  alert?: boolean;
  outcome?: string;
  location?: string;
  showExtraNumber?: boolean;
  status?: string;
  showCountdown?: boolean;
  expiry?: DateFormattedObject;
  currentTimestamp?: Number;
  usePercent?: boolean;
}

function selectColumn(columnType: string, properties: Properties) {
  switch (columnType) {
    case COLUMN_TYPES.TEXT:
      return (
        <>
          <TextLabel text={properties.text} keyId={properties.keyId} />
          {properties.showExtraNumber && <span>{properties.value}</span>}
        </>
      );
    case COLUMN_TYPES.POSITION_TYPE:
      return (
        <>
          {properties.showCountdown &&
            <CountdownLabel currentTimestamp={properties.currentTimestamp} expiry={properties.expiry} />
          }
          <PositionTypeLabel
            type={properties.type}
            pastTense={properties.pastTense}
          />
        </>
      );
    case COLUMN_TYPES.VALUE:
      return (
        (properties.value || properties.showEmptyDash) && (
          <>
            {properties.addIndicator && (
              <MarketOutcomeTradingIndicator
                outcome={properties.outcome}
                location={properties.location}
              />
            )}
            {properties.action && (
              <button onClick={properties.action}>
                <ValueLabel
                  value={properties.value}
                  keyId={properties.keyId}
                  showEmptyDash={properties.showEmptyDash}
                  useFull={properties.useFull}
                  usePercent={properties.usePercent}
                  showFullPrecision={properties.showFullPrecision}
                  alert={properties.alert}
                />
              </button>
            )}
            {!properties.action && (
              <ValueLabel
                value={properties.value}
                keyId={properties.keyId}
                showEmptyDash={properties.showEmptyDash}
                useFull={properties.useFull}
                showFullPrecision={properties.showFullPrecision}
                usePercent={properties.usePercent}
                showDenomination={properties.showDenomination}
                alert={properties.alert}
              />
            )}
          </>
        )
      );
    case COLUMN_TYPES.INVALID_LABEL:
      return (
        <InvalidLabel text={properties.text} keyId={properties.keyId} tooltipPositioning='right' />
      );
    case COLUMN_TYPES.CANCEL_TEXT_BUTTON:
      const confirmed = properties.status === TXEventName.Success;
      const failed = properties.status === TXEventName.Failure;
      const buttonText = confirmed ? 'Confirmed' : failed ? 'Failed' : 'Processing ...';
      const isDisabled = !failed && !confirmed;
      const icon = failed || confirmed ? XIcon : null;
      return properties.pending ? (
        <span>
          <CancelTextButton
            confirmed={confirmed}
            failed={failed}
            icon={icon}
            text={buttonText}
            action={properties.action}
            disabled={isDisabled}
          />
        </span>
      ) : (
        <>
          {properties.showCountdown &&
            <CountdownLabel currentTimestamp={properties.currentTimestamp} expiry={properties.expiry} />
          }
          <CancelTextButton
            disabled={properties.disabled}
            text={properties.text}
            action={properties.action}
          />
        </>
      );
    case COLUMN_TYPES.PLAIN:
      return properties.value;
    case COLUMN_TYPES.MOVEMENT_LABEL:
      return (
        <MovementLabel
          useFull={properties.useFull}
          showBrackets={properties.showBrackets}
          showPlusMinus={properties.showPlusMinus}
          value={properties.value}
        />
      );
    default:
      return <div />;
  }
}

export interface RowColumnProps {
  columnType: string;
  hide?: boolean;
  properties: Properties;
}

const RowColumn = (props: RowColumnProps) => {
  const { columnType, hide, properties } = props;

  if (hide) return null;

  const Column = selectColumn(columnType, properties);

  return <li>{Column}</li>;
};

export default RowColumn;
