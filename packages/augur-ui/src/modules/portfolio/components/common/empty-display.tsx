import React, { ReactNode } from 'react';

import Styles from 'modules/portfolio/components/common/empty-display.styles.less';
import { SearchIcon } from 'modules/common/icons';

export interface EmptyDisplayProps {
  filterLabel: string;
  selectedTab: string;
  search: string;
  title?: string;
  emptyTitle?: string;
  emptyText?: string;
  icon?: any;
  button?: ReactNode;
  searchObject?: string;
  notTradingEmptyTitle?: string;
  searchQuery?: string;
  actionable?: any;
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
  searchObject = 'markets',
  notTradingEmptyTitle,
  searchQuery = 'keyword',
  actionable,
}: EmptyDisplayProps) => {
  let tradingEmptyTitle = `No ${selectedTab} ${filterLabel.toLowerCase()}`;
  notTradingEmptyTitle = notTradingEmptyTitle || `No ${title}`;

  let defaultEmptyText = `You don't have any ${selectedTab.toLowerCase()} ${filterLabel.toLowerCase()} yet!`;

  const searchActive = search !== '' && search !== undefined;
  if (searchActive) {
    tradingEmptyTitle = `No results found for '${search}'`;
    notTradingEmptyTitle = `No ${searchObject} found`;
    emptyText = `Try a different keyword.`;
  } else if (emptyTitle) {
    notTradingEmptyTitle = emptyTitle;
  }

  return (
    <div className={Styles.EmptyDisplay}>
      <span>{searchActive ? SearchIcon : icon}</span>
      <span>{tradingEmptyTitle}</span>
      <span>{notTradingEmptyTitle}</span>
      <span>
        {emptyText ? emptyText : defaultEmptyText}
        {actionable && (
          <button onClick={actionable.action} className={Styles.actionable}>
            {actionable.text}
          </button>
        )}
      </span>
      {button ? button : null}
    </div>
  );
};

export default EmptyDisplay;
