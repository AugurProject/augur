import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment, { Moment } from "moment";

import {
  RadioCardGroup,
  FormDropdown,
  TextInput,
  DatePicker,
  TimeSelector,
  RadioBarGroup,
  TimezoneDropdown,
  CategoryMultiSelect
} from "modules/common/form";
import { setCategories } from "modules/categories/set-categories";
import { Header, Subheaders, LineBreak, NumberedList } from "modules/create-market/components/common";
import {
  YES_NO,
  SCALAR,
  CATEGORICAL,
  EXPIRY_SOURCE_GENERIC,
  EXPIRY_SOURCE_SPECIFIC,
  DESIGNATED_REPORTER_SELF,
  DESIGNATED_REPORTER_SPECIFIC,
  YES_NO_OUTCOMES
} from 'modules/common/constants';
import { NewMarket } from "modules/types";
import { RepLogoIcon } from "modules/common/icons";
import {
  DESCRIPTION_PLACEHOLDERS,
  DESCRIPTION,
  DESIGNATED_REPORTER_ADDRESS,
  EXPIRY_SOURCE,
  CATEGORIES,
  OUTCOMES
} from "modules/create-market/constants";
import { formatDate, convertUnixToFormattedDate } from "utils/format-date";

import Styles from "modules/create-market/components/form-details.styles.less";
import { createBigNumber } from "utils/create-big-number";

interface FormDetailsProps {
  updateNewMarket: Function;
  newMarket: NewMarket;
  currentTimestamp: number;
  onChange: Function;
  onError: Function;
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
  state: FormDetailsState = {
    dateFocused: false,
    timeFocused: false,
  };

