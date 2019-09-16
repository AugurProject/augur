import React from "react";

import Styles from "modules/portfolio/components/common/empty-display.styles.less";

export interface EmptyDisplayProps {
  filterLabel: string;
  selectedTab: string;
  search: string;
}

const EmptyDisplay = (props: EmptyDisplayProps) => {
  let emptyTitle = `No ${
    props.selectedTab
  } ${props.filterLabel.toLowerCase()}`;

  if (props.search !== "" && props.search !== undefined) {
    emptyTitle = `No results found for '${props.search}'`;
  }

  return <div className={Styles.EmptyDisplay}>{emptyTitle}</div>;
};

export default EmptyDisplay;
