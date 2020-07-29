import React from 'react';
import classNames from 'classnames';
import {
  RadioCardGroup,
  TextInput,
  RadioBarGroup,
  CategoryMultiSelect,
} from 'modules/common/form';
import {
  Header,
  Subheaders,
  LineBreak,
  NumberedList,
  SmallSubheaders,
  QuestionBuilder,
  DateTimeSelector,
  ResolutionRules,
  TemplateBanners,
  InputHeading,
} from 'modules/create-market/components/common';
import {
  YES_NO,
  SCALAR,
  CATEGORICAL,
  DESIGNATED_REPORTER_SELF,
  DESIGNATED_REPORTER_SPECIFIC,
} from 'modules/common/constants';
import { NewMarket, Universe } from 'modules/types';
import {
  DESCRIPTION_PLACEHOLDERS,
  DESIGNATED_REPORTER_ADDRESS,
  CATEGORIES,
  OUTCOMES,
  MARKET_COPY_LIST,
  DEFAULT_TICK_SIZE,
} from 'modules/create-market/constants';
import { checkValidNumber } from 'modules/common/validations';
import { setCategories } from 'modules/create-market/set-categories';
import Styles from 'modules/create-market/components/form-details.styles.less';
import { createBigNumber } from 'utils/create-big-number';
import {
  hasNoTemplateCategoryChildren,
  hasNoTemplateCategoryTertiaryChildren,
  hasAutoFillCategory,
} from 'modules/create-market/get-template';
import { YesNoMarketIcon, CategoricalMarketIcon, ScalarMarketIcon } from 'modules/common/icons';
import { TemplateInputType } from '@augurproject/templates';

interface FormDetailsProps {
  newMarket: NewMarket;
  currentTimestamp: number;
  onChange: Function;
  onError: Function;
  isTemplate?: boolean;
  universe: Universe;
}

interface FormDetailsState {
  dateFocused: Boolean;
  timeFocused: Boolean;
}

export default class FormDetails extends React.Component<
  FormDetailsProps,
  FormDetailsState
