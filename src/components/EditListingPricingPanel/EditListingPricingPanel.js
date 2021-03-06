import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { ListingLink } from '../../components';
import config from '../../config';
import { EditListingPricingForm } from '../../forms';
import { ensureOwnListing } from '../../util/data';
import { FormattedMessage } from '../../util/reactIntl';
import { types as sdkTypes } from '../../util/sdkLoader';
import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_STATE_DRAFT } from '../../util/types';
import css from './EditListingPricingPanel.css';

const { Money } = sdkTypes;

const EditListingPricingPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    isNewListingFlow,
    errors,
    values,
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { price, publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingPricingPanel.title"
      values={{
        listingTitle: (
          <ListingLink listing={listing}>
            <FormattedMessage id="EditListingPricingPanel.listingTitle" />
          </ListingLink>
        ),
      }}
    />
  ) : (
    <FormattedMessage id="EditListingPricingPanel.createListingTitle" />
  );

  const [bookingType_entireSpace, setBookingType_entireSpace] = useState(
    publicData?.bookingType_entireSpace
  );
  const [bookingType_individual, setBookingType_individual] = useState(
    publicData?.bookingType_individual
  );
  const [spaceRentalAvailability, setSpaceRentalAvailability] = useState(
    publicData?.spaceRentalAvailability
  );

  // const [price_entireSpace_hourly, setPrice_entireSpace_hourly] = useState(
  //   publicData?.price_entireSpace_hourly
  // );

  // const [price_entireSpace_daily, setPrice_entireSpace_daily] = useState(
  //   publicData?.price_entireSpace_daily
  // );

  // const [price_individual_hourly, setPrice_individual_hourly] = useState(
  //   publicData?.price_individual_hourly
  // );

  // const [price_individual_daily, setPrice_individual_daily] = useState(
  //   publicData?.price_individual_daily
  // );

  // const bookingTypeOptions = findOptionsForSelectFilter('bookingType', config.custom.filters);
  const spaceRentalAvailabilityOptions = findOptionsForSelectFilter(
    'spaceRentalAvailability',
    config.custom.filters
  );
  const bookingTypeOptions = [
    { key: 'hourly', label: 'Hourly' },
    { key: 'daily', label: 'Daily' },
  ];
  const removeDuplicates = (myArr, prop) => {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  };
  const priceCurrencyValid = price instanceof Money ? price.currency === config.currency : true;
  const handleOnSubmit = values => {
    const currentAvailabilityPlan = currentListing?.attributes.availabilityPlan;
    const entries = currentAvailabilityPlan?.entries || [];
    const {
      bookingType_entireSpace,
      bookingType_individual,
      spaceRentalAvailability,
      price_entireSpace_daily,
      price_entireSpace_hourly,
      price_individual_daily,
      price_individual_hourly,
    } = values;
    const price = [
      price_entireSpace_daily,
      price_entireSpace_hourly,
      price_individual_daily,
      price_individual_hourly,
    ].reduce((min, price) => {
      return min.amount < price.amount ? min : price;
    });
    let bookingType_searchOptions = [];
    if (bookingType_entireSpace?.includes('hourly') || bookingType_individual?.includes('hourly')) {
      bookingType_searchOptions.push('hourly');
    }
    if (bookingType_entireSpace?.includes('daily') || bookingType_individual?.includes('daily')) {
      bookingType_searchOptions.push('daily');
    }
    const newAvailabilityPlan =
      bookingType_searchOptions.includes('daily') && currentAvailabilityPlan
        ? {
            availabilityPlan: {
              ...currentAvailabilityPlan,
              entries: removeDuplicates(entries, 'dayOfWeek'),
            },
          }
        : null;
    console.log(newAvailabilityPlan);
    const updatedValues = {
      price,
      publicData: {
        bookingType_entireSpace,
        bookingType_individual,
        bookingTypes: bookingType_searchOptions,
        price_entireSpace_daily: price_entireSpace_daily.amount,
        price_entireSpace_hourly: price_entireSpace_hourly.amount,
        price_individual_daily: price_individual_daily.amount,
        price_individual_hourly: price_individual_hourly.amount,
        spaceRentalAvailability,
      },
      ...newAvailabilityPlan,
    };
    console.log(updatedValues);
    onSubmit(updatedValues);
  };
  const form = priceCurrencyValid ? (
    <EditListingPricingForm
      className={css.form}
      initialValues={{
        bookingType_entireSpace: publicData?.bookingType_entireSpace || [],
        bookingType_individual: publicData?.bookingType_individual || [],
        price_entireSpace_daily: new Money(
          publicData?.price_entireSpace_daily || 100,
          config.currency
        ),
        price_entireSpace_hourly: new Money(
          publicData?.price_entireSpace_hourly || 100,
          config.currency
        ),
        price_individual_daily: new Money(
          publicData?.price_individual_daily || 100,
          config.currency
        ),
        price_individual_hourly: new Money(
          publicData?.price_individual_hourly || 100,
          config.currency
        ),
        spaceRentalAvailability: publicData?.spaceRentalAvailability || [],
      }}
      isNewListingFlow={isNewListingFlow}
      onSubmit={values => {
        handleOnSubmit(values);
      }}
      onChange={onChange}
      saveActionMsg={submitButtonText}
      disabled={disabled}
      ready={ready}
      updated={panelUpdated}
      updateInProgress={updateInProgress}
      fetchErrors={errors}
      bookingTypeOptions={bookingTypeOptions}
      spaceRentalAvailabilityOptions={spaceRentalAvailabilityOptions}
      bookingType_entireSpace={bookingType_entireSpace}
      setBookingType_entireSpace={setBookingType_entireSpace}
      bookingType_individual={bookingType_individual}
      setBookingType_individual={setBookingType_individual}
      spaceRentalAvailability={spaceRentalAvailability}
      setSpaceRentalAvailability={setSpaceRentalAvailability}
      // price_entireSpace_hourly={price_entireSpace_hourly}
      // setPrice_entireSpace_hourly={setPrice_entireSpace_hourly}
      // price_entireSpace_daily={price_entireSpace_daily}
      // setPrice_entireSpace_daily={setPrice_entireSpace_daily}
      // price_individual_hourly={price_individual_hourly}
      // setPrice_individual_hourly={setPrice_individual_hourly}
      // price_individual_daily={price_individual_daily}
      // setPrice_individual_daily={setPrice_individual_daily}
      price
    />
  ) : (
    <div className={css.priceCurrencyInvalid}>
      <FormattedMessage id="EditListingPricingPanel.listingPriceCurrencyInvalid" />
    </div>
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      {form}
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingPricingPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingPricingPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingPricingPanel;
