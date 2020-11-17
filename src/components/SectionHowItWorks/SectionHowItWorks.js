import { faEdit, faHandshake, faSearchLocation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { bool, string } from 'prop-types';
import React from 'react';
import { NamedLink } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import css from './SectionHowItWorks.css';


const SectionHowItWorks = props => {
  const {
    rootClassName,
    className,
    currentUserListing,
    currentUserListingFetched,
    isAuthenticated,
    currentUserIsHost,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id="SectionHowItWorks.titleLineOne" />
        {/*<br />
        <FormattedMessage id="SectionHowItWorks.titleLineTwo" />*/}
      </div>

      <div className={css.steps}>
        <div className={css.step}>
          <div className={css.iconWrapper}>
            <FontAwesomeIcon className={css.iconClassName} size={'2x'} icon={faSearchLocation} />
          </div>
          <h2 className={css.stepTitle}>
            <FormattedMessage id="SectionHowItWorks.part1Title" />
          </h2>
          <p>
            <FormattedMessage id="SectionHowItWorks.part1Text" />
          </p>
        </div>

        <div className={css.step}>
          <div className={css.iconWrapper}>
            <FontAwesomeIcon className={css.iconClassName} size={'2x'} icon={faHandshake} />
          </div>
          <h2 className={css.stepTitle}>
            <FormattedMessage id="SectionHowItWorks.part2Title" />
          </h2>
          <p>
            <FormattedMessage id="SectionHowItWorks.part2Text" />
          </p>
        </div>

        <div className={css.step}>
          <div className={css.iconWrapper}>
            <FontAwesomeIcon className={css.iconClassName} size={'2x'} icon={faEdit} />
          </div>
          <h2 className={css.stepTitle}>
            <FormattedMessage id="SectionHowItWorks.part3Title" />
          </h2>
          <p>
            <FormattedMessage id="SectionHowItWorks.part3Text" />
          </p>
        </div>
      </div>
      <div className={css.createListingLink}>
        {!isAuthenticated || !currentUserIsHost ? (
          <NamedLink name="HostPage">
            <FormattedMessage id="SectionHowItWorks.createListingLink" />
          </NamedLink>
        ) : null
        // <OwnListingLink listing={currentUserListing} listingFetched={currentUserListingFetched}>
        //   <FormattedMessage id="SectionHowItWorks.createListingLink" />
        // </OwnListingLink>
        }
      </div>
    </div>
  );
};

SectionHowItWorks.defaultProps = {
  rootClassName: null,
  className: null,
  currentUserListing: null,
  currentUserListingFetched: false,
};

SectionHowItWorks.propTypes = {
  rootClassName: string,
  className: string,
  currentUserListing: propTypes.ownListing,
  currentUserListingFetched: bool,
};

export default SectionHowItWorks;
