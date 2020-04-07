import React from 'react';
import { generateTooltip } from 'modules/app/components/inner-nav/markets-list-filters';
import Styles from 'modules/common/labels.styles.less';

interface labelWithTooltipProps {
  labelText: string;
  tipText: string;
  key: string;
}

export const labelWithTooltip = ({labelText, tipText, key}: labelWithTooltipProps) => (
  <span className={Styles.LabelWithTooltip}>
    {labelText}
    {generateTooltip(
      tipText,
      key
    )}
  </span>
);
