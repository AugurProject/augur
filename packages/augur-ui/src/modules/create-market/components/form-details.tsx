import React, { Component } from "react";
import classNames from 'classnames';
import moment, { Moment } from 'moment';

import {
  RadioCardGroup,
  FormDropdown,
  TextInput,
  DatePicker,
  TimeSelector,
  RadioBarGroup,
  TimezoneDropdown,
  CategoryMultiSelect,
} from 'modules/common/form';
import {
  Header,
  Subheaders,
  LineBreak,
  NumberedList,
  DateTimeHeaders,
  SmallSubheaders,
  QuestionBuilder,
  DateTimeSelector,
  ResolutionRules
} from 'modules/create-market/components/common';
import {
  YES_NO,
  SCALAR,
  CATEGORICAL,
  EXPIRY_SOURCE_GENERIC,
  EXPIRY_SOURCE_SPECIFIC,
  DESIGNATED_REPORTER_SELF,
  DESIGNATED_REPORTER_SPECIFIC,
} from 'modules/common/constants';
import { NewMarket } from 'modules/types';
import { RepLogoIcon } from 'modules/common/icons';
import {
  DESCRIPTION_PLACEHOLDERS,
  DESCRIPTION,
  DESIGNATED_REPORTER_ADDRESS,
  EXPIRY_SOURCE,
  CATEGORIES,
  OUTCOMES,
  MARKET_TYPE_NAME,
} from 'modules/create-market/constants';
import { formatDate, convertUnixToFormattedDate } from 'utils/format-date';
import { checkValidNumber } from 'modules/common/validations';
import { setCategories } from 'modules/create-market/set-categories';
import Styles from 'modules/create-market/components/form-details.styles.less';
import { createBigNumber } from 'utils/create-big-number';
import { hasNoTemplateCategoryChildren } from "modules/create-market/get-template";

interface FormDetailsProps {
  updateNewMarket: Function;
  newMarket: NewMarket;
  currentTimestamp: number;
  onChange: Function;
  onError: Function;
  isTemplate?: boolean;
}

interface FormDetailsState {
  dateFocused: Boolean;
  timeFocused: Boolean;
}

interface TimeSelectorParams {
  hour?: string;
  minute?: string;
  meridiem?: string;
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
      updateNewMarket,
    } = this.props;
    const s = this.state;

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
      tickSize,
      detailsText,
      categories,
      expirySource,
      backupSource,
      expirySourceType,
      designatedReporterAddress,
      designatedReporterType,
      validations,
      timezone,
      endTimeFormatted,
    } = newMarket;

    return (
      <div
        className={classNames(Styles.FormDetails, {
          [Styles.Template]: isTemplate,
        })}
      >
        <div>
          <Header text="Market details" />

          {isTemplate && (
            <>
              <div>
                <SmallSubheaders
                  header="Market Type"
                  subheader={MARKET_TYPE_NAME[marketType]}
                />
                <SmallSubheaders
                  header="Primary Category"
                  subheader={categories[0]}
                />
                <SmallSubheaders
                  header="Secondary category"
                  subheader={categories[1]}
                />
              </div>
              <LineBreak />
            </>
          )}
          {!isTemplate && (
            <>
              <Subheaders
                header="Market type"
                link
                subheader="Market types vary based on the amount of possible outcomes."
              />
              <RadioCardGroup
                onChange={(value: string) => onChange('marketType', value)}
                defaultSelected={marketType}
                radioButtons={[
                  {
                    value: YES_NO,
                    header: 'Yes / No',
                    description:
                      'There are two possible outcomes: “Yes” or “No”',
                  },
                  {
                    value: CATEGORICAL,
                    header: 'Multiple Choice',
                    description:
                      'There are up to 7 possible outcomes: “A”, “B”, “C” etc ',
                  },
                  {
                    value: SCALAR,
                    header: 'Scalar',
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
              />

              <Subheaders
                header="Market question"
                link
                subheader="What do you want people to predict? If entering a date and time in the Market Question and/or Additional Details, enter a date and time in the UTC-0 timezone that is sufficiently before the Official Reporting Start Time."
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
            </>
          )}

          {marketType === CATEGORICAL && !isTemplate && (
            <>
              <Subheaders
                header="Outcomes"
                subheader="List the outcomes people can choose from."
                link
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
                updateList={(value: Array<string>) => onChange(OUTCOMES, value)}
                errorMessage={validations.outcomes}
              />
            </>
          )}

          {marketType === SCALAR && (
            <>
              <Subheaders
                header="Unit of measurement"
                subheader="Choose a denomination for the range."
                link
              />
              <TextInput
                placeholder="Denomination"
                onChange={(value: string) =>
                  onChange('scalarDenomination', value)
                }
                disabled={isTemplate}
                value={scalarDenomination}
                errorMessage={validations.scalarDenomination}
              />
              <Subheaders
                header="Numeric range"
                subheader="Choose the min and max values of the range."
                link
              />
              <section>
                <TextInput
                  type="number"
                  placeholder="0"
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
                  placeholder="100"
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
                  value={maxPrice}
                  errorMessage={validations.maxPrice}
                />
              </section>
              <Subheaders
                header="Precision"
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
            disableSubCategory={isTemplate && !hasNoTemplateCategoryChildren(newMarket.categories[0])}
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
            />
          )}

          <Subheaders
            header="Resolution source"
            subheader="Describe what users need to know in order to resolve the market."
            link
          />
          <RadioBarGroup
            radioButtons={[
              {
                header: 'General knowledge',
                value: EXPIRY_SOURCE_GENERIC,
              },
              {
                header: 'Outcome available on a public website',
                value: EXPIRY_SOURCE_SPECIFIC,
                expandable: true,
                placeholder: 'Enter website',
                textValue: expirySource,
                onTextChange: (value: string) =>
                  onChange('expirySource', value),
                errorMessage: validations.expirySource,
                secondPlaceholder: 'Back up website (optional)',
                secondTextValue: backupSource,
                secondHeader:
                  'If the primary resolution source is not available',
                onSecondTextChange: (value: string) =>
                  onChange('backupSource', value),
              },
            ]}
            defaultSelected={expirySourceType}
            onChange={(value: string) => {
              if (value === EXPIRY_SOURCE_GENERIC) {
                onChange(EXPIRY_SOURCE, '');
                onError(EXPIRY_SOURCE, '');
              }
              onChange('expirySourceType', value);
            }}
          />

          {isTemplate &&
            <ResolutionRules newMarket={newMarket} onChange={onChange} />
          }

          <Subheaders
            header="Resolution details"
            subheader="Describe what users need to know to determine the outcome of the event."
            link
          />
          <TextInput
            type="textarea"
            placeholder="Describe how the event should be resolved under different scenarios."
            rows="3"
            value={detailsText}
            onChange={(value: string) => onChange('detailsText', value)}
          />

          <Subheaders
            header="Designated reporter"
            subheader="The person assigned to report the winning outcome of the event (within 24 hours after Reporting Start Time)."
            link
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
