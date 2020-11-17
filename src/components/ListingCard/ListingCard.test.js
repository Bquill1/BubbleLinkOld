import React from 'react';
import { createListing, createUser, fakeIntl } from '../../util/test-data';
import { renderShallow } from '../../util/test-helpers';
import { ListingCardComponent } from './ListingCard';

describe('ListingCard', () => {
  it('matches snapshot', () => {
    const listing = createListing('listing1', {}, { author: createUser('user1') });
    const tree = renderShallow(<ListingCardComponent listing={listing} intl={fakeIntl} />);
    expect(tree).toMatchSnapshot();
  });
});
