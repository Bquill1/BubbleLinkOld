import React, { Component } from 'react';
import { array, bool, func, object, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { timestampToDate } from '../../util/dates';
import { propTypes } from '../../util/types';
import config from '../../config';
import { IconSpinner, Form, PrimaryButton } from '../../components';
import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe';
import FieldDateAndTimeInput from './FieldDateAndTimeInput';

import css from './BookingTimeForm.css';

export class BookingTimeFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingType: null,
      spaceRentalAvailability: null,
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleFormSubmit(e) {
    const { bookingType, spaceRentalAvailability } = this.state;
    const { price, seatsSelected } = this.props;
    this.props.onSubmit({
      ...e,
      bookingType,
      spaceRentalAvailability,
      price,
      seats: seatsSelected,
    });
  }
  componentDidMount() {
    const { bookingType, spaceRentalAvailability } = this.props;
    const stateBookingType = this.state.bookingType;
    const stateSpaceRentalAvailability = this.state.spaceRentalAvailability;
    if (bookingType !== stateBookingType) {
      this.setState({ bookingType: bookingType });
    }
    if (spaceRentalAvailability !== stateSpaceRentalAvailability) {
      this.setState({ spaceRentalAvailability: spaceRentalAvailability });
    }
  }
  // When the values of the form are updated we need to fetch
  // lineItems from FTW backend for the EstimatedTransactionMaybe
  // In case you add more fields to the form, make sure you add
  // the values here to the bookingData object.
  handleOnChange(formValues) {
    function isEmpty(obj) {
      return Object.keys(obj).length === 0;
    }
    if (!formValues || isEmpty(formValues)) {
      return null;
    }
    const { bookingType, spaceRentalAvailability, price, seatsSelected } = this.props;
    const { bookingStartTime, bookingEndTime } = formValues.values;
    if(!!bookingStartTime){
      this.props.setDateSelected(timestampToDate(bookingStartTime));
    }
    const startDate = bookingStartTime ? timestampToDate(bookingStartTime) : null;
    const endDate = bookingEndTime ? timestampToDate(bookingEndTime) : null;
    const listingId = this.props.listingId;
    const isOwnListing = this.props.isOwnListing;

    if (bookingStartTime && bookingEndTime && !this.props.fetchLineItemsInProgress) {
      this.props.onFetchTransactionLineItems({
        bookingData: {
          startDate,
          endDate,
          price,
          bookingType,
          spaceRentalAvailability,
          seatsSelected: parseInt(seatsSelected) || 1,
        },
        // bookingData: {
        //   startDate,
        //   endDate,
        //   price,
        //   bookingType,
        //   spaceRentalAvailability,
        //   seats: seatsSelected || 1,
        // },
        listingId,
        isOwnListing,
      });
    }
  }

  render() {
    const { rootClassName, className, price: unitPrice, lineItems, ...rest } = this.props;

    const stateBookingType = this.state.bookingType;
    const stateSpaceRentalAvailability = this.state.spaceRentalAvailability;
    const stateSeatsSelected = this.state.seatsSelected;

    const classes = classNames(rootClassName || css.root, className);

    if (!unitPrice) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingTimeForm.listingPriceMissing" />
          </p>
        </div>
      );
    }
    if (unitPrice.currency !== config.currency) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingTimeForm.listingCurrencyInvalid" />
          </p>
        </div>
      );
    }

    return (
      <FinalForm
        {...rest}
        unitPrice={unitPrice}
        onSubmit={this.handleFormSubmit}
        render={fieldRenderProps => {
          const {
            endDatePlaceholder,
            startDatePlaceholder,
            form,
            pristine,
            handleSubmit,
            intl,
            isOwnListing,
            listing,
            listingId,
            bookingType,
            spaceRentalAvailability,
            submitButtonWrapperClassName,
            unitType,
            values,
            monthlyTimeSlots,
            onFetchTimeSlots,
            timeZone,
            lineItems,
            fetchLineItemsInProgress,
            fetchLineItemsError,
            seatsSelected,
          } = fieldRenderProps;
          console.log(this.props);
          const startTime = values && values.bookingStartTime ? values.bookingStartTime : null;
          const endTime = values && values.bookingEndTime ? values.bookingEndTime : null;
          const isDaily = bookingType === 'daily';
          if (
            bookingType !== stateBookingType ||
            spaceRentalAvailability !== stateSpaceRentalAvailability ||
            seatsSelected !== stateSeatsSelected
          ) {
            this.setState({
              bookingType: bookingType,
              spaceRentalAvailability: spaceRentalAvailability,
              seatsSelected: seatsSelected,
            });
            this.handleOnChange({ values });
          }
          const isEntireSpace = this.props.spaceRentalAvailability === 'entireSpace';
          const bookingStartLabel = intl.formatMessage({
            id: 'BookingTimeForm.bookingStartTitle',
          });
          const bookingEndLabel = intl.formatMessage({
            id: 'BookingTimeForm.bookingEndTitle',
          });

          const startDate = startTime ? timestampToDate(startTime) : null;
          const endDate = endTime ? timestampToDate(endTime) : null;

          // This is the place to collect breakdown estimation data. See the
          // EstimatedBreakdownMaybe component to change the calculations
          // for customized payment processes.
          const bookingData =
            startDate && endDate
              ? {
                  unitType,
                  startDate,
                  endDate,
                  timeZone,
                  quantity: stateSeatsSelected,
                  seats: stateSeatsSelected,
                }
              : null;

          const showEstimatedBreakdown =
            !!bookingData &&
            !!this.props.lineItems &&
            !fetchLineItemsInProgress &&
            !fetchLineItemsError;
          const bookingInfoMaybe = showEstimatedBreakdown ? (
            <div className={css.priceBreakdownContainer}>
              <h3 className={css.priceBreakdownTitle}>
                <FormattedMessage id="BookingTimeForm.priceBreakdownTitle" />
              </h3>
              <EstimatedBreakdownMaybe
                bookingData={bookingData}
                isEntireSpace={isEntireSpace}
                isDaily={isDaily}
                seatsSelected={seatsSelected}
                lineItems={this.props.lineItems}
              />
            </div>
          ) : null;

          const loadingSpinnerMaybe = fetchLineItemsInProgress ? (
            <IconSpinner className={css.spinner} />
          ) : null;

          const bookingInfoErrorMaybe = fetchLineItemsError ? (
            <span className={css.sideBarError}>
              <FormattedMessage id="BookingDatesForm.fetchLineItemsError" />
            </span>
          ) : null;

          const submitButtonClasses = classNames(
            submitButtonWrapperClassName || css.submitButtonWrapper
          );

          const startDateInputProps = {
            label: bookingStartLabel,
            placeholderText: startDatePlaceholder,
          };
          const endDateInputProps = {
            label: bookingEndLabel,
            placeholderText: endDatePlaceholder,
          };

          const dateInputProps = {
            startDateInputProps,
            endDateInputProps,
          };
          return (
            <Form onSubmit={handleSubmit} className={classes}>
              <FormSpy
                subscription={{ values: true }}
                onChange={values => {
                  this.handleOnChange(values);
                }}
              />
              {monthlyTimeSlots && timeZone ? (
                <FieldDateAndTimeInput
                  {...dateInputProps}
                  className={css.bookingDates}
                  listingId={listingId}
                  bookingStartLabel={bookingStartLabel}
                  onFetchTimeSlots={onFetchTimeSlots}
                  monthlyTimeSlots={monthlyTimeSlots}
                  spaceRentalAvailability={this.props.spaceRentalAvailability}
                  bookingType={this.props.bookingType}
                  isDaily={isDaily}
                  values={values}
                  intl={intl}
                  form={form}
                  pristine={pristine}
                  timeZone={timeZone}
                />
              ) : null}
              {bookingInfoMaybe}
              {loadingSpinnerMaybe}
              {bookingInfoErrorMaybe}
              <p className={css.smallPrint}>
                <FormattedMessage
                  id={
                    isOwnListing
                      ? 'BookingTimeForm.ownListing'
                      : 'BookingTimeForm.youWontBeChargedInfo'
                  }
                />
              </p>
              <div className={submitButtonClasses}>
                <PrimaryButton type="submit">
                  <FormattedMessage id="BookingTimeForm.requestToBook" />
                </PrimaryButton>
              </div>
            </Form>
          );
        }}
      />
    );
  }
}

BookingTimeFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  price: null,
  isOwnListing: false,
  listingId: null,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  monthlyTimeSlots: null,
  lineItems: null,
  fetchLineItemsError: null,
};

BookingTimeFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  unitType: propTypes.bookingUnitType.isRequired,
  price: propTypes.money,
  isOwnListing: bool,
  listingId: propTypes.uuid,
  monthlyTimeSlots: object,
  onFetchTimeSlots: func.isRequired,

  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  startDatePlaceholder: string,
  endDatePlaceholder: string,
};

const BookingTimeForm = compose(injectIntl)(BookingTimeFormComponent);
BookingTimeForm.displayName = 'BookingTimeForm';

export default BookingTimeForm;
