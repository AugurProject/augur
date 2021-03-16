import React, { useEffect, useState, useMemo } from 'react';
import ButtonStyles from './buttons.styles.less';
import classNames from 'classnames';
import { useAppStatusStore } from '../stores/app-status';
import { generateTooltip } from '../common/labels';
import { ButtonComps, useUserStore } from '@augurproject/augur-comps';
import Styles from './slippage.styles.less';
import ChevronFlip from './chevron-flip';

const { TinyButton } = ButtonComps;

export const Slippage = () => {
  const {
    settings: { slippage },
    actions: { updateSettings },
  } = useAppStatusStore();
  const { account } = useUserStore();
  const [showSelection, setShowSelection] = useState(false);

  const isSelectedArray = useMemo(() => {
    let output = [false, false, false, false, false];
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
      case '3': {
        output[3] = true;
        break;
      }
      default: {
        output[4] = true;
        break;
      }
    }
    return output;
  }, [slippage]);
  const [customVal, setCustomVal] = useState(
    isSelectedArray[4] ? slippage : ''
  );
  const [error, setError] = useState('');

  return (
    <section className={Styles.Slippage}>
      <label onClick={() => setShowSelection(!showSelection)}>
        Slippage Tolerance
        {generateTooltip(
          'The maximum percentage the price can change and still have your transaction succeed.',
          'slippageToleranceInfo'
        )}
        <span>{slippage}%</span>
        <ChevronFlip pointDown={showSelection} />
      </label>
      {showSelection && (
        <ul>
          <div>
            <li>
              <TinyButton
                text="0.5%"
                action={() => {
                  updateSettings({ slippage: '0.5' }, account);
                  setCustomVal('');
                  setError('');
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
                  setError('');
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
                  setError('');
                }}
                selected={isSelectedArray[2]}
                className={ButtonStyles.TinyTransparentButton}
              />
            </li>
            <li>
              <TinyButton
                text="3%"
                action={() => {
                  updateSettings({ slippage: '3' }, account);
                  setCustomVal('');
                  setError('');
                }}
                selected={isSelectedArray[3]}
                className={ButtonStyles.TinyTransparentButton}
              />
            </li>
          </div>
          <li>
            <div
              className={classNames({
                [Styles.Selected]: isSelectedArray[4] === true,
              })}
            >
              <input
                type="number"
                step="0.1"
                value={customVal}
                onChange={(v) => {
                  const val = v.target.value;
                  setCustomVal(val);
                  if (
                    !(
                      val === '' ||
                      isNaN(Number(val)) ||
                      Number(val) > 1000 ||
                      Number(val) <= 0
                    )
                  ) {
                    setError('');
                    updateSettings({ slippage: val }, account);
                  } else if (val === '') {
                    setError('');
                    updateSettings({ slippage: 0 }, account);
                  } else {
                    setError('Enter a valid slippage percentage');
                  }
                }}
                placeholder="Custom"
                max="1000"
                min="0.1"
              />
            </div>
          </li>
        </ul>
      )}
      {error && <span>{error}</span>}
    </section>
  );
};
