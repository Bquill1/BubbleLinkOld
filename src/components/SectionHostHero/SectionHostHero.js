import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { NamedLink, NamedRedirect } from '..';
import routeConfiguration from '../../routeConfiguration';
import { createResourceLocatorString } from '../../util/routes';

import css from './SectionHostHero.css';

const SectionHostHero = props => {
  const {
    rootClassName,
    className,
    isAuthenticated,
    isHost,
    currentUser,
    currentUserHasListings,
    becomeHost,
    history,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const handleBecomeHost = () => {
    becomeHost({ publicData: { isHost: true } }).then(_ => {
    history.push(createResourceLocatorString('NewListingPage', routeConfiguration(), {}, {}));
    });
  };
  return (
    <div className={classes}>
      <div className={css.heroContent}>
        <div className={css.heroContentLeft}>
          <h1 className={css.heroMainTitle}>
            <FormattedMessage id="SectionHostHero.title" />
          </h1>
          {/*<h2 className={css.heroSubTitle}>
            <FormattedMessage id="SectionHostHero.subTitle" />
          </h2>*/}
          {/* <NamedLink
            name="SearchPage"
            to={{
              search:
                'address=Ireland&bounds=55.491706697008%2C-5.89464820858818%2C51.3578577000216%2C-10.7627796895861',
            }}
            className={css.heroButton}
          >
            <FormattedMessage id="SectionHostHero.browseButton" />
          </NamedLink> */}
        </div>
        <div className={css.heroContentRight}>
          <div className={css.callToActionCard}>
            <h1 className={css.ctaTitle}>
            Hosting at a glance...</h1>
            <div className={css.ctaList}>
              <ul className={css.heroList}>
                <li>Set your own prices</li>
                <li>Manage your own availability</li>
                <li>Offer daily and/or hourly bookings</li>
                <li>Offer entire space and/or individual seats options</li>
                <li>No subscription fees</li>
              </ul>
            </div>
            {isAuthenticated && isHost ? (
              <NamedLink className={css.heroButton} name="NewListingPage">
                <span className={css.createListing}>
                  {currentUserHasListings ? (
                    <FormattedMessage id="SectionHostHero.addListing" />
                  ) : (
                    <FormattedMessage id="SectionHostHero.createListing" />
                  )}
                </span>
              </NamedLink>
            ) : isAuthenticated ? (
              <div className={css.heroButton} onClick={e => handleBecomeHost()}>
                {/* <NamedLink name="NewListingPage" className={css.heroButton}> */}
                <FormattedMessage id="SectionHostHero.becomeAHost" />
              </div>
            ) : (
              <NamedLink name="NewListingPage" className={css.heroButton}>
                <FormattedMessage id="SectionHostHero.signUp" />
              </NamedLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

SectionHostHero.defaultProps = { rootClassName: null, className: null };

SectionHostHero.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionHostHero;
