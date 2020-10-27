import React from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '..';
import { EditListingBasicsForm } from '../../forms';
import config from '../../config';

import css from './EditListingBasicsPanel.css';
const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const EditListingBasicsPanel = props => {
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
  } = props;

  // Create entries from submit values
  const createEntriesFromSubmitValues = values =>
    WEEKDAYS.reduce((allEntries, dayOfWeek) => {
      const dayValues = values[dayOfWeek] || [];
      const dayEntries = dayValues.map(dayValue => {
        const { startTime, endTime, seats } = dayValue;
        // Note: This template doesn't support seats yet.
        return startTime && endTime
          ? {
              dayOfWeek,
              seats: seats || 1,
              startTime,
              endTime: endTime === '24:00' ? '00:00' : endTime,
            }
          : null;
      });

      return allEntries.concat(dayEntries.filter(e => !!e));
    }, []);

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { description, title, publicData } = currentListing.attributes;
  console.log(currentListing);
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingBasicsPanel.title"
      values={{
        listingTitle: <ListingLink listing={listing} />,
      }}
    />
  ) : (
    <FormattedMessage id="EditListingBasicsPanel.createListingTitle" />
  );

  const spaceTypeOptions = findOptionsForSelectFilter('spaceType', config.custom.filters);
  const propertyTypeOptions = findOptionsForSelectFilter('propertyType', config.custom.filters);
  const categoryOptions = findOptionsForSelectFilter('category', config.custom.filters);
  const { category, propertyType, capacity, spaceType } = publicData;
  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingBasicsForm
        className={css.form}
        initialValues={{
          category,
          propertyType,
          capacity,
          spaceType,
        }}
        isNewListingFlow={isNewListingFlow}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { category, propertyType, capacity, spaceType } = values;
          const currentAvailabilityPlan = currentListing?.attributes.availabilityPlan;
          const entries = currentAvailabilityPlan?.entries || [];
          const newAvailabilityPlan = {availabilityPlan: {
              ...currentAvailabilityPlan,
              entries: entries.map(e => {
                return { ...e, seats: capacity };
              }),
            },}
          let updateValues = {
            title: title || 'John and Jane’s place',
            publicData: {
              propertyType,
              category,
              capacity,
              spaceType,
            },
          };
          if(!!currentAvailabilityPlan){
            updateValues = {
              ...updateValues,
              ...newAvailabilityPlan,
            };
          }
          console.log(updateValues)
          onSubmit(updateValues);
        }}
        onChange={onChange}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        spaceTypeOptions={spaceTypeOptions}
        categories={categoryOptions}
        propertyType={propertyTypeOptions}
      />
    </div>
  );
};

EditListingBasicsPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditListingBasicsPanel.propTypes = {
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

export default EditListingBasicsPanel;
