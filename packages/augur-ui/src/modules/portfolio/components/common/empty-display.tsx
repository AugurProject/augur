import React from "react";

import Styles from "modules/portfolio/components/common/empty-display.styles.less";

export interface EmptyDisplayProps {
  filterLabel: string;
  selectedTab: string;
  search: string;
  icon?: any;
}

const EmptyDisplay = ({
  filterLabel,
  selectedTab,
  search,
  icon,
}: EmptyDisplayProps) => {
  let emptyTitle = `No ${selectedTab} ${filterLabel.toLowerCase()}`;

  let emptyText = `You don't have any ${
    selectedTab.toLowerCase()
  } ${filterLabel.toLowerCase()} yet!`;

  if (search !== "" && search !== undefined) {
    emptyTitle = `No results found for '${search}'`;
  }

  console.log('EmptyDisplay', icon);

  return (
    <div className={Styles.EmptyDisplay}>
      <span>{icon}</span>
      <span>{emptyTitle}</span>
      <span>{emptyText}</span>
    </div>);
};

export default EmptyDisplay;
