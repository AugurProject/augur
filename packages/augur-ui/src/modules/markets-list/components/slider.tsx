import React, { useState } from 'react';
import Styles from 'modules/markets-list/components/slider.styles.less';
import { LeftArrow, RightArrow } from 'modules/common/icons';
import classNames from 'classnames';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { useWindowDimensions } from 'utils/use-window-dimensions';

interface SliderButton {
  text: string;
  link?: string;
  action: Function;
  secondary?: boolean;
}

interface SliderImage {
  mobile: string;
  tablet: string;
  medium: string;
  big: string;
}

interface SliderImages {
  alignment: 'left' | 'center' | 'right' | string;
  image: SliderImage | string;
  text?: string;
  altText?: string;
  button?: SliderButton;
  noOverlay?: boolean;
}

interface SliderProps {
  images: SliderImages[];
}

interface ArrowProps {
  action: Function;
  direction: 'left' | 'right';
}

const Arrow = ({ action, direction }: ArrowProps) => {
  return (
    <button
      onClick={() => action()}
      className={classNames({
        [Styles.LeftArrow]: direction === 'left',
        [Styles.RightArrow]: direction === 'right',
      })}
    >
      {direction === 'left' ? LeftArrow : RightArrow}
    </button>
  );
};

export const Slider = ({ images }: SliderProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [transition, setTransition] = useState(0.45);
  const { width } = useWindowDimensions();

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

  const whichBreakpointToChoose = width => {
    if (width <= 767) return 'mobile';
    if (width > 767 && width <= 1023) return 'tablet';
    if (width > 1024 && width <= 1199) return 'medium';
    return 'big';
  };

  return (
    <div className={Styles.SliderContainer}>
      <div
        className={Styles.Slider}
        style={{
          transition: `transform ${transition}s ease`,
          transform: `translateX(${-activeSlide * 100}%)`,
        }}
      >
        {images.map(
          ({ alignment, image, text, altText, button, noOverlay }) => {
            {
              const responsiveImage = image[whichBreakpointToChoose(width)];

              return noOverlay ? (
                <button key={text} onClick={button.action}>
                  <img
                    src={typeof image === 'string' ? image : responsiveImage}
                    alt={altText}
                  />
                </button>
              ) : (
                <div
                  key={text}
                  style={{
                    backgroundImage: `url(${
                      typeof image === 'string' ? image : responsiveImage
                    })`,
                  }}
                >
                  <div
                    className={classNames({
                      [Styles.LeftAligned]: alignment === 'left',
                      [Styles.RightAligned]: alignment === 'right',
                    })}
                  >
                    <h2>{text}</h2>
                    {button && button.secondary ? (
                      <SecondaryButton
                        text={button.text}
                        action={button.action}
                      />
                    ) : (
                      <PrimaryButton
                        text={button.text}
                        action={button.action}
                      />
                    )}
                  </div>
                </div>
              );
            }
          }
        )}
      </div>
      <Arrow action={prevSlide} direction="left" />
      <Arrow action={nextSlide} direction="right" />
    </div>
  );
};
