import classNames from 'classnames';
import React from 'react';
import { AvatarMedium, NamedLink, ResponsiveImage } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';
import { createSlug, stringify } from '../../util/urlHelpers';
import css from './TransactionPanel.css';


const createListingLink = (
  listingId,
  label,
  listingDeleted,
  provider,
  searchParams = {},
  className = ''
) => {
  if (!listingDeleted) {
    const params = { id: listingId, slug: createSlug(label) };
    const to = { search: stringify(searchParams) };
    return (
      <NamedLink className={className} name="ListingPage" params={params} to={to}>
        <AvatarMedium user={provider} disableProfileLink />
      </NamedLink>
    );
  } else {
    return <FormattedMessage id="TransactionPanel.deletedListingOrderTitle" />;
  }
};

// Functional component as a helper to build AddressLinkMaybe
const DetailCardImage = props => {
  const {
    className,
    rootClassName,
    avatarWrapperClassName,
    listingId,
    listingTitle,
    listingDeleted,
    image,
    provider,
    isCustomer,
  } = props;

  const classes = classNames(rootClassName || css.detailCardImageWrapper, className);
  const listingLink = createListingLink(listingId, listingTitle, listingDeleted, provider);

  return (
    <React.Fragment>
      <div className={classes}>
        <div className={css.aspectWrapper}>
          <ResponsiveImage
            rootClassName={css.rootForImage}
            alt={listingTitle}
            image={image}
            variants={['landscape-crop', 'landscape-crop2x']}
          />
        </div>
      </div>
      {isCustomer ? (
        <div className={avatarWrapperClassName || css.avatarWrapper}>{listingLink}</div>
      ) : null}
    </React.Fragment>
  );
};

export default DetailCardImage;
