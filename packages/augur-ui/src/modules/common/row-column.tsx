import React from 'react';
import * as constants from 'modules/common/constants';
import {
  MovementLabel,
  PositionTypeLabel,
  TextLabel,
  ValueLabel,
  CountdownLabel,
  RedFlag,
  TemplateShield,
  InvalidLabel,
  TypeLabel,
} from 'modules/common/labels';
import { CancelTextButton, CashoutButton, PendingIconButton, ProcessingButton } from 'modules/common/buttons';
import OutcomeTradingIndicator from "modules/market/components/common/outcome-trading-indicator/outcome-trading-indicator";
import { DateFormattedObject, FormattedNumber } from 'modules/types';
import { TXEventName } from '@augurproject/sdk-lite';
import { XIcon } from 'modules/common/icons';
import MarketLink from 'modules/market/components/market-link/market-link';

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
  value?: string | FormattedNumber;
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
  highRisk?: boolean;
  useFull?: boolean;
  showFullPrecision?: boolean;
  showDenomination?: boolean;
  templateShield?: boolean;
  marketId?: string;
  retryFnc?: Function;
  showTypeLabel?: boolean;
  queueName?: string;
  queueId?: string;
}

function selectColumn(columnType: string, properties: Properties) {
  const {
    text,
    keyId,
    type,
    pastTense,
    pending,
    disabled,
    action,
    showBrackets,
    showPlusMinus,
    value,
    showEmptyDash,
    addIndicator,
    alert,
    outcome,
    location,
    showExtraNumber,
    status,
    showCountdown,
    expiry,
    currentTimestamp,
    usePercent,
    highRisk,
    useFull,
    showFullPrecision,
    showDenomination,
    templateShield,
    marketId,
    retryFnc,
    showTypeLabel,
    queueName,
    queueId
  } = properties;

  switch (columnType) {
    case COLUMN_TYPES.TEXT:
      return (
        <>
          {showTypeLabel && <TypeLabel type={type} />}
          <TextLabel text={text} keyId={keyId} />
          {templateShield &&
            <TemplateShield market={outcome} />
          }
          {(showExtraNumber && highRisk) ? (
            <RedFlag market={{ mostLikelyInvalid: highRisk, id: 0 }} />
          ): null}
          {showExtraNumber && templateShield && value !== undefined && <MarketLink id={marketId}>{value}</MarketLink>}
          {showExtraNumber && !templateShield && value !== undefined && <span>{value}</span>}
          {!!retryFnc && <span>Order failed when processing. <button onClick={() => retryFnc()}>Retry</button></span>}
        </>
      );
    case COLUMN_TYPES.POSITION_TYPE:
      return (
        <>
          {showCountdown && (
            <CountdownLabel
              currentTimestamp={currentTimestamp}
              expiry={expiry}
            />
          )}
          <PositionTypeLabel
            type={type}
            pastTense={pastTense}
          />
        </>
      );
    case COLUMN_TYPES.VALUE:
      return (
        (value || showEmptyDash) && (
          <>
            {addIndicator && (
              <OutcomeTradingIndicator
                outcome={outcome}
                location={location}
              />
            )}
            {action && (
              <button onClick={action}>
                <ValueLabel
                  value={value}
                  keyId={keyId}
                  showEmptyDash={showEmptyDash}
                  useFull={useFull}
                  usePercent={usePercent}
                  showFullPrecision={showFullPrecision}
                  alert={alert}
                />
              </button>
            )}
            {!action && (
              <ValueLabel
                value={value}
                keyId={keyId}
                showEmptyDash={showEmptyDash}
                useFull={useFull}
                showFullPrecision={showFullPrecision}
                usePercent={usePercent}
                showDenomination={showDenomination}
                alert={alert}
              />
            )}
          </>
        )
      );
    case COLUMN_TYPES.INVALID_LABEL:
      return (
        <InvalidLabel
          text={text}
          keyId={keyId}
          tooltipPositioning="right"
        />
      );
    case COLUMN_TYPES.CASHOUT_BUTTON: 
      return (
        <span>
          <CashoutButton bet={outcome}/>
        </span>
      );
    case COLUMN_TYPES.PENDING_ICON_BUTTON:
      return (
        <span>
          <PendingIconButton bet={outcome}/>
        </span>
      );
    case COLUMN_TYPES.CANCEL_TEXT_BUTTON:
      const confirmed = status === TXEventName.Success;
      const failed = status === TXEventName.Failure;
      const buttonText = confirmed
        ? 'Confirmed'
        : failed
        ? 'Failed'
        : 'Processing ...';
      const isDisabled = !failed && !confirmed;
      return (
        <>
          {showCountdown && (
            <CountdownLabel
              currentTimestamp={currentTimestamp}
              expiry={expiry}
            />
          )}
          <ProcessingButton
            disabled={disabled}
            text={text}
            cancelButton
            action={action}
            queueName={queueName}
            queueId={queueId}
          />
        </>
      );
    case COLUMN_TYPES.PLAIN:
      return value;
    case COLUMN_TYPES.MOVEMENT_LABEL:
      return (
        <MovementLabel
          useFull={useFull}
          showBrackets={showBrackets}
          showPlusMinus={showPlusMinus}
          value={value}
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
