import React, { ReactNode } from "react";

import Styles from "modules/portfolio/components/common/empty-display.styles.less";
import { SearchIcon } from "modules/common/icons";

export interface EmptyDisplayProps {
  filterLabel: string;
  selectedTab: string;
  search: string;
  title: string;
  emptyTitle?: string;
  emptyText?: string;
  icon?: any;
  button?: ReactNode;
  searchObject?: string;
}

const EmptyDisplay = ({
  filterLabel,
  selectedTab,
  search,
  title,
  emptyTitle,
  emptyText,
  icon,
  button,
  searchObject = 'markets'
}: EmptyDisplayProps) => {
  let tradingEmptyTitle = `No ${selectedTab} ${filterLabel.toLowerCase()}`;
  let notTradingEmptyTitle = `No ${title}`;

  let defaultEmptyText = `You don't have any ${
    selectedTab.toLowerCase()
  } ${filterLabel.toLowerCase()} yet!`;

  const searchActive = search !== "" && search !== undefined;
  if (searchActive) {
    tradingEmptyTitle = `No ${searchObject} found'`;
    notTradingEmptyTitle = `Try a different keyword`;
  } else if (emptyTitle) {
    notTradingEmptyTitle = emptyTitle;
  }

  return (
    <div className={Styles.EmptyDisplay}>
      <span>{searchActive ? SearchIcon : icon}</span>
      <span>{tradingEmptyTitle}</span>
      <span>{notTradingEmptyTitle}</span>
      <span>{emptyText ? emptyText : defaultEmptyText}</span>
      {button ? button : null}
    </div>);
};

export default EmptyDisplay;