  render() {
    const {
      newMarket,
      currentTimestamp,
      onChange,
      onError
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
      expirySourceType,
      designatedReporterAddress,
      designatedReporterType,
      validations,
      currentStep,
      timezone
    } = newMarket;

    return (
      <div className={Styles.FormDetails}>
        <div>
          <Header text="Market details" />

          <Subheaders header="Market type" link subheader="Market types vary based on the amount of possible outcomes." />
          <RadioCardGroup
            onChange={(value: string) => onChange("marketType", value)}
            defaultSelected={marketType}
            radioButtons={[
              {
                value: YES_NO,
                header: 'Yes / No',
                description: 'There are two possible outcomes: “Yes” or “No”',
              },
              {
                value: CATEGORICAL,
                header: 'Multiple Choice',
                description: 'There are up to 7 possible outcomes: “A”, “B”, “C” etc ',
              },
              {
                value: SCALAR,
                header: 'Scalar',
                description: 'A range of numeric outcomes: “USD range” between “1” and “100”.',
              },
            ]}
          />

          <Subheaders header="Reporting start date and time" subheader="Choose a date and time that is sufficiently after the end of the event. If reporting starts before the event end time the market will likely be reported as invalid. Make sure to factor in potential delays that can impact the event end time. " link />
          <span>
            <DatePicker
              date={setEndTime ? moment(setEndTime * 1000) : null}
              placeholder="Date"
              displayFormat="MMM D, YYYY"
              id="input-date"
              onDateChange={(date: Moment) => {
                if (!date) return onChange("setEndTime", "");
                onChange("setEndTime", date.startOf('day').unix());
              }}
              isOutsideRange={day =>
                day.isAfter(moment(currentTimestamp * 1000).add(6, "M")) ||
                day.isBefore(moment(currentTimestamp * 1000))
              }
              numberOfMonths={1}
              onFocusChange= {({ focused }) => {
                if (setEndTime === null) {
                  onChange("setEndTime", currentTimestamp);
                }
                this.setState({ dateFocused: focused });
              }}
              focused={s.dateFocused}
              errorMessage={validations[currentStep].setEndTime}
            />
            <TimeSelector
              hour={hour}
              minute={minute}
              meridiem={meridiem}
              onChange={(label: string, value: number) => {
                onChange(label, value)
              }}
              onFocusChange= {(focused: Boolean) => {
                const timeSelector: TimeSelectorParams = {}
                if (!hour) {
                  timeSelector.hour = "12";
                }
                if (!minute) {
                  timeSelector.minute = "00";
                }
                if (!meridiem) {
                  timeSelector.meridiem = "AM";
                }

                onChange("timeSelector", timeSelector);
                this.setState({ timeFocused: focused });
              }}
              focused={s.timeFocused}
              errorMessage={validations[currentStep].hour}
            />
            <TimezoneDropdown onChange={(offsetName: string, offset: number, timezone: string) => {
              const timezoneParams = {offset, timezone, offsetName};
              onChange("timezoneDropdown", timezoneParams);
            }} timestamp={setEndTime} timezone={timezone} />
          </span>
          <Subheaders header="Market question" link subheader="What do you want people to predict? If entering a date and time in the Market Question and/or Additional Details, enter a date and time in the UTC-0 timezone that is sufficiently before the Official Reporting Start Time." />
          <TextInput
            type="textarea"
            placeholder={DESCRIPTION_PLACEHOLDERS[marketType]}
            onChange={(value: string) => onChange("description", value)}
            rows="3"
            value={description}
            errorMessage={validations[currentStep].description && (validations[currentStep].description.charAt(0).toUpperCase() + validations[currentStep].description.slice(1).toLowerCase())}
          />

          {marketType === CATEGORICAL &&
            <>
              <Subheaders header="Outcomes" subheader="List the outcomes people can choose from." link />
              <NumberedList
                initialList={outcomes}
                minShown={2}
                maxList={7}
                placeholder={"Enter outcome"}
                updateList={(value: Array<string>) => onChange(OUTCOMES, value)}
                errorMessage={validations[currentStep].outcomes}
              />
            </>
          }

          {marketType === SCALAR &&
            <>
              <Subheaders header="Unit of measurement" subheader="Choose a denomination for the range." link />
              <TextInput
                placeholder="Denomination"
                onChange={(value: string) => onChange("scalarDenomination", value)}
                value={scalarDenomination}
                errorMessage={validations[currentStep].scalarDenomination}
              />
              <Subheaders header="Numeric range" subheader="Choose the min and max values of the range." link />
              <section>
                <TextInput
                  type="number"
                  placeholder="0"
                  onChange={(value: string) => {
                    onChange("minPrice", value);
                    onChange("minPriceBigNumber", createBigNumber(value));
                    onError("maxPrice", "");
                  }}
                  value={minPrice}
                  errorMessage={validations[currentStep].minPrice}
                />
                <span>to</span>
                <TextInput
                  type="number"
                  placeholder="100"
                  onChange={(value: string) => {
                    onChange("maxPrice", value);
                    onChange("maxPriceBigNumber", createBigNumber(value));
                    onError("minPrice", "");
                  }}
                  trailingLabel={scalarDenomination !=="" ? scalarDenomination : "Denomination"}
                  value={maxPrice}
                  errorMessage={validations[currentStep].maxPrice}
                />
              </section>
              <Subheaders header="Precision" subheader="What is the smallest quantity of the denomination users can choose, e.g: “0.1”, “1”, “10”." link />
              <TextInput
                type="number"
                placeholder="0"
                onChange={(value: string) => onChange("tickSize", value)}
                trailingLabel={scalarDenomination !=="" ? scalarDenomination : "Denomination"}
                value={tickSize}
                errorMessage={validations[currentStep].tickSize}
              />
            </>
          }

          <Subheaders header="Market category" subheader="Categories help users to find your market on Augur." />
          <CategoryMultiSelect
            initialSelected={categories}
            sortedGroup={setCategories}
            updateSelection={categoryArray =>
              onChange(CATEGORIES, categoryArray)
            }
            errorMessage={validations[currentStep].categories}
          />
        </div>
        <LineBreak />
        <div>
          <Header text="Resolution information" />

          <Subheaders header="Resolution source" subheader="Describe what users need to know in order to resolve the market." link/>
          <RadioBarGroup
            radioButtons={[
              {
                header: "General knowledge",
                value: EXPIRY_SOURCE_GENERIC
              },
              {
                header: "Outcome available on a public website",
                value: EXPIRY_SOURCE_SPECIFIC,
                expandable: true,
                placeholder: "Enter website",
                textValue: expirySource,
                onTextChange: (value: string) => onChange("expirySource", value),
                errorMessage: validations[currentStep].expirySource
              }
            ]}
            defaultSelected={expirySourceType}
            onChange={(value: string) => {
              if (value === EXPIRY_SOURCE_GENERIC) {
                onChange(EXPIRY_SOURCE, "");
                onError(EXPIRY_SOURCE, "");
              }
              onChange("expirySourceType", value)}
            }
          />

          <Subheaders header="Resolution details" subheader="Describe what users need to know to determine the outcome of the event." link/>
          <TextInput
            type="textarea"
            placeholder="Describe how the event should be resolved under different scenarios."
            rows="3"
            value={detailsText}
            onChange={(value: string) => onChange("detailsText", value)}
          />

          <Subheaders header="Designated reporter" subheader="The person assigned to report the winning outcome of the event (within 24 hours after Reporting Start Time)." link/>
          <RadioBarGroup
            radioButtons={[
              {
                header: "Myself",
                value: DESIGNATED_REPORTER_SELF
              },
              {
                header: "Someone else",
                value: DESIGNATED_REPORTER_SPECIFIC,
                expandable: true,
                placeholder: "Enter wallet address",
                textValue: designatedReporterAddress,
                onTextChange: (value: string) => onChange("designatedReporterAddress", value),
                errorMessage: validations[currentStep].designatedReporterAddress
              }
            ]}
            defaultSelected={designatedReporterType}
            onChange={(value: string) => {
              if (value === DESIGNATED_REPORTER_SELF) {
                onChange(DESIGNATED_REPORTER_ADDRESS, "");
                onError(DESIGNATED_REPORTER_ADDRESS, "");
              }
              onChange("designatedReporterType", value)}
            }
          />
        </div>
      </div>
    );
  }
}
