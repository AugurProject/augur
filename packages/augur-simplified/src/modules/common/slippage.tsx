import React, { useEffect, useState, useMemo } from 'react';
import ButtonStyles from './buttons.styles.less';
import classNames from 'classnames';
import { useAppStatusStore } from '../stores/app-status';
import { generateTooltip } from '../common/labels';
import { ButtonComps } from '@augurproject/augur-comps';
import Styles from './slippage.styles.less';

const { TinyButton } = ButtonComps;

export const Slippage = () => {
  const {
    settings: { slippage },
    actions: { updateSettings },
  } = useAppStatusStore();
  const [customVal, setCustomVal] = useState('');
  const [showSelection, setShowSelection] = useState(false);

  const isSelectedArray = useMemo(() => {
    let output = [false, false, false, false];
    switch (slippage) {
      case '0.5': {
        output[0] = true;
        break;
      }
      case '1': {
        output[1] = true;
        break;
      }
      case '2': {
        output[2] = true;
        break;
      }
      default: {
        output[3] = true;
        break;
      }
    }
    return output;
  }, [slippage]);

  useEffect(() => {
    if (customVal === '' && !['0.5', '1', '2'].includes(slippage)) {
      setCustomVal(slippage);
    }
  }, [slippage, customVal]);

  return (
    <section className={Styles.Slippage}>
      <label>
        Slippage Tolerance
        {generateTooltip(
          'The maximum percentage the price can change and still have your transaction succeed.',
          'slippageToleranceInfo'
        )}
      </label>
      {showSelection && (
        <ul>
          <li>
            <TinyButton
              text="0.5%"
              action={() => {
                updateSettings({ slippage: '0.5' }, account);
                setCustomVal('');
              }}
              selected={isSelectedArray[0]}
              className={ButtonStyles.TinyTransparentButton}
            />
          </li>
          <li>
            <TinyButton
              text="1%"
              action={() => {
                updateSettings({ slippage: '1' }, account);
                setCustomVal('');
              }}
              selected={isSelectedArray[1]}
              className={ButtonStyles.TinyTransparentButton}
            />
          </li>
          <li>
            <TinyButton
              text="2%"
              action={() => {
                updateSettings({ slippage: '2' }, account);
                setCustomVal('');
              }}
              selected={isSelectedArray[2]}
              className={ButtonStyles.TinyTransparentButton}
            />
          </li>
          <li>
            <div
              className={classNames({
                [Styles.Selected]: isSelectedArray[3],
              })}
            >
              <input
                type="number"
                step="0.1"
                value={customVal}
                onChange={(v) => {
                  setCustomVal(v.target.value);
                }}
                onBlur={() => {
                  if (customVal !== slippage) {
                    if (
                      customVal === '' ||
                      isNaN(Number(customVal)) ||
                      Number(customVal) > 1000 ||
                      Number(customVal) <= 0
                    ) {
                      setCustomVal(slippage);
                    } else {
                      updateSettings({ slippage: customVal }, account);
                    }
                  }
                }}
                placeholder="custom"
                max="1000"
                min="0.1"
              />
              <span>%</span>
            </div>
          </li>
        </ul>
      )}
    </section>
  );
};
