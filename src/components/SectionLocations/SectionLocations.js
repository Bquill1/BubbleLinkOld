import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';

import { NamedLink } from '../../components';

import css from './SectionLocations.css';

import dublinImage from './images/location_dublin.jpg';
import corkImage from './images/location_cork.jpg';
import galwayImage from './images/location_galway.jpg';
import limerickImage from './images/location_limerick.jpg';

class LocationImage extends Component {
  render() {
    const { alt, ...rest } = this.props;
    return <img alt={alt} {...rest} />;
  }
}
const LazyImage = lazyLoadWithDimensions(LocationImage);

const locationLink = (name, image, searchQuery) => {
  const nameText = <span className={css.locationName}>{name}</span>;
  return (
    <NamedLink name="SearchPage" to={{ search: searchQuery }} className={css.location}>
      <div className={css.imageWrapper}>
        <div className={css.aspectWrapper}>
          <LazyImage src={image} alt={name} className={css.locationImage} />
        </div>
      </div>
      <div className={css.linkText}>
        <FormattedMessage
          id="SectionLocations.listingsInLocation"
          values={{ location: nameText }}
        />
      </div>
    </NamedLink>
  );
};

const SectionLocations = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id="SectionLocations.title" />
      </div>
      <div className={css.locations}>
        {locationLink(
          'Dublin',
          dublinImage,
          '?address=Dublin%2C%20Ireland&bounds=53.41166%2C-6.112993%2C53.298881%2C-6.386999&origin=53.3511492%2C-6.2629457'
        )}
        {locationLink(
          'Cork',
          corkImage,
          '?address=Cork%2C%20Ireland&bounds=51.937444%2C-8.389492%2C51.866048%2C-8.584363&origin=51.8985038%2C-8.4727372'
        )}
        {locationLink(
          'Galway',
          galwayImage,
          '?address=Galway%2C%20Ireland&bounds=53.319252%2C-8.954801%2C53.248361%2C-9.132927&origin=53.2744962%2C-9.0519317'
        )}
	{locationLink(
          'Limerick',
          limerickImage,
          '?address=Limerick%2C%20Ireland&bounds=52.689981%2C-8.573346%2C52.61291%2C-8.726285&origin=52.6616822%2C-8.6311847'
        )}
      </div>
    </div>
  );
};

SectionLocations.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

SectionLocations.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionLocations;
