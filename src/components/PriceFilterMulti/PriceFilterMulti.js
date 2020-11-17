import { bool } from 'prop-types';
import React from 'react';
import PriceFilterMultiPlain from './PriceFilterMultiPlain';
import PriceFilterMultiPopup from './PriceFilterMultiPopup';

const PriceFilterMulti = props => {
  const { showAsPopup, ...rest } = props;
  console.log(props)
  return showAsPopup ? <PriceFilterMultiPopup {...rest} /> : <PriceFilterMultiPlain {...rest} />;
};

PriceFilterMulti.defaultProps = {
  showAsPopup: false,
};

PriceFilterMulti.propTypes = {
  showAsPopup: bool,
};

export default PriceFilterMulti;
