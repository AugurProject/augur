import React from 'react';

import Styles from 'modules/markets-list/components/landing-hero.styles.less';
import { ExternalLinkButton, PrimaryButton } from 'modules/common/buttons';
import { MODAL_SIGNUP, THEMES } from 'modules/common/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { Slider } from 'modules/markets-list/components/slider';
import Image from '../../../assets/images/landing-slider-img.png';
import classNames from 'classnames';

const images = [{
  alignment: 'center',
  image: Image,
  text: 'No Limits. Lower Fees.\nBet on anything you want.',
  button: {
    text: 'Sign up to start betting',
    link: 'https://google.com/'
  }
}, {
  alignment: 'left',
  image: Image,
  text: 'No Limits. Lower Fees.\nBet on anything you want. 2',
  button: {
    text: 'Sign up to start betting',
    link: 'https://google.com/'
  }
}, {
  alignment: 'right',
  image: Image,
  text: 'No Limits. Lower Fees.\nBet on anything you want. 3',
  button: {
    text: 'Sign up to start betting',
    link: 'https://google.com/'
  }
}];

export const LandingHero = () => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  const { theme } = useAppStatusStore();

  return (
    <>
      {theme === THEMES.TRADING
        ? (
          <section className={Styles.LandingHero}>
            <div>
              <h1>Augur v2<br /><span>Your global, no-limit betting platform</span></h1>
              <span>
                Bet how much you want, on sports, finance, world events and more.
              </span>
              <div>
                <PrimaryButton
                  text="Sign up to start trading"
                  action={() => setModal({ type: MODAL_SIGNUP })}
                />
                <ExternalLinkButton
                  light
                  URL="http://www.augur.net"
                  label="Learn more on augur.net"
                />
              </div>
            </div>
            <div>
              <img src="images/hero-primary.png" />
              <img src="images/hero-secondary-bitcoin.png" />
              <img src="images/hero-tertiary.png" />
            </div>
          </section>
        ) : (
          <section className={Styles.LandingHeroSlider}>
            <Slider images={images} />
            <div style={{backgroundImage: `url(${images[0].image})`}}>
              <div className={classNames({
                [Styles.LeftAligned]: images[0].alignment === 'left',
                [Styles.RightAligned]: images[0].alignment === 'right',
              })}>
                <h2>{images[0].text}</h2>
                {images[0].button && (
                  <PrimaryButton URL={images[0].button.link} text={images[0].button.text} action={() => {}} />
                )}
              </div>
            </div>
          </section>
        )}
    </>
  );
};
