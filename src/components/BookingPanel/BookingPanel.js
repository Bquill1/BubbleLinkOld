import React, { useState } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { array, bool, func, node, object, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { propTypes, LISTING_STATE_CLOSED, LINE_ITEM_NIGHT, LINE_ITEM_DAY } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { parse, stringify } from '../../util/urlHelpers';
import config from '../../config';
import { ModalInMobile, Button, BookingPanelOptionButton } from '../../components';
import { BookingTimeForm } from '../../forms';
import { types as sdkTypes } from '../../util/sdkLoader';
import { unitDivisor, convertMoneyToNumber, convertUnitToSubUnit } from '../../util/currency';

import css from './BookingPanel.css';

// This defines when ModalInMobile shows content as Modal
const { Money, UUID } = sdkTypes;
const MODAL_BREAKPOINT = 1023;
const TODAY = new Date();
const DAYS_OF_WEEK = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const priceData = (price, intl) => {
  if (price && price.currency === config.currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: `(${price.currency})`,
      priceTitle: `Unsupported currency (${price.currency})`,
    };
  }
  return {};
};

const convertToMoney = amount => {
  const currency = config.currency;

  return new Money(convertUnitToSubUnit(amount / 100, unitDivisor(currency)), currency);
};
const getMutliPrices = listing => {
  return {
    entireSpace: {
      hourly: listing.attributes.publicData.price_entireSpace_hourly,
      daily: listing.attributes.publicData.price_entireSpace_daily,
    },
    individual: {
      hourly: listing.attributes.publicData.price_individual_hourly,
      daily: listing.attributes.publicData.price_individual_daily,
    },
  };
};
const getSpaceOptions = listing => {
  return {
    entireSpace: listing.attributes.publicData.bookingType_entireSpace || [],
    individual: listing.attributes.publicData.bookingType_individual || [],
  };
};
const openBookModal = (isOwnListing, isClosed, history, location) => {
  if (isOwnListing || isClosed) {
    window.scrollTo(0, 0);
  } else {
    const { pathname, search, state } = location;
    const searchString = `?${stringify({ ...parse(search), book: true })}`;
    history.push(`${pathname}${searchString}`, state);
  }
};

const closeBookModal = (history, location) => {
  const { pathname, search, state } = location;
  const searchParams = omit(parse(search), 'book');
  const searchString = `?${stringify(searchParams)}`;
  history.push(`${pathname}${searchString}`, state);
};

const dateFormattingOptions = { month: 'short', day: 'numeric', weekday: 'short' };

