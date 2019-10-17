import React, { useEffect } from 'react';
import classNames from 'classnames';

import { QuestionIcon } from 'modules/common/icons';
import { ExternalLinkButton } from 'modules/common/buttons';

import Styles from 'modules/app/components/help-resources.styles.less';

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
];

export const HelpResources = ({
  isHelpMenuOpen,
  updateHelpMenuState,
  updateConnectionTray
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
      onClick={(event) => event.stopPropagation()}
    >
      <span onClick={() => updateHelpMenuState(!isHelpMenuOpen)}>
        {QuestionIcon}
      </span>
      {isHelpMenuOpen && (
        <div>
          <span>popular help resources</span>
          {HELP_LINKS.map((helpLink, index) => (
            <span key={'helpLink_' + index}>
              <ExternalLinkButton
                light
                URL={helpLink.link}
                label={helpLink.label}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
