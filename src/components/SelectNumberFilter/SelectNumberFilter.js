import { bool } from 'prop-types';
import React from 'react';
import SelectNumberFilterPlain from './SelectNumberFilterPlain';
import SelectNumberFilterPopup from './SelectNumberFilterPopup';

const SelectNumberFilter = props => {
  const { showAsPopup, ...rest } = props;
  return showAsPopup ? (
    <SelectNumberFilterPopup {...rest} />
  ) : (
    <SelectNumberFilterPlain {...rest} />
  );
};

SelectNumberFilter.defaultProps = {
  showAsPopup: false,
};

SelectNumberFilter.propTypes = {
  showAsPopup: bool,
};

export default SelectNumberFilter;
