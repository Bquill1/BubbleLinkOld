import React from 'react';
import { node, string } from 'prop-types';
import classNames from 'classnames';

import css from './BookingPanelOptionButton.css';

const BookingPanelOptionButton = props => {
  const { rootClassName, className, options, activeOption, setOption, labelKey } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <span className={classes}>
      {options.map(o => {
        const isSelected = o === activeOption;
        return (
          <div
            className={classNames(css.optionTab, { [css.selectedOptionTab]: isSelected })}
            onClick={e => setOption(o)}
          >
            {labelKey[o]}
          </div>
        );
      })}
    </span>
  );
};

BookingPanelOptionButton.defaultProps = {
  className: null,
  rootClassName: null,
  svgClassName: null,
  checkedClassName: null,
  label: null,
};

BookingPanelOptionButton.propTypes = {
  className: string,
  rootClassName: string,
  svgClassName: string,
  checkedClassName: string,

  // Id is needed to connect the label with input.
  id: string.isRequired,
  label: node,

  // Name groups several RadioButtones to an array of selected values
  name: string.isRequired,

  // RadioButton needs a value that is passed forward when user checks the RadioButton
  value: string.isRequired,
};

export default BookingPanelOptionButton;
