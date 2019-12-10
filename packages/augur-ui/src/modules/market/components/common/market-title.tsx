import React from 'react';
import MarketLink from 'modules/market/components/market-link/market-link';
import { buildMarketDescription } from 'modules/create-market/get-template';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { TemplateInput, TemplateInputType, ExtraInfoTemplate } from '@augurproject/artifacts';
import Styles from 'modules/market/components/common/market-common.styles.less';

interface MarketTitleProps {
  id: string;
  description: string;
  isWrapped?: boolean;
  isTemplate?: boolean;
  template?: ExtraInfoTemplate;
  noLink?: boolean;
}

const wrapMarketName = (marketName: string) => <span>{`"${marketName}"`}</span>;

const MarketTitle: React.FC<MarketTitleProps> = ({
  description,
  id,
  isWrapped,
  isTemplate,
  template,
  noLink,
}) =>
  isTemplate ? (
    <MarketLink id={noLink ? null : id}>
      <MarketTemplateTitle template={template} />
    </MarketLink>
  ) : (
    <MarketLink id={noLink ? null : id}>
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
    userInput: (i.type === TemplateInputType.ESTDATETIME || i.type === TemplateInputType.DATETIME)
      ? convertUnixToFormattedDate(Number(i.timestamp)).formattedLocalShortDateTimeNoTimezone
      : i.value,
    id: i.id,
    type: i.type as TemplateInputType,
    placeholder: '',
  }));
  const question = buildMarketDescription(template.question, convertedInputs);
  const estDateTime = convertedInputs.find(
    i => i.type === TemplateInputType.ESTDATETIME
  );

  return (
    <div className={Styles.MarketTemplateTitle}>
      <span>{question}</span>
      {estDateTime && <span>Estimated sheduled start time: {estDateTime.userInput}</span>}
    </div>
  );
};
