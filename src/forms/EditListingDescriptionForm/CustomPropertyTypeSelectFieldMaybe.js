import React from 'react';
import { required } from '../../util/validators';
import { FieldSelect } from '../../components';

import css from './EditListingDescriptionForm.css';

const CustomPropertyTypeSelectFieldMaybe = props => {
  const { name, id, propertyType, intl } = props;
  const propertyTypeLabel = intl.formatMessage({
    id: 'EditListingDescriptionForm.propertyTypeLabel',
  });
  const propertyTypePlaceholder = intl.formatMessage({
    id: 'EditListingDescriptionForm.propertyTypePlaceholder',
  });
  const propertyTypeRequired = required(
    intl.formatMessage({
      id: 'EditListingDescriptionForm.propertyTypeRequired',
    })
  );
  return propertyType ? (
    <FieldSelect
      className={css.propertyType}
      name={name}
      id={id}
      label={propertyTypeLabel}
      validate={propertyTypeRequired}
    >
      <option disabled value="">
        {propertyTypePlaceholder}
      </option>
      {propertyType.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default CustomPropertyTypeSelectFieldMaybe;
