import classNames from 'classnames';
import { string } from 'prop-types';
import React from 'react';
import { SectionSearchBlock } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';
import css from './SectionHero.css';


const SectionHero = props => {
  const { rootClassName, className, filterConfig, isMobile } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.heroContent}>
        <div className={css.heroContentLeft}>
          <SectionSearchBlock
            onManageDisableScrolling={e => null}
            filters={filterConfig}
            isMobile={isMobile}
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
          {/* <NamedLink
            name="SearchPage"
            to={{
              search:
                'address=Ireland&bounds=55.491706697008%2C-5.89464820858818%2C51.3578577000216%2C-10.7627796895861',
            }}
            className={css.heroButton}
          >
            <FormattedMessage id="SectionHero.browseButton" />
          </NamedLink> */}
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
