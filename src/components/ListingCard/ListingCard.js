import React, { Component } from 'react';
import { array, string, func } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';
import { LINE_ITEM_DAY, LINE_ITEM_NIGHT, propTypes } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { ensureListing } from '../../util/data';
import { richText } from '../../util/richText';
import { findOptionsForSelectFilter } from '../../util/search';
import { createSlug } from '../../util/urlHelpers';
import config from '../../config';
import { NamedLink, ResponsiveImage } from '../../components';
import { types as sdkTypes } from '../../util/sdkLoader';

import css from './ListingCard.css';
const { Money } = sdkTypes;

const MIN_LENGTH_FOR_LONG_WORDS = 10;

const priceData = (price, intl) => {
  if (price && price.currency === config.currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: intl.formatMessage(
        { id: 'ListingCard.unsupportedPrice' },
        { currency: price.currency }
      ),
      priceTitle: intl.formatMessage(
        { id: 'ListingCard.unsupportedPriceTitle' },
        { currency: price.currency }
      ),
    };
  }
  return {};
};

const getCertificateInfo = (certificateOptions, key) => {
  return certificateOptions.find(c => c.key === key);
};

class ListingImage extends Component {
  render() {
    return <ResponsiveImage {...this.props} />;
  }
}
const LazyImage = lazyLoadWithDimensions(ListingImage, { loadAfterInitialRendering: 3000 });

export const ListingCardComponent = props => {
  const {
    className,
    rootClassName,
    intl,
    listing,
    renderSizes,
    filtersConfig,
    setActiveListing,
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', publicData } = currentListing.attributes;
  const { bookingType_entireSpace, bookingType_individual } = publicData && publicData;
  const pricesFiltered = [
    bookingType_entireSpace?.includes('hourly') && publicData.price_entireSpace_hourly,
    bookingType_entireSpace?.includes('daily') && publicData.price_entireSpace_daily,
    bookingType_individual?.includes('hourly') && publicData.price_individual_hourly,
    bookingType_individual?.includes('daily') && publicData.price_individual_daily,
  ].filter(f => f && f > 0);
  console.log(pricesFiltered);

  const lowestPrice = pricesFiltered.length
    ? new Money(Math.min(...pricesFiltered), config.currency)
    : currentListing.attributes.price;
  console.log(lowestPrice);
  const lowestPriceOption = [
    publicData.price_entireSpace_hourly,
    publicData.price_entireSpace_daily,
    publicData.price_individual_hourly,
    publicData.price_individual_daily,
  ].findIndex(p => p === lowestPrice.amount);
  const unitTranslation = { 0: 'hr', 2: 'hr', 1: 'day', 3: 'day' };
  console.log(lowestPriceOption);

  const price = lowestPrice || currentListing.attributes.price;
  const slug = createSlug(title);
  const firstImage =
    currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;

  const certificateOptions = findOptionsForSelectFilter('certificate', filtersConfig);
  const certificate = publicData
    ? getCertificateInfo(certificateOptions, publicData.certificate)
    : null;
  const { formattedPrice, priceTitle } = priceData(price, intl);
  return (
    <NamedLink className={classes} name="ListingPage" params={{ id, slug }}>
      <div
        className={css.threeToTwoWrapper}
        onMouseEnter={() => setActiveListing(currentListing.id)}
        onMouseLeave={() => setActiveListing(null)}
      >
        <div className={css.aspectWrapper}>
          <LazyImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={['landscape-crop', 'landscape-crop2x']}
            sizes={renderSizes}
          />
        </div>
      </div>
      <div className={css.info}>
        <div className={css.price}>
          <div className={css.perUnit}>From:</div>
          <div className={css.priceValue} title={priceTitle}>
            {formattedPrice}
            <div className={css.perUnit}>/{unitTranslation[lowestPriceOption]}</div>
          </div>
        </div>
        <div className={css.mainInfo}>
          <div className={css.title}>
            {richText(title, {
              longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
              longWordClass: css.longWord,
            })}
          </div>
          <div className={css.certificateInfo}>
            {certificate && !certificate.hideFromListingInfo ? (
              <span>{certificate.label}</span>
            ) : null}
          </div>
        </div>
      </div>
    </NamedLink>
  );
};

ListingCardComponent.defaultProps = {
  className: null,
  rootClassName: null,
  renderSizes: null,
  filtersConfig: config.custom.filters,
  setActiveListing: () => null,
};

ListingCardComponent.propTypes = {
  className: string,
  rootClassName: string,
  filtersConfig: array,
  intl: intlShape.isRequired,
  listing: propTypes.listing.isRequired,

  // Responsive image sizes hint
  renderSizes: string,

  setActiveListing: func,
};

export default injectIntl(ListingCardComponent);
