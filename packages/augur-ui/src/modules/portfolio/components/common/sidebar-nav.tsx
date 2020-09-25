import React, { useState } from 'react';
import ButtonStyles from 'modules/common/buttons.styles.less';
import Styles from 'modules/portfolio/components/common/sidebar-nav.styles.less';
import { Filter, MobileNavCloseIcon, SportsbookFilter } from 'modules/common/icons';
import classNames from 'classnames';
import { PillSelection } from 'modules/common/selection';
import { RadioBarGroup } from 'modules/common/form';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { THEMES } from 'modules/common/constants';

export enum OPTIONTYPE {
  PILLS = 'pills',
  RADIO = 'radio',
}

export interface TabsProps {
  key: string;
  value: string;
  label: string;
  num: number;
}

interface SortingProps {
  label: string;
  value: string;
  comp: Function; // comparator
}

interface RadioProps {
  sectionTitle: string;
  options: string[];
}

interface PillContentProps {
  pillTitle: string;
  pillContent: RadioProps[];
}

interface OptionsProps {
  action?: Function;
  type: OPTIONTYPE;
  sectionTitle: string;
  options: PillContentProps[] | SortingProps[] | TabsProps[];
  selected?: number;
}

interface SidebarNavProps {
  headerTitle: string;
  disabled?: boolean;
  filters?: OptionsProps[];
}

const SidebarNav = ({
  headerTitle = 'Filters',
  disabled,
  filters,
}: SidebarNavProps) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { theme } = useAppStatusStore();
  const isTrading = theme === THEMES.TRADING;

  return (
    <div className={Styles.Sidebar}>
      <button
        onClick={() => setShowSidebar(true)}
        className={classNames(ButtonStyles.FilterButton, {
          [Styles.SportsbookFilterIcon]: !isTrading
        })}
        disabled={disabled}
      >
        {headerTitle}
        {isTrading ? Filter : SportsbookFilter}
      </button>
      <div
        className={classNames(Styles.SidebarMenu, {
          [Styles.ShowSidebar]: showSidebar,
        })}
      >
        <div>
          <span>{headerTitle}</span>
          <button onClick={() => setShowSidebar(false)}>
            <MobileNavCloseIcon />
          </button>
        </div>
        <div>
          {filters && filters.map(({ type, sectionTitle, options, selected, action }, index) => {
            return (
              <div key={index}>
                <span>{sectionTitle}</span>
                {type === OPTIONTYPE.RADIO && (
                  <RadioBarGroup
                    radioButtons={options.map(({key, value, label, num, comp}, index) => ({
                      checked: false,
                      value: value,
                      header: num !== undefined ? `${label} (${num})` : label,
                      id: index,
                    }))}
                    defaultSelected={options[0].value}
                    onChange={selected => {action(selected)}}
                  />
                )}
                {type === OPTIONTYPE.PILLS && options && (
                  <>
                    <PillSelection
                      defaultSelection={0}
                      onChange={selectedPill => action(selectedPill)}
                      options={options.map(({ pillTitle }, index) => ({
                        label: pillTitle,
                        id: index,
                      }))}
                      large
                    />
                    {options[selected].pillContents.map(({ sectionTitle, options }, index) => {
                      return (
                        <div key={index}>
                          <span>{sectionTitle}</span>
                          <RadioBarGroup
                            radioButtons={options.map(({key, value, label, num, comp}, index) => ({
                              checked: false,
                              value: value,
                              header: label,
                              id: index,
                            }))}
                            defaultSelected={options[0].value}
                            onChange={selected => {action(selected)}}
                          />
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            );
          })}
          {/*TODO: Find a generic way to apply all the filters only after clicking the apply button*/}
          {/*<div className={Styles.ApplyButton}>*/}
          {/*  <SecondaryButton text="Apply" action={() => {}} />*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
