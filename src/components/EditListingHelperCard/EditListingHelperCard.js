import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';
import { Form, PrimaryButton, FieldTextInput, NamedLink } from '..';
import * as validators from '../../util/validators';

import css from './EditListingHelperCard.css';

const EditListingHelperCardComponent = props => {
  const {title, content,rootClassName, className} = props
  const classname = classNames(rootClassName, css.editListingHelperCard)
  return (
    <div className={classname}>
      <div class={css.title}>{title}</div>
      <div class={css.content}>{content}</div>
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
