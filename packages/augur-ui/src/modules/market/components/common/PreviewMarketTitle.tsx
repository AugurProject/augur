import React from 'react';
import { buildMarketDescription } from 'modules/create-market/get-template';
import { convertUnixToFormattedDate } from 'utils/format-date';
import type {
  TemplateInput,
  Template,
} from '@augurproject/templates';
import {
  TemplateInputType,
} from '@augurproject/templates';
import Styles from 'modules/market/components/common/market-common.styles.less';
import { NewMarket } from 'modules/types';

interface PreviewMarketTitleProps {
  market: NewMarket;
}

const PreviewMarketTitle: React.FC<PreviewMarketTitleProps> = ({ market }) =>
  market.template ? (
    <MarketTemplateTitle template={market.template} />
  ) : (
    <span>{market.description}</span>
  );

export default PreviewMarketTitle;

interface MarketTemplateTitleProps {
  template: Template;
}

const MarketTemplateTitle: React.FC<MarketTemplateTitleProps> = ({
  template,
}) => {
  if (!template || !template.inputs) return null;
  const convertedInputs: TemplateInput[] = template.inputs.map(i => {
    let userInput = i.userInput;
    if (i.type === TemplateInputType.ESTDATETIME) {
      userInput = convertUnixToFormattedDate(Number(i.userInput))
        .formattedLocalShortDateTimeWithTimezone;
    }

    return {
      userInput,
      id: i.id,
      type: i.type as TemplateInputType,
      placeholder: '',
    };
  });
  const question = buildMarketDescription(template.question, convertedInputs);
  const estDateTime = convertedInputs.find(
    i => i.type === TemplateInputType.ESTDATETIME
  );

  return (
    <div className={Styles.MarketTemplateTitle}>
      <span>{question}</span>
      {estDateTime && (
        <span>Estimated scheduled start time: {estDateTime.userInput}</span>
      )}
    </div>
  );
};