const BookingPanel = props => {
  const {
    rootClassName,
    className,
    titleClassName,
    listing,
    isOwnListing,
    unitType,
    onSubmit,
    title,
    subTitle,
    onManageDisableScrolling,
    onFetchTimeSlots,
    monthlyTimeSlots,
    originalAvailabilityPlan,
    history,
    location,
    intl,
    onFetchTransactionLineItems,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,
  } = props;
  console.log(props);
  const spaceRentalAvailabilityOptions = listing.attributes.publicData.spaceRentalAvailability;
  const bookingType_entireSpace_Options = listing.attributes.publicData.bookingType_entireSpace;
  const bookingType_individual_Options = listing.attributes.publicData.bookingType_individual;
  const bookingTypeSpaceOptions = getSpaceOptions(listing);
  const [spaceRentalAvailability, setSpaceRentalAvailability] = useState(
    spaceRentalAvailabilityOptions[0]
  );
  const [bookingType, setBookingType] = useState(
    bookingTypeSpaceOptions[spaceRentalAvailability][0]
  );

  // 
  // The following section is only for retrieving a new timeslot setup for the multiple booking structure
  // 
  // Init an object to replace the current monlyTimeSlots
  let filteredMonthlyTimeSlots = {};
  // Here we loop over the months provided in the props.montlyTimeSlots
  // And examine each time slot, checking if it fits the booking criteria
  Object.keys(monthlyTimeSlots).forEach(month => {
    // Examine each time slot in the month, and create a new array,
    // filling it with only eligible timeslots
    const newTimeSlots = monthlyTimeSlots?.[month]?.timeSlots?.flatMap(slot => {
      
      // gather info about the timeslot
      const { seats, start, end } = slot.attributes;
      const timeSlotDayString = DAYS_OF_WEEK[start.getDay()];
      const startHours = start.getHours();
      const endHours = end.getHours();

      // get the original availability plan from the array and gather info
      const originalAvailabilityPlanForDay = originalAvailabilityPlan.entries.find(
        p => p.dayOfWeek === timeSlotDayString
      );
      const originalStartHours = parseInt(originalAvailabilityPlanForDay.startTime.split(':')[0]);
      const originalEndHours = parseInt(originalAvailabilityPlanForDay.endTime.split(':')[0]);

      // check if entire space is selected, and if it is not available
      // checked by comparing seats in slot to original availability
      if (
        spaceRentalAvailability === 'entireSpace' &&
        seats !== originalAvailabilityPlanForDay.seats
      ) {
        // if not available, return empty array
        return [];
      }
      // check if booking is per day, and if the slot covers the entire day
      if (
        bookingType === 'daily' &&
        (startHours !== originalStartHours || endHours !== originalEndHours)
      ) {
        // if slot is partial, return empty array
        return [];
      }
      // otherwise, add the slot to the newTimeSlotsArray
      return slot;
    });
    // populate the replacement monthlyTimeSlotsObject with the original fields as well as the new timeslots
    filteredMonthlyTimeSlots[month] = {
      fetchTimeSlotsError: monthlyTimeSlots[month].fetchTimeSlotsError,
      fetchTimeSlotsInProgress: monthlyTimeSlots[month].fetchTimeSlotsInProgress,
      timeSlots: newTimeSlots || {},
    };
  });

  const prices = getMutliPrices(listing);
  const price =
    convertToMoney(
      prices && prices[spaceRentalAvailability] && prices[spaceRentalAvailability][bookingType]
    ) || listing.attributes.price;
  const timeZone =
    listing.attributes.availabilityPlan && listing.attributes.availabilityPlan.timezone;
  const hasListingState = !!listing.attributes.state;
  const isClosed = hasListingState && listing.attributes.state === LISTING_STATE_CLOSED;
  const showBookingTimeForm = hasListingState && !isClosed;
  const showClosedListingHelpText = listing.id && isClosed;
  const { formattedPrice, priceTitle } = priceData(price, intl);
  const isBook = !!parse(location.search).book;

  const subTitleText = !!subTitle
    ? subTitle
    : showClosedListingHelpText
    ? intl.formatMessage({ id: 'BookingPanel.subTitleClosedListing' })
    : null;

  const isDaily = bookingType === 'daily';
  const isEntireSpace = spaceRentalAvailability === 'entireSpace';

  const unitTranslationKey = isDaily ? 'CheckoutPage.perDay' : 'CheckoutPage.perHour';
  const spaceTranslationKey = isEntireSpace
    ? 'CheckoutPage.perEntirePlace'
    : 'CheckoutPage.perSpace';
  const buttonOptionKey = {
    individual: 'One space',
    entireSpace: 'The whole place',
    hourly: 'A couple of hours',
    daily: 'The entire day',
  };
  console.log(bookingTypeSpaceOptions);
  console.log(spaceRentalAvailability);
  const classes = classNames(rootClassName || css.root, className);
  const titleClasses = classNames(titleClassName || css.bookingTitle);
  const onSetSpaceRentalAvailability = val => {
    setSpaceRentalAvailability(val);
    setBookingType(bookingTypeSpaceOptions[spaceRentalAvailability][0]);
  };
  const spaceRentalAvailabilityButtons = (
    <BookingPanelOptionButton
      options={spaceRentalAvailabilityOptions}
      activeOption={spaceRentalAvailability}
      setOption={onSetSpaceRentalAvailability}
      labelKey={buttonOptionKey}
    />
  );
  const hourDayButtons = (
    <BookingPanelOptionButton
      options={bookingTypeSpaceOptions[spaceRentalAvailability]}
      activeOption={bookingType}
      setOption={setBookingType}
      labelKey={buttonOptionKey}
    />
  );
  return (
    <div className={classes}>
      <ModalInMobile
        containerClassName={css.modalContainer}
        id="BookingTimeFormInModal"
        isModalOpenOnMobile={isBook}
        onClose={() => closeBookModal(history, location)}
        showAsModalMaxWidth={MODAL_BREAKPOINT}
        onManageDisableScrolling={onManageDisableScrolling}
      >
        {spaceRentalAvailabilityButtons}
        {hourDayButtons}
        <div className={css.modalHeading}>
          <h1 className={css.title}>{title}</h1>
        </div>
        <div className={css.bookingHeading}>
          <div className={css.bookingHeadingContainer}>
            <h2 className={titleClasses}>{title}</h2>
            {subTitleText ? <div className={css.bookingHelp}>{subTitleText}</div> : null}
          </div>
        </div>
        <div className={css.desktopPriceContainer}>
          <div className={css.desktopPriceValue} title={priceTitle}>
            {formattedPrice}
          </div>
          <div className={css.desktopPerUnit}>
            <FormattedMessage id={unitTranslationKey} />
          </div>
        </div>
        {showBookingTimeForm ? (
          <BookingTimeForm
            className={css.bookingForm}
            formId="BookingPanel"
            submitButtonWrapperClassName={css.submitButtonWrapper}
            unitType={unitType}
            onSubmit={onSubmit}
            price={price}
            listing={listing}
            listingId={listing.id}
            bookingType={bookingType}
            spaceRentalAvailability={spaceRentalAvailability}
            isOwnListing={isOwnListing}
            monthlyTimeSlots={filteredMonthlyTimeSlots}
            originalAvailabilityPlan={originalAvailabilityPlan}
            onFetchTimeSlots={onFetchTimeSlots}
            startDatePlaceholder={intl.formatDate(TODAY, dateFormattingOptions)}
            endDatePlaceholder={intl.formatDate(TODAY, dateFormattingOptions)}
            timeZone={timeZone}
            onFetchTransactionLineItems={onFetchTransactionLineItems}
            lineItems={lineItems}
            fetchLineItemsInProgress={fetchLineItemsInProgress}
            fetchLineItemsError={fetchLineItemsError}
          />
        ) : null}
      </ModalInMobile>
      <div className={css.openBookingForm}>
        <div className={css.priceContainer}>
          <div className={css.priceValue} title={priceTitle}>
            {formattedPrice}
          </div>
          <div className={css.perUnit}>
            <FormattedMessage id={unitTranslationKey} />
          </div>
        </div>

        {showBookingTimeForm ? (
          <Button
            rootClassName={css.bookButton}
            onClick={() => openBookModal(isOwnListing, isClosed, history, location)}
          >
            <FormattedMessage id="BookingPanel.ctaButtonMessage" />
          </Button>
        ) : isClosed ? (
          <div className={css.closedListingButton}>
            <FormattedMessage id="BookingPanel.closedListingButtonText" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

BookingPanel.defaultProps = {
  rootClassName: null,
  className: null,
  titleClassName: null,
  isOwnListing: false,
  subTitle: null,
  unitType: config.bookingUnitType,
  monthlyTimeSlots: null,
  lineItems: null,
  fetchLineItemsError: null,
};

BookingPanel.propTypes = {
  rootClassName: string,
  className: string,
  titleClassName: string,
  listing: oneOfType([propTypes.listing, propTypes.ownListing]),
  isOwnListing: bool,
  unitType: propTypes.bookingUnitType,
  onSubmit: func.isRequired,
  title: oneOfType([node, string]).isRequired,
  subTitle: oneOfType([node, string]),
  authorDisplayName: oneOfType([node, string]).isRequired,
  onManageDisableScrolling: func.isRequired,
  onFetchTimeSlots: func.isRequired,
  monthlyTimeSlots: object,
  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default compose(withRouter, injectIntl)(BookingPanel);
