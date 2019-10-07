import React, { useState } from 'react';
import classNames from 'classnames';

import { QuestionIcon } from 'modules/common/icons';
import { ExternalLinkButton } from 'modules/common/buttons';

import Styles from 'modules/app/components/help-resources.styles.less';

interface HelpResourcesProps {}

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

export const HelpResources = (props: HelpResourcesProps) => {
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);

  return (
    <div
      className={classNames(Styles.HelpResources, {
        [Styles.Open]: showHelpDropdown,
      })}
    >
      <span onClick={() => setShowHelpDropdown(() => !showHelpDropdown)}>
        {QuestionIcon}
      </span>
      {showHelpDropdown && (
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
