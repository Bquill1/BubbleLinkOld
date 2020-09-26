import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingPricingForm } from '../../forms';
import { ensureOwnListing } from '../../util/data';
import { types as sdkTypes } from '../../util/sdkLoader';
import { findOptionsForSelectFilter } from '../../util/search';

import config from '../../config';

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
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { price, publicData } = currentListing.attributes;
  const {
    bookingType = 'hourly',
    spaceRentalAvailability = 'entireSpace',
    pricePerSpace = 0,
    priceForEntire = 0,
  } = publicData;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingPricingPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingPricingPanel.createListingTitle" />
  );

  const bookingTypeOptions = findOptionsForSelectFilter('bookingType', config.custom.filters);
  const spaceRentalAvailabilityOptions = findOptionsForSelectFilter(
    'spaceRentalAvailability',
    config.custom.filters
  );

  const priceCurrencyValid = price instanceof Money ? price.currency === config.currency : true;
  const form = priceCurrencyValid ? (
    <EditListingPricingForm
      className={css.form}
      initialValues={{
        pricePerSpace: new Money(pricePerSpace, config.currency),
        priceForEntire: new Money(priceForEntire, config.currency),
        bookingType,
        spaceRentalAvailability,
      }}
      onSubmit={values => {
        console.log(values);
        const { pricePerSpace, priceForEntire, bookingType, spaceRentalAvailability } = values;
        const price = [pricePerSpace, priceForEntire].reduce((min, price) => {
          return min.amount < price.amount ? min : price;
        });
        console.log(price);
        const updatedValues = {
          price,
          publicData: {
            pricePerSpace: pricePerSpace.amount,
            priceForEntire: priceForEntire.amount,
            bookingType,
            spaceRentalAvailability,
          },
        };
        console.log(updatedValues);

        onSubmit(updatedValues);
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
