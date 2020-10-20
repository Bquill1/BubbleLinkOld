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
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { description, title, publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingBasicsPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
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
        initialValues={{ category, propertyType, capacity, spaceType }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          console.log(values)
          const { category, propertyType, capacity, spaceType } = values;
          const updateValues = {
            title: title || 'John and Jane’s place',
            publicData: { propertyType, category, capacity, spaceType },
          };
          console.log(updateValues);
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
