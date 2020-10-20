import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { NamedLink, SectionSearchBlock } from '..';

import css from './SectionHostHero.css';

const SectionHostHero = props => {
  const { rootClassName, className, filterConfig } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.heroContent}>
        <div className={css.heroContentLeft}>
          <h1 className={css.heroMainTitle}>
            <FormattedMessage id="SectionHostHero.title" />
          </h1>
          <h2 className={css.heroSubTitle}>
            <FormattedMessage id="SectionHostHero.subTitle" />
          </h2>
          <NamedLink
            name="SearchPage"
            to={{
              search:
                'address=Ireland&bounds=55.491706697008%2C-5.89464820858818%2C51.3578577000216%2C-10.7627796895861',
            }}
            className={css.heroButton}
          >
            <FormattedMessage id="SectionHostHero.browseButton" />
          </NamedLink>
        </div>
        <div className={css.heroContentRight}>



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
