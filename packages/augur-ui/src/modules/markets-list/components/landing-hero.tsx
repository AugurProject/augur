import React from 'react';

import Styles from 'modules/markets-list/components/landing-hero.styles.less';
import { PrimaryButton, ExternalLinkButton } from 'modules/common/buttons';

export interface LandingHeroProps {
  showSignup: Function;
}

export const LandingHero = (props: LandingHeroProps) => {
  return (
    <section className={Styles.LandingHero}>
      <img src="images/BGImages.png" />
      <div>
        <span>The world’s most accessible, no-limit betting platform</span>
        <span>
          Bet how much you want, from anywhere in the world, on sports,
          politics, finance and more.
        </span>
        <div>
          <PrimaryButton
            text="Sign up to start trading"
            action={props.showSignup}
          />
          <ExternalLinkButton
            light
            URL={'http://www.augur.net'}
            label={'Learn more on augur.net'}
          />
        </div>
      </div>
      <div>
        <img src="images/Hero_cards.png" />
      </div>
    </section>
  );
};
