import React from 'react';
import MarketLink from 'modules/market/components/market-link/market-link';
import { buildMarketDescription } from 'modules/create-market/get-template';
import { convertUnixToFormattedDate } from 'utils/format-date';
import type {
  TemplateInput,
  ExtraInfoTemplate,
} from '@augurproject/templates';
import {
  TemplateInputType,
  getTemplatePlaceholderById,
  hasTemplateTextInputs,
} from '@augurproject/templates';
import Styles from 'modules/market/components/common/market-common.styles.less';
import classNames from 'classnames';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import ReactTooltip from 'react-tooltip';
import { ExclamationCircle } from 'modules/common/icons';
import { CustomMarketLabel } from 'modules/common/labels';

interface MarketTitleProps {
  id: string;
  description: string;
  isWrapped?: boolean;
  isTemplate?: boolean;
  template?: ExtraInfoTemplate;
  noLink?: boolean;
  headerType?: string;
  topPadding?: boolean;
  showCustomLabel?: boolean;
}

const wrapMarketName = (marketName: string) => <span>{`"${marketName}"`}</span>;

const MarketTitle: React.FC<MarketTitleProps> = ({
  description,
  id,
  isWrapped,
  isTemplate,
  template,
  noLink,
  headerType,
  topPadding,
  showCustomLabel,
}) =>
  isTemplate ? (
    <MarketLink className={Styles.MarketTemplateTitle} id={noLink ? null : id} headerType={headerType}>
      <MarketTemplateTitle template={template} />
    </MarketLink>
  ) : (
    <MarketLink id={noLink ? null : id} headerType={headerType}>
      {showCustomLabel && <CustomMarketLabel isTemplate={false} inTitle={topPadding} />}
      {isWrapped ? wrapMarketName(description) : description}
    </MarketLink>
  );

export default MarketTitle;

interface MarketTemplateTitleProps {
  template: ExtraInfoTemplate;
}

const MarketTemplateTitle: React.FC<MarketTemplateTitleProps> = ({
  template,
}) => {
  if (!template || !template.inputs) return null;
  const convertedInputs: TemplateInput[] = template.inputs.map(i => ({
    userInput:
      i.type === TemplateInputType.ESTDATETIME ||
      i.type === TemplateInputType.DATETIME
        ? convertUnixToFormattedDate(Number(i.timestamp))
            .formattedLocalShortDateTimeWithTimezone
        : i.value,
    id: i.id,
    type: i.type as TemplateInputType,
    placeholder: '',
  }));
  let question = buildMarketDescription(template.question, convertedInputs);
  const estDateTime = convertedInputs.find(
    i => i.type === TemplateInputType.ESTDATETIME
  );

  const hasInputs = hasTemplateTextInputs(template.hash);
  if (hasInputs) {
    const originalQuestion = template.question.split(' ');
    let prevWordUnique = false;
    question = originalQuestion.map((word, index) => {
      const bracketPos = word.indexOf('[');
      const bracketPos2 = word.indexOf(']');

      if (bracketPos === -1 || bracketPos === -1) {
        let prevWordWasUnique = prevWordUnique;
        prevWordUnique = false;
        return (
          <span key={word + index}>
            {prevWordWasUnique && ' '}
            {word}&nbsp;
          </span>
        );
      } else {
        let uniquePrev = prevWordUnique;
        prevWordUnique = true;
        const id = word.substring(bracketPos + 1, bracketPos2);
        const inputIndex = convertedInputs.findIndex(
          findInput => findInput.id.toString() === id
        );
        let trailing = '';
        let prePend = '';
        if (bracketPos !== 0) {
          prePend = word.substring(0, bracketPos);
        }
        if (bracketPos2 < word.length) {
          trailing = word.substring(bracketPos2 + 1, word.length);
        }
        if (inputIndex > -1) {
          const input = convertedInputs[inputIndex];
          const placeholder = getTemplatePlaceholderById(
            template.hash,
            input.id
          );
          return (
            <span
              key={inputIndex}
              className={classNames({
                [Styles.TEXT]: placeholder,
              })}
              data-tip
              data-for={input.id + input.userInput}
              data-iscapture={true}
            >
              {uniquePrev && ' '}
              {prePend !== '' && <span>{prePend}</span>}
              {input.userInput}
              {placeholder && (
                <ReactTooltip
                  id={input.id + input.userInput}
                  className={TooltipStyles.Tooltip}
                  effect="solid"
                  place="top"
                  type="light"
                  event="mouseover mouseenter"
                  eventOff="mouseleave mouseout scroll mousewheel blur"
                >
                  {placeholder}
                </ReactTooltip>
              )}
              {trailing !== '' && <span>{trailing}</span>}
            </span>
          );
        }
      }
    });
  }

  return (
    <>
      {!estDateTime && question}
      {estDateTime && (
        <>
          {question}
          <br/>
          Estimated scheduled start time: {estDateTime.userInput}
        </>
      )}
    </>
  );
};
