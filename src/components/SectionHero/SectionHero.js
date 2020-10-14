import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { NamedLink, SectionSearchBlock } from '../../components';
import FilterComponent from '../../containers/SearchPage/FilterComponent';

import css from './SectionHero.css';

const SectionHero = props => {
  const { rootClassName, className, filterConfig } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.heroContent}>
        <div className={css.heroContentLeft}>
          <SectionSearchBlock
            className={css.searchFiltersMobile}
            showAsModalMaxWidth={768}
            onManageDisableScrolling={e => null}
            filters={filterConfig}
            onSubmit={e => console.log(e)}
          />
        </div>
        <div className={css.heroContentRight}>
          <h1 className={css.heroMainTitle}>
            <FormattedMessage id="SectionHero.title" />
          </h1>
          <h2 className={css.heroSubTitle}>
            <FormattedMessage id="SectionHero.subTitle" />
          </h2>
          <NamedLink
            name="SearchPage"
            to={{
              search:
                'address=Ireland&bounds=55.491706697008%2C-5.89464820858818%2C51.3578577000216%2C-10.7627796895861',
            }}
            className={css.heroButton}
          >
            <FormattedMessage id="SectionHero.browseButton" />
          </NamedLink>
        </div>
      </div>
    </div>
  );
};

SectionHero.defaultProps = { rootClassName: null, className: null };

SectionHero.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionHero;
