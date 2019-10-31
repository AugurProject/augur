import React from 'react';
import MarketLink from 'modules/market/components/market-link/market-link';
import { TemplateIcon } from 'modules/common/icons';
import Styles from 'modules/market/components/common/market-common.styles.less';

interface MarketTitleProps {
  id: string;
  description: string;
  isWrapped?: boolean;
  isTemplate?: boolean;
  showIcon?: boolean;
}

const wrapMarketName = (marketName: string) => <span>{`"${marketName}"`}</span>;

const MarketTitle: React.FC<MarketTitleProps> = ({
  description,
  id,
  isWrapped,
  isTemplate,
  showIcon,
}) => (
  <span className={Styles.MarketTitle}>
    <MarketLink id={id}>
      {isWrapped ? wrapMarketName(description) : description}
      {isTemplate && showIcon && TemplateIcon}
    </MarketLink>
  </span>
);

export default MarketTitle;
