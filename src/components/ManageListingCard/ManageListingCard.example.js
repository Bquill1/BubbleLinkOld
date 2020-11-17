/* eslint-disable no-console */
import React from 'react';
import { createOwnListing, fakeIntl } from '../../util/test-data';
import {
    LISTING_STATE_CLOSED,

    LISTING_STATE_DRAFT, LISTING_STATE_PENDING_APPROVAL
} from '../../util/types';
import ManageListingCard from './ManageListingCard';

const noop = () => null;

const ManageListingCardWrapper = props => (
  <div style={{ maxWidth: '400px' }}>
    <ManageListingCard {...props} />
  </div>
);

export const Published = {
  component: ManageListingCardWrapper,
  props: {
    hasClosingError: false,
    hasOpeningError: false,
    intl: fakeIntl,
    listing: createOwnListing('listing-published'),
    isMenuOpen: false,
    onCloseListing: noop,
    onOpenListing: noop,
    onToggleMenu: noop,
    history: { push: noop },
  },
};

export const Closed = {
  component: ManageListingCardWrapper,
  props: {
    hasClosingError: false,
    hasOpeningError: false,
    intl: fakeIntl,
    listing: createOwnListing('listing-closed', {
      state: LISTING_STATE_CLOSED,
    }),
    isMenuOpen: false,
    onCloseListing: noop,
    onOpenListing: noop,
    onToggleMenu: noop,
    history: { push: noop },
  },
};

export const PendingApproval = {
  component: ManageListingCardWrapper,
  props: {
    hasClosingError: false,
    hasOpeningError: false,
    intl: fakeIntl,
    listing: createOwnListing('listing-pending', {
      state: LISTING_STATE_PENDING_APPROVAL,
    }),
    isMenuOpen: false,
    onCloseListing: noop,
    onOpenListing: noop,
    onToggleMenu: noop,
    history: { push: noop },
  },
};

export const Draft = {
  component: ManageListingCardWrapper,
  props: {
    hasClosingError: false,
    hasOpeningError: false,
    intl: fakeIntl,
    listing: createOwnListing('listing-draft', {
      state: LISTING_STATE_DRAFT,
    }),
    isMenuOpen: false,
    onCloseListing: noop,
    onOpenListing: noop,
    onToggleMenu: noop,
    history: { push: noop },
  },
};
