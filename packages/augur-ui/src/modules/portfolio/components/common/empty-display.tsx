import React, { ReactNode } from "react";

import Styles from "modules/portfolio/components/common/empty-display.styles.less";

export interface EmptyDisplayProps {
  filterLabel: string;
  selectedTab: string;
  search: string;
  title: string;
  icon?: any;
  button?: ReactNode
}

const EmptyDisplay = ({
  filterLabel,
  selectedTab,
  search,
  title,
  icon,
  button
}: EmptyDisplayProps) => {
  let tradingEmptyTitle = `No ${selectedTab} ${filterLabel.toLowerCase()}`;
  let notTradingEmptyTitle = `No ${title}`;

  let emptyText = `You don't have any ${
    selectedTab.toLowerCase()
  } ${filterLabel.toLowerCase()} yet!`;

  if (search !== "" && search !== undefined) {
    tradingEmptyTitle = `No results found for '${search}'`;
    notTradingEmptyTitle = `No results found for '${search}'`;
  }

  return (
    <div className={Styles.EmptyDisplay}>
      <span>{icon}</span>
      <span>{tradingEmptyTitle}</span>
      <span>{notTradingEmptyTitle}</span>
      <span>{emptyText}</span>
      {button ? button : null}
    </div>);
};

export default EmptyDisplay;
