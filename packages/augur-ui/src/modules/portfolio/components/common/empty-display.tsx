import React, { ReactNode } from "react";

import Styles from "modules/portfolio/components/common/empty-display.styles.less";

export interface EmptyDisplayProps {
  filterLabel: string;
  selectedTab: string;
  search: string;
  title: string;
  emptyTitle?: string;
  emptyText?: string;
  icon?: any;
  button?: ReactNode
}

const EmptyDisplay = ({
  filterLabel,
  selectedTab,
  search,
  title,
  emptyTitle,
  emptyText,
  icon,
  button
}: EmptyDisplayProps) => {
  let tradingEmptyTitle = `No ${selectedTab} ${filterLabel.toLowerCase()}`;
  let notTradingEmptyTitle = `No ${title}`;

  let defaultEmptyText = `You don't have any ${
    selectedTab.toLowerCase()
  } ${filterLabel.toLowerCase()} yet!`;

  if (search !== "" && search !== undefined) {
    tradingEmptyTitle = `No results found for '${search}'`;
    notTradingEmptyTitle = `No results found for '${search}'`;
  } else if (emptyTitle) {
    notTradingEmptyTitle = emptyTitle;
  }

  return (
    <div className={Styles.EmptyDisplay}>
      <span>{icon}</span>
      <span>{tradingEmptyTitle}</span>
      <span>{notTradingEmptyTitle}</span>
      <span>{emptyText ? emptyText : defaultEmptyText}</span>
      {button ? button : null}
    </div>);
};

export default EmptyDisplay;