> {
  state = {
    dateFocused: false,
    timeFocused: false,
  };

  render() {
    const {
      newMarket,
      currentTimestamp,
      onChange,
      onError,
      isTemplate,
    } = this.props;

    const {
      outcomes,
      marketType,
      setEndTime,
      hour,
      minute,
      meridiem,
      description,
      scalarDenomination,
      minPrice,
      maxPrice,
      detailsText,
      categories,
      designatedReporterAddress,
      designatedReporterType,
      validations,
      timezone,
      endTimeFormatted,
      template,
    } = newMarket;

    const tickSize =
      isTemplate && template.tickSize ? template.tickSize : newMarket?.tickSize || DEFAULT_TICK_SIZE;

    let resolutionTimeSubheader = null
    if (isTemplate) {
      const estInput = template.inputs.find(i => i.type === TemplateInputType.ESTDATETIME);
      if (estInput) {
        resolutionTimeSubheader = `This templated market has a predefined event expiration date time, which is ${estInput.hoursAfterEst} hours after estimated schedule start time.`
      }
      const dateStart = template.inputs.find(i => i.type === TemplateInputType.DATEYEAR && i.daysAfterDateStart);
      if (dateStart && dateStart.daysAfterDateStart) {
        resolutionTimeSubheader = `This templated market has a predefined event expiration date, which is ${dateStart.daysAfterDateStart} days after start date in market question.`
      }
      const monthStart = template.inputs.find(i => i.eventExpEndNextMonth);
      if (monthStart) {
        resolutionTimeSubheader = `This templated market has a predefined event expiration date, which is one month after date set in market question.`
      }
      const marketClose = template.inputs.find(i => i.type === TemplateInputType.DATEYEAR_CLOSING);
      if (marketClose) {
        resolutionTimeSubheader = `This templated market has a predefined event expiration date and time, which is based on the exchange in the market question.`
      }
    }
    return (
      <div
        className={classNames(Styles.FormDetails, {
          [Styles.Template]: isTemplate,
        })}
      >
        <div>
          <Header text="Market details" />
          {!isTemplate && (
            <>
              <Subheaders
                header="Market type"
                link
                copyType={MARKET_COPY_LIST.MARKET_TYPE}
                subheader="Market types vary based on the amount of possible outcomes."
              />
              <RadioCardGroup
                onChange={(value: string) => onChange('marketType', value)}
                defaultSelected={marketType}
                radioButtons={[
                  {
                    value: YES_NO,
                    header: 'Yes / No',
                    icon: YesNoMarketIcon,
                    description:
                      'There are two possible outcomes: “Yes” or “No”',
                  },
                  {
                    value: CATEGORICAL,
                    header: 'Multiple Choice',
                    icon: CategoricalMarketIcon,
                    description:
                      'There are up to 7 possible outcomes: “A”, “B”, “C” etc ',
                  },
                  {
                    value: SCALAR,
                    header: 'Scalar',
                    icon: ScalarMarketIcon,
                    description:
                      'A range of numeric outcomes: “USD range” between “1” and “100”.',
                  },
                ]}
              />
            </>
          )}
          {isTemplate && (
            <QuestionBuilder
              newMarket={newMarket}
              currentTimestamp={currentTimestamp}
              onChange={onChange}
              isAfter={this.props.universe.maxMarketEndTime}
            />
          )}
          {!isTemplate && (
            <>
              <DateTimeSelector
                setEndTime={setEndTime}
                onChange={onChange}
                validations={validations}
                hour={hour}
                minute={minute}
                meridiem={meridiem}
                timezone={timezone}
                currentTimestamp={currentTimestamp}
                endTimeFormatted={endTimeFormatted}
                uniqueKey={'nonTemplateRes'}
                isAfter={this.props.universe.maxMarketEndTime}
              />

              <InputHeading
                name={'question'}
                copyType={MARKET_COPY_LIST.MARKET_QUESTION}
                heading={'Market question'}
                subHeading={'What do you want people to predict?'}
                listItems={[
                  'If entering a date and time in the market question , enter a date and time in the UTC-0 timezone.',
                  'If the winning outcome will be determined using a specific resolution source, it is recommended to enter the source URL or its full name in the market question.'
                ]}
              />

              <TextInput
                type="textarea"
                placeholder={DESCRIPTION_PLACEHOLDERS[marketType]}
                onChange={(value: string) => onChange('description', value)}
                rows="3"
                value={description}
                errorMessage={
                  validations.description &&
                  validations.description.charAt(0).toUpperCase() +
                    validations.description.slice(1).toLowerCase()
                }
              />
              <TemplateBanners categories={newMarket.categories} />
            </>
          )}

          {marketType === CATEGORICAL && !isTemplate && (
            <>
              <Subheaders
                header="Outcomes"
                subheader="List the outcomes people can choose from."
              />
              <NumberedList
                initialList={outcomes.map(outcome => {
                  return {
                    value: outcome,
                    editable: true,
                  };
                })}
                minShown={2}
                maxList={7}
                placeholder={'Enter outcome'}
                updateList={(value: string[]) => onChange(OUTCOMES, value)}
                errorMessage={validations.outcomes}
              />
            </>
          )}

          {marketType === SCALAR && (
            <>
              <Subheaders
                header="Unit of measurement"
                copyType={MARKET_COPY_LIST.UNIT_OF_MEASURMENT}
                subheader="Choose a denomination for the range."
                link
              />
              <TextInput
                placeholder="Denomination"
                onChange={(value: string) =>
                  onChange('scalarDenomination', value)
                }
                disabled={isTemplate && newMarket.template.denomination}
                value={scalarDenomination}
                errorMessage={validations.scalarDenomination}
              />
              <Subheaders
                header="Numeric range"
                copyType={MARKET_COPY_LIST.NUMERIC_RANGE}
                subheader="Choose the min and max values of the range."
                link
              />
              <section>
                <TextInput
                  type="number"
                  placeholder="Enter Min Range value"
                  onChange={(value: string) => {
                    onChange('minPrice', value);
                    if (!checkValidNumber(value))
                      onChange('minPriceBigNumber', createBigNumber(value));
                    onError('maxPrice', '');
                  }}
                  value={minPrice}
                  errorMessage={validations.minPrice}
                />
                <span>to</span>
                <TextInput
                  type="number"
                  placeholder="Enter Max Range value"
                  onChange={(value: string) => {
                    onChange('maxPrice', value);
                    if (!checkValidNumber(value))
                      onChange('maxPriceBigNumber', createBigNumber(value));
                    onError('minPrice', '');
                  }}
                  trailingLabel={
                    scalarDenomination !== ''
                      ? scalarDenomination
                      : 'Denomination'
                  }
                  hideTrailingOnMobile
                  value={maxPrice}
                  errorMessage={validations.maxPrice}
                />
              </section>
              <Subheaders
                header="Precision"
                copyType={MARKET_COPY_LIST.PRECISION}
                subheader="What is the smallest quantity of the denomination users can choose, e.g: “0.1”, “1”, “10”."
                link
              />
              <TextInput
                type="number"
                placeholder="0"
                onChange={(value: string) => onChange('tickSize', value)}
                trailingLabel={
                  scalarDenomination !== ''
                    ? scalarDenomination
                    : 'Denomination'
                }
                value={tickSize}
                disabled={isTemplate && template.tickSize}
                errorMessage={validations.tickSize}
              />
            </>
          )}
          <Subheaders
            header="Market category"
            subheader="Categories help users to find your market on Augur."
          />
          <CategoryMultiSelect
            initialSelected={categories}
            sortedGroup={setCategories}
            updateSelection={categoryArray =>
              onChange(CATEGORIES, categoryArray)
            }
            errorMessage={validations.categories}
            disableCategory={isTemplate}
            disableSubCategory={
              isTemplate && (hasAutoFillCategory(template.inputs, 1) ||
              !hasNoTemplateCategoryChildren(newMarket.navCategories[0]))
            }
            disableTertiaryCategory={
              isTemplate && (hasAutoFillCategory(template.inputs, 2) ||
              !hasNoTemplateCategoryTertiaryChildren(
                newMarket.navCategories[0],
                newMarket.navCategories[1]
              ))
            }
          />
        </div>
        <LineBreak />
        <div>
          <Header text="Resolution information" />

          {isTemplate && (
            <DateTimeSelector
              setEndTime={setEndTime}
              onChange={onChange}
              currentTimestamp={currentTimestamp}
              validations={validations}
              hour={hour}
              minute={minute}
              meridiem={meridiem}
              timezone={timezone}
              endTimeFormatted={endTimeFormatted}
              uniqueKey={'templateRes'}
              isAfter={this.props.universe.maxMarketEndTime}
              subheader={resolutionTimeSubheader}
              disabled={!!resolutionTimeSubheader}
            />
          )}

          {isTemplate && (
            <ResolutionRules newMarket={newMarket} onChange={onChange} />
          )}

          {!isTemplate && (
            <>
              <InputHeading
                name={'resolution'}
                heading={'Resolution details'}
                copyType={MARKET_COPY_LIST.RESOLUTION_DETAILS}
                subHeading={'Describe what users need to know to determine the outcome of the event.'}
                listItems={[
                  'If entering a date and time in resolution details , enter a date and time in the UTC-0 timezone.',
                  'If using a resolution source in the resolution details it must match and not contradict what is used in the market question.',
                  'A backup resolution source can be listed in the resolution details in addition to the primary resolution source.'
                ]}
              />
              <TextInput
                type="textarea"
                placeholder="Describe how the event should be resolved under different scenarios."
                rows="3"
                value={detailsText}
                onChange={(value: string) => onChange('detailsText', value)}
              />
            </>
          )}

          <Subheaders
            header="Designated reporter"
            subheader="The person assigned to report the winning outcome of the event (within 24 hours after Reporting Start Time)."
            link
            copyType={MARKET_COPY_LIST.DESIGNATED_REPORTER}
          />
          <RadioBarGroup
            radioButtons={[
              {
                header: 'Myself',
                value: DESIGNATED_REPORTER_SELF,
              },
              {
                header: 'Someone else',
                value: DESIGNATED_REPORTER_SPECIFIC,
                expandable: true,
                placeholder: 'Enter wallet address',
                textValue: designatedReporterAddress,
                onTextChange: (value: string) =>
                  onChange('designatedReporterAddress', value),
                errorMessage: validations.designatedReporterAddress,
              },
            ]}
            defaultSelected={designatedReporterType}
            onChange={(value: string) => {
              if (value === DESIGNATED_REPORTER_SELF) {
                onChange(DESIGNATED_REPORTER_ADDRESS, '');
                onError(DESIGNATED_REPORTER_ADDRESS, '');
              }
              onChange('designatedReporterType', value);
            }}
          />
        </div>
      </div>
    );
  }
}
