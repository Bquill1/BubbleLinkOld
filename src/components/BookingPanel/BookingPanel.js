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
import {
  isDayMomentInsideRange,
  timeOfDayFromLocalToTimeZone,
  isDate,
  convertToMoment,
  resetToStartOfDay,
  dayIdString,
} from '../../util/dates';
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
const getMultiPrices = listing => {
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
    lowestAvailablePrice,
    lowestText,
  } = props;
  const timeZone =
    listing.attributes.availabilityPlan && listing.attributes.availabilityPlan.timezone;
  const publicData = listing.attributes.publicData;
  const spaceRentalAvailabilityOptions = publicData.spaceRentalAvailability;
  const capacity = publicData.capacity;
  const bookingTypeSpaceOptions = getSpaceOptions(listing);
  const [spaceRentalAvailability, setSpaceRentalAvailability] = useState(
    spaceRentalAvailabilityOptions && spaceRentalAvailabilityOptions[0]
  );
  const [seatsSelected, setSeatsSelected] = useState(1);
  const [bookingType, setBookingType] = useState(
    bookingTypeSpaceOptions[spaceRentalAvailability][0]
  );
  const [dateSelected, setDateSelected] = useState();
  const getDaysAvailability = day => {
    const momentDay = convertToMoment(day);
    const { listing, monthlyTimeSlots } = props;
    const timeslots = Object.keys(monthlyTimeSlots).flatMap(k => {
      return monthlyTimeSlots[k].timeSlots;
    });
    if (!momentDay || !timeslots[0] || momentDay === 'Invalid Date') {
      return null;
    }
    const a = timeslots
      .reverse()
      .find(timeSlot =>
        isDayMomentInsideRange(
          momentDay,
          timeSlot?.attributes.start,
          timeSlot?.attributes.end,
          timeZone
        )
      );
    if (!a) {
      return null;
    } else {
      return a?.attributes?.seats;
    }
  };

  //
  // The following section is only for retrieving a new timeslot setup for the multiple booking structure
  //
  // Init an object to replace the current monlyTimeSlots
  let filteredMonthlyTimeSlots = {};
  let daysThatHaveBookings = [];
  // Here we loop over the months provided in the props.montlyTimeSlots
  // And examine each time slot, checking if it fits the booking criteria
  Object.keys(monthlyTimeSlots).forEach(month => {
    // Examine each time slot in the month, and create a new array,
    // filling it with only eligible timeslots
    const newTimeSlots = monthlyTimeSlots?.[month]?.timeSlots?.flatMap(slot => {
      console.log(slot);
      // gather info about the timeslot
      const { seats, start, end } = slot.attributes;
      const timeSlotDayString = DAYS_OF_WEEK[start.getDay()];
      const startHours = start.getHours();
      const endHours = end.getHours();
      console.log(startHours);
      // get the original availability plan from the array and gather info
      const originalAvailabilityPlanForDay = originalAvailabilityPlan?.entries.find(
        p => p.dayOfWeek === timeSlotDayString && parseInt(p.startTime.split(':')[0]) === startHours
      );
      console.log(originalAvailabilityPlanForDay);
      const originalStartHours = parseInt(originalAvailabilityPlanForDay?.startTime.split(':')[0]);
      const originalEndHours = parseInt(originalAvailabilityPlanForDay?.endTime.split(':')[0]);
      // check if entire space is selected, and if it is not available
      // checked by comparing seats in slot to original availability
      const dayHasBooking = seats !== originalAvailabilityPlanForDay?.seats;
      const dayId = start && timeZone && dayIdString(resetToStartOfDay(start, timeZone));
      console.log(dayHasBooking);
      console.log(daysThatHaveBookings);
      console.log(dayId);
      console.log(daysThatHaveBookings.find(d => d === dayId));
      console.log(daysThatHaveBookings.includes(dayId));
      const dayPreviouslyBooked = daysThatHaveBookings.includes(dayId);
      console.log(dayPreviouslyBooked);
      if (dayHasBooking) {
        console.log(434344343);
        daysThatHaveBookings.push(dayId);
      }
      if (spaceRentalAvailability === 'entireSpace' && dayHasBooking) {
        console.log(1);
        // if not available, return empty array
        return [];
      }
      if (seatsSelected > seats) {
        console.log(2);
        return [];
      }
      // check if booking is per day, and if the slot covers the entire day
      if (
        bookingType === 'daily' &&
        (startHours !== originalStartHours ||
          endHours !== originalEndHours ||
          dayHasBooking ||
          dayPreviouslyBooked)
      ) {
        console.log(3);
        // if slot is partial, return empty array
        return [];
      }
      console.log(slot);
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

  const prices = getMultiPrices(listing);
  const price =
    convertToMoney(
      prices && prices[spaceRentalAvailability] && prices[spaceRentalAvailability][bookingType]
    ) || listing.attributes.price;

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
    individual: 'Book single space(s)',
    entireSpace: 'Book entire space',
    hourly: 'By the hour',
    daily: 'Full day',
  };
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

  const seatsSelector = !isEntireSpace ? (
    <div className={css.seatSelectorWrapper}>
      <label className={css.seatSelectorLabel} htmlFor={'seatSelector'}>
        No. of guests:{' '}
      </label>

      <select
        id={'seatSelector'}
        className={css.seatSelector}
        onChange={e => setSeatsSelected(parseInt(e.target.value))}
      >
        {[...Array(getDaysAvailability(dateSelected) || capacity).keys()].map(n => {
          return <option value={n + 1}> {n + 1}</option>;
        })}
      </select>
    </div>
  ) : null;
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
        <div className={css.bookingPanelModalMobileContent}>
            {spaceRentalAvailabilityButtons}
            {seatsSelector}
            {hourDayButtons}
            <div className={css.modalHeading}>
            <h1 className={css.title}>{title}</h1>
          </div>
          <div className={css.bookingHeading}>
            <div className={css.bookingHeadingContainer}>
              {/* <h2 className={titleClasses}>{title}</h2>
            {subTitleText ? <div className={css.bookingHelp}>{subTitleText}</div> : null} */}
            </div>
          </div>
          {/* <div className={css.desktopPriceContainer}>
          <div className={css.desktopPriceValue} title={priceTitle}>
            {formattedPrice}
          </div>
          <div className={css.desktopPerUnit}>
            <FormattedMessage id={unitTranslationKey} />
          </div>
        </div> */}
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
              seatsSelected={seatsSelected}
              dateSelected={dateSelected}
              setDateSelected={setDateSelected}
            />
          ) : null}
        </div>
      </ModalInMobile>
      <div className={css.openBookingForm}>
        <div className={css.priceContainer}>
            <div className={css.perUnit}>
              From:
            </div>
          <div className={css.priceValue} title={priceTitle}>
            {lowestAvailablePrice}
          </div>
          <div className={css.perUnit}>
            {/* <FormattedMessage id={unitTranslationKey} /> */}
            {lowestText}
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
