/*
 * Renders a group of checkboxes that can be used to select
 * multiple values from a set of options.
 *
 * The corresponding component when rendering the selected
 * values is PropertyGroup.
 *
 */

import classNames from 'classnames';
import { arrayOf, bool, node, shape, string } from 'prop-types';
import React from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { FieldCheckbox, ValidationError } from '../../components';
import css from './FieldCheckboxGroup.css';


const FieldCheckboxRenderer = props => {
  const { className, rootClassName, listClass, label, id, fields, options, twoColumns, meta } = props;

  const classes = classNames(rootClassName || css.root, className);
  const listClasses = classNames(
    listClass,
    css.list,
    { [css.twoColumns]: options.length > 12 || twoColumns },
    { [css.threeColumns]: options.length > 24 }
  );

  return (
    <fieldset className={classes}>
      {label ? <legend>{label}</legend> : null}
      <ul className={listClasses}>
        {options.map((option, index) => {
          const fieldId = `${id}.${option.key}`;
          return (
            <li key={fieldId} className={css.item}>
              <FieldCheckbox
                id={fieldId}
                name={fields.name}
                label={option.label}
                value={option.key}
              />
            </li>
          );
        })}
      </ul>
      <ValidationError fieldMeta={{ ...meta }} />
    </fieldset>
  );
};

FieldCheckboxRenderer.defaultProps = {
  rootClassName: null,
  className: null,
  label: null,
  twoColumns: false,
};

FieldCheckboxRenderer.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  label: node,
  options: arrayOf(
    shape({
      key: string.isRequired,
      label: node.isRequired,
    })
  ).isRequired,
  twoColumns: bool,
};

const FieldCheckboxGroup = props => <FieldArray component={FieldCheckboxRenderer} {...props} />;

// Name and component are required fields for FieldArray.
// Component-prop we define in this file, name needs to be passed in
FieldCheckboxGroup.propTypes = {
  name: string.isRequired,
};

export default FieldCheckboxGroup;
