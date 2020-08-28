import React, { useState } from 'react';
import ButtonStyles from 'modules/common/buttons.styles.less';
import Styles from 'modules/portfolio/components/common/sidebar-nav.styles.less';
import { Filter, XIcon } from 'modules/common/icons';
import classNames from 'classnames';
import { PillSelection } from 'modules/common/selection';
import { RadioBarGroup } from 'modules/common/form';
import { SecondaryButton } from 'modules/common/buttons';

export enum OPTIONTYPE {
  PILLS = 'pills',
  RADIO = 'radio',
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
  options: string[] | PillContentProps[];
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

  return (
    <div className={Styles.Sidebar}>
      <button
        onClick={() => setShowSidebar(true)}
        className={ButtonStyles.FilterButton}
        disabled={disabled}
      >
        {headerTitle}
        {Filter}
      </button>
      <div
        className={classNames(Styles.SidebarMenu, {
          [Styles.ShowSidebar]: showSidebar,
        })}
      >
        <div>
          <span>{headerTitle}</span>
          <button onClick={() => setShowSidebar(false)}>{XIcon}</button>
        </div>
        <div>
          {filters &&
            filters.map(({ type, sectionTitle, options, selected, action }) => {
              return (
                <div>
                  <span>{sectionTitle}</span>
                  {type === OPTIONTYPE.RADIO && (
                    <RadioBarGroup
                      radioButtons={options.map((option, index) => ({
                        checked: false,
                        value: option,
                        header: option,
                        id: index,
                      }))}
                      defaultSelected={options[0]}
                      onChange={selected => {console.log(selected)}}
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
                      {options[selected].pillContents.map(({ sectionTitle, options }) => {
                        return (
                          <div>
                            <span>{sectionTitle}</span>
                            <RadioBarGroup
                              radioButtons={options.map((option, index) => ({
                                checked: false,
                                value: option,
                                header: option,
                                id: index,
                              }))}
                              defaultSelected={options[0]}
                              onChange={selected => {console.log(selected)}}
                            />
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              );
            })}
          <div>
            <SecondaryButton text="Apply" action={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
