import React, { useEffect } from 'react';
import classNames from 'classnames';

import { QuestionIcon } from 'modules/common/icons';
import { ExternalLinkButton } from 'modules/common/buttons';

import Styles from 'modules/app/components/help-resources.styles.less';
import { TRADING_TUTORIAL } from 'modules/common/constants';
import { MARKET } from 'modules/routes/constants/views';
import makeQuery from 'modules/routes/helpers/make-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';

interface HelpResourcesProps {
  isHelpMenuOpen: boolean;
  updateHelpMenuState: Function;
  updateConnectionTray: Function;
}

const HELP_LINKS = [
  {
    label: 'help center',
    link: 'https://docs.augur.net',
  },
  {
    label: 'how to add funds',
    link: 'https://docs.augur.net',
  },
  {
    label: 'how to trade',
    link: 'https://docs.augur.net',
  },
  {
    label: 'how to dispute',
    link: 'https://docs.augur.net',
  },
  {
    label: 'MAKE A TEST TRADE',
    className: Styles.hideOnTablet,
    customLink: {
      pathname: MARKET,
      search: makeQuery({
        [MARKET_ID_PARAM_NAME]: TRADING_TUTORIAL,
      }),
    },
  },
];

export const HelpResources = ({
  isHelpMenuOpen,
  updateHelpMenuState,
  updateConnectionTray,
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
      <span onClick={() => updateHelpMenuState(!isHelpMenuOpen)}>
        {QuestionIcon}
      </span>
      {isHelpMenuOpen && (
        <div>
          <span>popular help resources</span>
          {HELP_LINKS.map((helpLink, index) => (
            <span key={'helpLink_' + index} className={helpLink.className}>
              <ExternalLinkButton
                light
                URL={helpLink.link}
                label={helpLink.label}
                customLink={helpLink.customLink}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
