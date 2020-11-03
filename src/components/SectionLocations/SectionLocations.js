import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';

import { NamedLink } from '../../components';

import css from './SectionLocations.css';

import dublinImage from './images/location_dublin.jpg';
import londonImage from './images/location_london.jpg';
import parisImage from './images/location_paris.jpg';
import berlinImage from './images/location_berlin.jpg';

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
      <div className={css.linkText}>
        <FormattedMessage
          id="SectionLocations.listingsInLocation"
          values={{ location: nameText }}
        />
      </div>
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
          'London',
          londonImage,
          '?address=London%2C%20England&bounds=51.669993%2C0.152641%2C51.384598%2C-0.35167&origin=51.5007325%2C-0.1268141'
        )}
        {locationLink(
          'Cork',
          parisImage,
          '?address=Cork%2C%20Ireland&bounds=51.937444%2C-8.389492%2C51.866048%2C-8.584363&origin=51.8984206%2C-8.474596'
        )}
  {/*      {locationLink(
          'Paris',
          parisImage,
          '?address=Paris%2C%20France&bounds=48.9020129995121%2C2.46976999462145%2C48.8156060108013%2C2.22422400085346&origin=48.8737952%2C2.2928388'
        )}
	 {locationLink(
          'Berlin',
          berlinImage,
          '?address=Berlin%2C%20Germany&bounds=52.6755029827484%2C13.761131997363%2C52.3382670008426%2C13.0883590415111&origin=52.5162778%2C13.3755154'
        )} */}
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
