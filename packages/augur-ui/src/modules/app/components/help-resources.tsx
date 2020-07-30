import React, { useEffect } from 'react';
import classNames from 'classnames';

import { QuestionIcon } from 'modules/common/icons';
import { ExternalLinkButton } from 'modules/common/buttons';

import Styles from 'modules/app/components/help-resources.styles.less';
import {
  TRADING_TUTORIAL,
  HELP_CENTER,
  HELP_CENTER_ADD_FUNDS,
  HELP_CENTER_HOW_TO_TRADE,
  HELP_CENTER_HOW_TO_DISPUTE,
  DISCORD_LINK,
} from 'modules/common/constants';
import { MARKET } from 'modules/routes/constants/views';
import makeQuery from 'modules/routes/helpers/make-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';

interface HelpResourcesProps {
  isHelpMenuOpen: boolean;
  updateHelpMenuState: Function;
  updateConnectionTray: Function;
  isMobile: boolean;
  helpModal: Function;
}

const HELP_LINKS = [
  {
    label: 'view trading tutorial',
    showNonLink: true,
    customLink: {
      pathname: MARKET,
      search: makeQuery({
        [MARKET_ID_PARAM_NAME]: TRADING_TUTORIAL,
      }),
    },
  },
  {
    label: 'help center',
    link: HELP_CENTER,
  },
  {
    label: 'how to add funds',
    link: HELP_CENTER_ADD_FUNDS,
  },
  {
    label: 'how to trade',
    link: HELP_CENTER_HOW_TO_TRADE,
  },
  {
    label: 'how to dispute',
    link: HELP_CENTER_HOW_TO_DISPUTE,
  },
  {
    label: 'report a bug',
    link: 'https://github.com/AugurProject/augur/issues/new/choose',
  },
  {
    label: 'community support',
    link: DISCORD_LINK,
  },
];

export const HelpMenuList = () => {
  return (
    <span className={classNames(Styles.HelpMenuList)}>
      <li>popular help resources</li>
      {HELP_LINKS.filter(helpLink => helpLink.label !== 'view trading tutorial').map((helpLink, index) => (
        <li key={'helpLink_' + index} className={helpLink.className}>
          <ExternalLinkButton
            light
            URL={helpLink.link}
            label={helpLink.label}
            customLink={helpLink.customLink}
            showNonLink={helpLink.showNonLink}
            lightLink={helpLink.lightLink}
          />
        </li>
      ))}
    </span>
  );
};

interface HelpMenuProps {
  closeHelpMenu: Function;
}

export const HelpMenu = ({ closeHelpMenu }: HelpMenuProps) => {
  return (
    <div className={classNames(Styles.HelpMenu)}>
      <span>popular help resources</span>
      {HELP_LINKS.map((helpLink, index) => (
        <span key={'helpLink_' + index} className={helpLink.className}>
          <ExternalLinkButton
            light
            URL={helpLink.link}
            label={helpLink.label}
            customLink={helpLink.customLink}
            showNonLink={helpLink.showNonLink}
            lightLink={helpLink.lightLink}
            callback={closeHelpMenu}
          />
        </span>
      ))}
    </div>
  );
};

interface HelpIconProps {
  isHelpMenuOpen: boolean;
  updateHelpMenuState: Function;
}

export const HelpIcon = ({
  updateHelpMenuState,
  isHelpMenuOpen,
}: HelpIconProps) => {
  return (
    <div
      className={classNames(Styles.HelpIcon, {
        [Styles.Open]: isHelpMenuOpen,
      })}
      onClick={event => event.stopPropagation()}
    >
      <span onClick={() => updateHelpMenuState(!isHelpMenuOpen)}>
        {QuestionIcon}
      </span>
    </div>
  );
};

export const HelpResources = ({
  isHelpMenuOpen,
  updateHelpMenuState,
  updateConnectionTray,
  isMobile,
  helpModal
}: HelpResourcesProps) => {
  useEffect(() => {
    if (isHelpMenuOpen) {
      updateConnectionTray(false);
    }
  }, [isHelpMenuOpen]);

  return (
    <div
      className={classNames(Styles.HelpResources, {
        [Styles.Open]: isHelpMenuOpen,
      })}
      onClick={event => event.stopPropagation()}
    >
      <HelpIcon
        updateHelpMenuState={isMobile ? helpModal : updateHelpMenuState}
        isHelpMenuOpen={isHelpMenuOpen}
      />
      {isHelpMenuOpen && (
        <HelpMenu closeHelpMenu={() => updateHelpMenuState(false)} />
      )}
    </div>
  );
};
