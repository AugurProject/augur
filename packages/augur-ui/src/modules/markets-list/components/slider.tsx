import React, { useState } from 'react';
import Styles from 'modules/markets-list/components/slider.styles.less';
import { LeftArrow, RightArrow } from 'modules/common/icons';
import classNames from 'classnames';
import { PrimaryButton } from 'modules/common/buttons';

interface SliderButton {
  text: string;
  link: string;
}

interface SliderImages {
  alignment: 'left'|'center'|'right';
  image: string;
  text: string;
  button?: SliderButton;
}

interface SliderProps {
  images: SliderImages[];
}

interface ArrowProps {
  action: Function;
  direction: "left"|"right";
}

const Arrow = ({action, direction}: ArrowProps) => {
  return (
    <button onClick={() => action()} className={classNames({
      [Styles.LeftArrow]: direction === 'left',
      [Styles.RightArrow]: direction === 'right',
    })}>
      {direction === 'left' ? LeftArrow : RightArrow}
    </button>
  )
};

export const Slider = ({images}: SliderProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [transition, setTransition] = useState(0.45);

  const prevSlide = () => {
    if (activeSlide === 0) {
      setTransition(0.45);
      setActiveSlide(images.length - 1);
      return;
    }

    setTransition(0.75);
    setActiveSlide(activeSlide - 1);
  };

  const nextSlide = () => {
    if (activeSlide === images.length - 1) {
      setTransition(0.45);
      setActiveSlide(0);
      return;
    }

    setTransition(0.75);
    setActiveSlide(activeSlide + 1);
  };

  return (
    <div className={Styles.SliderContainer}>
      <div className={Styles.Slider} style={{transition: `transform ${transition}s ease`, transform: `translateX(${-activeSlide * 100}%)`}}>
        {images.map(({alignment, image, text, button}) => (
          <div key={`${text}`} style={{backgroundImage: `url(${image})`}}>
            <div className={classNames({
              [Styles.LeftAligned]: alignment === 'left',
              [Styles.RightAligned]: alignment === 'right',
            })}>
              <h2>{text}</h2>
              {button && (
                <PrimaryButton URL={button.link} text={button.text} action={() => {}} />
              )}
            </div>
          </div>
        ))}
      </div>
      <Arrow action={prevSlide} direction='left' />
      <Arrow action={nextSlide} direction='right' />
    </div>
  )
};
