import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";

import { RadioCardGroup, FormDropdown, TextInput, DatePicker, TimeSelector, RadioBarGroup, TimezoneDropdown } from "modules/common/form";
import { Header, Subheaders, LineBreak } from "modules/create-market/components/common";
import { 
  YES_NO, 
  SCALAR, 
  CATEGORICAL, 
  EXPIRY_SOURCE_GENERIC,
  EXPIRY_SOURCE_SPECIFIC,
  DESIGNATED_REPORTER_SELF,
  DESIGNATED_REPORTER_SPECIFIC
} from 'modules/common/constants';
import { NewMarket } from "modules/types";
import { RepLogoIcon } from "modules/common/icons";

import Styles from "modules/create-market/components/form-details.styles";

interface FormDetailsProps {
  updateNewMarket: Function;
  newMarket: NewMarket;
  currentTimestamp: string;
}

interface FormDetailsState {
  dateFocused: Boolean;
  timeFocused: Boolean;
}

export default class FormDetails extends React.Component<
  FormDetailsProps,
  FormDetailsState
> {
  state: FormDetailsState = {
    dateFocused: false,
    timeFocused: false,
  };

  onChange = (name, value) => {
    const { updateNewMarket } = this.props;
    updateNewMarket({ [name]: value });
  }

  render() {
    const {
      addOrderToNewMarket,
      newMarket,
      currentTimestamp
    } = this.props;
    const s = this.state;

    return (
      <div className={Styles.FormDetails}>
        <div>
          <Header text="Market details" />

          <Subheaders header="Market type" link subheader="Market types vary based on the amount of possible outcomes." />
          <RadioCardGroup
            onChange={(value: string) => this.onChange("type", value)}
            defaultSelected={newMarket.type}
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
              date={newMarket.endTime}
              placeholder="Date"
              displayFormat="MMM D, YYYY"
              id="input-date"
              onDateChange={(date: Number) => {
                this.onChange("endTime", date)
              }}
              // isOutsideRange={day =>
              //   day.isAfter(moment(currentTimestamp).add(6, "M")) ||
              //   day.isBefore(moment(currentTimestamp))
              // }
              numberOfMonths={1}
              onFocusChange= {({ focused }) => {
                if (newMarket.endTime === null) {
                  const date = moment(currentTimestamp * 1000);
                  this.onChange("endTime", date)
                }
                this.setState({ dateFocused: focused });
              }}
              focused={s.dateFocused}
            />
            <TimeSelector
              hour={newMarket.hour}
              minute={newMarket.minute}
              meridiem={newMarket.meridiem}
              onChange={(label: string, value: string) => {
                this.onChange(label, value)
              }}
              onFocusChange= {(focused: Boolean) => {
                if (!newMarket.hour) {
                  this.onChange("hour", "12");
                } 
                if (!newMarket.minute) {
                  this.onChange("minute", "00");
                } 
                if (!newMarket.meridiem) {
                  this.onChange("meridiem", "AM");
                }
                this.setState({ timeFocused: focused });
              }}
              focused={s.timeFocused}
            />
            <TimezoneDropdown />
          </span>

          <Subheaders header="Market question" link subheader="What do you want people to predict? If entering a date and time in the Market Question and/or Additional Details, enter a date and time in the UTC-0 timezone that is sufficiently before the Official Reporting Start Time." />
          <TextInput
            type="textarea"
            placeholder="Example: Will [person] win the [year] [event]?"
            onChange={(value: string) => this.onChange("description", value)}
            rows="3"
            value={newMarket.description}
          />

          {newMarket.type === SCALAR &&
            <>
              <Subheaders header="Unit of measurement" subheader="Choose a denomination for the range." link />
              <FormDropdown
                options={[{
                  label: "Test",
                  value: 0
                }]}
                staticLabel="Denomination"
                onChange={(value: string) => this.onChange("scalarDenomination", value)}
                defaultValue={newMarket.scalarDenomination === "" ? null : newMarket.scalarDenomination}
              />
              <Subheaders header="Numeric range" subheader="Choose the min and max values of the range." link />
              <section>
                <TextInput
                  type="number"
                  placeholder="0"
                  onChange={(value: string) => this.onChange("minPrice", value)}
                  value={newMarket.minPrice}
                />
                <span>to</span>
                <TextInput
                  type="number"
                  placeholder="100"
                  onChange={(value: string) => this.onChange("maxPrice", value)}
                  trailingLabel="Denomination"
                  value={newMarket.maxPrice}
                />
              </section>
              <Subheaders header="Precision" subheader="What is the smallest quantity of the denomination users can choose, e.g: “0.1”, “1”, “10”." link />
              <TextInput
                type="number"
                placeholder="0"
                onChange={(value: string) => this.onChange("tickSize", value)}
                trailingLabel="Denomination"
                value={newMarket.tickSize}
              />
            </>
          }

          <Subheaders header="Market category" subheader="Categories help users to find your market on Augur." />
          <FormDropdown
            options={[{
              label: "Test",
              value: 0
            }]}
            staticLabel="Select category"
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
                onTextChange: (value: string) => this.onChange("expirySource", value)
              }
            ]}
            defaultSelected={newMarket.expirySourceType}
            onChange={(value: string) => this.onChange("expirySourceType", value)}
          />

          <Subheaders header="Resolution details" subheader="Describe what users need to know to determine the outcome of the event." link/>
          <TextInput
            type="textarea"
            placeholder="Describe how the event should be resolved under different scenarios."
            rows="3"
            value={newMarket.detailsText}
            onChange={(value: string) => this.onChange("detailsText", value)}
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
                onTextChange: (value: string) => this.onChange("designatedReporterAddress", value)
              }
            ]}
            defaultSelected={newMarket.designatedReporterType}
            onChange={(value: string) => this.onChange("designatedReporterType", value)}
          />
        </div>
      </div>
    );
  }
}
