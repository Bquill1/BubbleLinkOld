import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { injectIntl, intlShape } from '../../util/reactIntl';
import css from './EditListingHelperCard.css';


const EditListingHelperCardComponent = props => {
  const {intl, title, content,rootClassName, className} = props
  const defaultContent = intl.formatMessage({ id: 'lorem.ipsum' });
  const classname = classNames(rootClassName, css.editListingHelperCard)
  return (
    <div className={classname}>
      <div class={css.title}>{title}</div>
      <div class={css.content}>{content || defaultContent}</div>
    </div>
  );
};

EditListingHelperCardComponent.defaultProps = {
  rootClassName: null,
  className: null,
};

const { string, bool } = PropTypes;

EditListingHelperCardComponent.propTypes = {
  rootClassName: string,
  className: string,
  intl: intlShape.isRequired,
};

const EditListingHelperCard = compose(injectIntl)(EditListingHelperCardComponent);

export default EditListingHelperCard;
