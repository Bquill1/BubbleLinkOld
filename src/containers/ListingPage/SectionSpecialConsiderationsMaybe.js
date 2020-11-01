import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './SectionSpecialConsiderationsMaybe.css';

const SectionSpecialConsiderationsMaybe = props => {
  const { className, rootClassName, publicData } = props;
  const classes = classNames(rootClassName || css.root, className);
  return publicData && publicData.specialConsiderations ? (
    <div className={classes}>
      <h2 className={css.title}>
        <FormattedMessage id="ListingPage.specialConsiderationsTitle" />
      </h2>
      <p className={css.specialConsiderations}>{publicData.specialConsiderations}</p>
    </div>
  ) : null;
};

SectionSpecialConsiderationsMaybe.defaultProps = { className: null, rootClassName: null };

SectionSpecialConsiderationsMaybe.propTypes = {
  className: string,
  rootClassName: string,
  considerations: string,
};

export default SectionSpecialConsiderationsMaybe;
