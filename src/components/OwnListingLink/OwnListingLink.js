import { bool, object, string } from 'prop-types';
import React from 'react';
import { NamedLink } from '../../components';
import { ensureOwnListing } from '../../util/data';
import { FormattedMessage } from '../../util/reactIntl';
import { LISTING_STATE_DRAFT, propTypes } from '../../util/types';
import { createSlug, getListingType } from '../../util/urlHelpers';
import css from './OwnListingLink.css';


const OwnListingLink = props => {
  const { className, listing, listingFetched, children } = props;

  if (!listingFetched) {
    return null;
  }

  if (!listing) {
    return (
      <NamedLink className={className ? className : css.defaultLinkStyle} name="NewListingPage">
        {children ? children : <FormattedMessage id="OwnListingLink.addYourListingLink" />}
      </NamedLink>
    );
  }

  const currentListing = ensureOwnListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', state } = currentListing.attributes;
  const slug = createSlug(title);
  const isDraft = state === LISTING_STATE_DRAFT;

  return (
    <NamedLink
      className={className ? className : css.yourListingsLink}
      name="EditListingPage"
      params={{
        id,
        slug,
        type: getListingType(isDraft),
        tab: 'basics',
      }}
    >
      <span className={css.menuItemBorder} />
      {children ? children : <FormattedMessage id="OwnListingLink.editYourListingLink" />}
    </NamedLink>
  );
};

OwnListingLink.defaultProps = {
  className: null,
  listing: null,
  listingFetched: false,
  children: null,
};

OwnListingLink.propTypes = {
  className: string,
  listing: propTypes.ownListing,
  listingFetched: bool,
  children: object,
};

export default OwnListingLink;
