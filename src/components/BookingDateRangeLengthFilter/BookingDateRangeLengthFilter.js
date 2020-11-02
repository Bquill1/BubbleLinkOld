import React, { Component } from 'react';
import { bool, func, number, shape, string } from 'prop-types';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { parseDateFromISO8601, stringifyDateToISO8601 } from '../../util/dates';
import { propTypes } from '../../util/types';

import { FieldDateRangeController, FieldSelect, FilterPopup, FilterPlain } from '../../components';
import css from './BookingDateRangeLengthFilter.css';

const RADIX = 10;

const formatSelectedLabel = (bookingTypesOptions, pub_bookingTypes, startDate, endDate) => {
  // Only show the minimum duration label for options whose key
  // matches the given param and that have the short label defined.
  const bookingTypesOption =
    typeof pub_bookingTypes === 'number'
      ? bookingTypesOptions.find(option => {
          return pub_bookingTypes.toString() === option.key && option.shortLabel;
        })
      : null;
  return bookingTypesOption
    ? `${startDate} - ${endDate}, ${bookingTypesOption.shortLabel}`
    : `${startDate} - ${endDate}`;
};

// Parse query parameter, which should look like "2020-05-28,2020-05-31"
const parseInitialValues = initialValues => {
  console.log(initialValues)
  const { dates, pub_bookingTypes } = initialValues || {}; 
  const rawDateValuesFromParams = dates ? dates.split(',') : [];
  console.log(pub_bookingTypes)
  const [startDate, endDate] = rawDateValuesFromParams.map(v => parseDateFromISO8601(v));
  const initialDates =
    initialValues && startDate && endDate ? { dates: { startDate, endDate } } : { dates: null };
  return { ...initialDates, pub_bookingTypes: pub_bookingTypes };
};
// Format dateRange value for the query. It's given by FieldDateRangeInput:
// { dates: { startDate, endDate } }
const formatValues = (values, dateQueryParam, bookingTypesParam) => {
  const { startDate, endDate } = values && values[dateQueryParam] ? values[dateQueryParam] : {};
  const start = startDate ? stringifyDateToISO8601(startDate) : null;
  const end = endDate ? stringifyDateToISO8601(endDate) : null;
  const datesValue = start && end ? `${start},${end}` : null;
  const bookingTypesValue = values && values[bookingTypesParam] ? values[bookingTypesParam] : null;
  return { [dateQueryParam]: datesValue, [bookingTypesParam]: bookingTypesValue };
};

export class BookingDateRangeLengthFilterComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // We need to sync the currently selected dates from the
      // datepicker so we can enable the min duration only when there
      // are dates selected.
      selectedDates: null,
    };

    this.popupControllerRef = null;
    this.plainControllerRef = null;
  }

  render() {
    const {
      className,
      rootClassName,
      dateRangeLengthFilter,
      showAsPopup,
      initialValues: initialValuesRaw,
      id,
      contentPlacementOffset,
      onSubmit,
      label,
      intl,
      ...rest
    } = this.props;
console.log(this.props)
    const datesQueryParamName = 'dates';
    const bookingTypesQueryParamName = 'pub_bookingTypes';

    const parsedInitialValues = initialValuesRaw ? parseInitialValues(initialValuesRaw) : {};
    const { dates: initialDates, pub_bookingTypes: initialbookingTypes } = parsedInitialValues;
    const { startDate, endDate } = initialDates || {};

    const isDatesSelected = !!initialDates && !!startDate && !!startDate;

    const format = {
      month: 'short',
      day: 'numeric',
    };

    const formattedStartDate = isDatesSelected ? intl.formatDate(startDate, format) : null;
    const formattedEndDate = isDatesSelected ? intl.formatDate(endDate, format) : null;

    const labelForPlain = isDatesSelected
      ? intl.formatMessage(
          { id: 'BookingDateRangeLengthFilter.labelSelectedPlain' },
          {
            dates: formatSelectedLabel(
              dateRangeLengthFilter.config.options,
              initialbookingTypes,
              formattedStartDate,
              formattedEndDate
            ),
          }
        )
      : label
      ? label
      : intl.formatMessage({ id: 'BookingDateRangeLengthFilter.labelPlain' });

    const labelForPopup = isDatesSelected
      ? intl.formatMessage(
          { id: 'BookingDateRangeLengthFilter.labelSelectedPopup' },
          {
            dates: formatSelectedLabel(
              dateRangeLengthFilter.config.options,
              initialbookingTypes,
              formattedStartDate,
              formattedEndDate
            ),
          }
        )
      : label
      ? label
      : intl.formatMessage({ id: 'BookingDateRangeLengthFilter.labelPopup' });

    const bookingTypesLabel = intl.formatMessage({
      id: 'BookingDateRangeLengthFilter.bookingTypesLabel',
    });

    const onClearPopupMaybe =
      this.popupControllerRef && this.popupControllerRef.onReset
        ? {
            onClear: () => {
              this.setState({ selectedDates: null });
              this.popupControllerRef.onReset(null, null);
            },
          }
        : {};

    const onCancelPopupMaybe =
      this.popupControllerRef && this.popupControllerRef.onReset
        ? {
            onCancel: () => {
              this.setState({ selectedDates: null });
              this.popupControllerRef.onReset(startDate, endDate);
            },
          }
        : {};

    const onClearPlainMaybe =
      this.plainControllerRef && this.plainControllerRef.onReset
        ? {
            onClear: () => {
              this.setState({ selectedDates: null });
              this.plainControllerRef.onReset(null, null);
            },
          }
        : {};

    const handleSubmit = values => {
      this.setState({ selectedDates: null });
      onSubmit(formatValues(values, datesQueryParamName, bookingTypesQueryParamName));
    };

    const handleChange = values => {
      this.setState({ selectedDates: values[datesQueryParamName] });
    };

    const datesSelected = !!(initialDates || this.state.selectedDates);

    const selectedDatesInState = this.state.selectedDates;
    const initialValues = {
      dates: selectedDatesInState ? selectedDatesInState : initialDates,
      pub_bookingTypes: initialbookingTypes,
    };
console.log(bookingTypesQueryParamName);
    const fields = (
      <>
        <FieldDateRangeController
          name={datesQueryParamName}
          controllerRef={node => {
            this.popupControllerRef = node;
          }}
        />
        <FieldSelect
          id="BookingDateRangeLengthFilter.pub_bookingTypes"
          name={bookingTypesQueryParamName}
          label={bookingTypesLabel}
          className={css.duration}
          // disabled={!datesSelected}
        >
          {dateRangeLengthFilter.config.options.map(({ key, label }) => {
            return (
              <option key={key} value={key}>
                {label}
              </option>
            );
          })}
        </FieldSelect>
      </>
    );

    return showAsPopup ? (
      <FilterPopup
        className={className}
        rootClassName={rootClassName}
        popupClassName={css.popupSize}
        label={labelForPopup}
        isSelected={isDatesSelected}
        id={`${id}.popup`}
        showAsPopup
        contentPlacementOffset={contentPlacementOffset}
        onSubmit={handleSubmit}
        onChange={handleChange}
        {...onClearPopupMaybe}
        {...onCancelPopupMaybe}
        initialValues={initialValues}
        {...rest}
      >
        {fields}
      </FilterPopup>
    ) : (
      <FilterPlain
        className={className}
        rootClassName={rootClassName}
        label={labelForPlain}
        isSelected={isDatesSelected}
        id={`${id}.plain`}
        liveEdit
        contentPlacementOffset={contentPlacementOffset}
        onSubmit={handleSubmit}
        {...onClearPlainMaybe}
        initialValues={initialValues}
        {...rest}
      >
        {fields}
      </FilterPlain>
    );
  }
}

BookingDateRangeLengthFilterComponent.defaultProps = {
  rootClassName: null,
  className: null,
  dateRangeLengthFitler: null,
  showAsPopup: true,
  liveEdit: false,
  initialValues: null,
  contentPlacementOffset: 0,
};

BookingDateRangeLengthFilterComponent.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  dateRangeLengthFitler: propTypes.filterConfig,
  showAsPopup: bool,
  liveEdit: bool,
  onSubmit: func.isRequired,
  initialValues: shape({
    dates: string,
    pub_bookingTypes: string,
  }),
  contentPlacementOffset: number,

  // form injectIntl
  intl: intlShape.isRequired,
};

const BookingDateRangeLengthFilter = injectIntl(BookingDateRangeLengthFilterComponent);

export default BookingDateRangeLengthFilter;
