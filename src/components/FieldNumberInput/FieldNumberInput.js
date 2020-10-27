import React, { Component } from 'react';
import { omit } from 'lodash';
import { bool, func, object, shape, string } from 'prop-types';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { ValidationError, Button } from '..';
import { isSafeNumber, isPositive } from '../../util/currency';

import css from './FieldNumberInput.css';
import { getAvailabilityPlan } from '../../util/api';

class FieldNumberInputComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: null,
    };
    this.onInputChange = this.onInputChange.bind(this);
    // this.onInputBlur = this.onInputBlur.bind(this);
    // this.onInputFocus = this.onInputFocus.bind(this);
    this.updateValues = this.updateValues.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }
  onButtonClick(val) {
    this.onInputChange({
      target: { value: '' + (parseInt(this.state.count) + parseInt(val)) },
    });
  }
  onInputChange(val) {
    // Update value strings on state
    const count = this.updateValues(val);
    // Notify parent component about current price change
    this.props.input.onChange(count);
  }

  updateValues(event) {
    try {
      const { min, max } = this.props;
      let targetValue = parseInt(event.target.value.trim());
      const isInRange = targetValue >= min && targetValue <= max;
      const isSafeValue = targetValue > 0 && Number.isInteger(targetValue) && isInRange;
      if (!isSafeValue) {
        throw new Error(`Unsafe value: ${targetValue}`);
      }

      this.setState({
        count: targetValue,
      });

      return targetValue;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);

      // If an error occurs while filling input field, use previous values
      // This ensures that string like '12.3r' doesn't end up to a state.
      const { count } = this.state;
      return count;
    }
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      rootClassName,
      className,
      inputRootClass,
      customErrorText,
      id,
      label,
      input,
      meta,
      onUnmount,
      isUncontrolled,
      inputRef,
      initialCap,
      values,
      ...rest
    } = this.props;
    console.log(this.props);
    /* eslint-enable no-unused-vars */
    if (this.state.count === null) {
      this.setState({ count: input.value });
    }
    if (label && !id) {
      throw new Error('id required when a label is given');
    }

    const { valid, invalid, touched, error } = meta;
    const isTextarea = input.type === 'textarea';
    const errorText = customErrorText || error;

    // Error message and input error styles are only shown if the
    // field has been touched and the validation has failed.
    const hasError = !!customErrorText || !!(touched && invalid && error);

    const fieldMeta = { touched: hasError, error: errorText };

    // Textarea doesn't need type.
    const { type, ...inputWithoutType } = input;
    // Uncontrolled input uses defaultValue instead of value.
    const { value: defaultValue, ...inputWithoutValue } = input;
    // Use inputRef if it is passed as prop.
    const refMaybe = inputRef ? { ref: inputRef } : {};

    const inputClasses =
      inputRootClass ||
      classNames(css.input, {
        [css.inputSuccess]: valid,
        [css.inputError]: hasError,
        [css.textarea]: isTextarea,
      });
    const handleFocus = event => {console.log(1111); event.target.select();}
    const inputProps = { className: inputClasses, id, type, ...refMaybe, ...input, ...rest };
    const classes = classNames(rootClassName || css.root, className);
    return (
      <div className={classes}>
        {label ? <label htmlFor={id}>{label}</label> : null}
        <div className={css.numberWrapper}>
          <div className={css.buttonWrapper}>
            <Button
              className={css.numberButton}
              onClick={e => {
                e.preventDefault();
                this.onButtonClick(-1);
              }}
            >
              -
            </Button>
          </div>
          <input
            className={inputProps.className}
            value={input.value}
            onChange={this.onInputChange}
            type="text"
            onFocus={handleFocus}
          />
          <div className={css.buttonWrapper}>
            <Button
              className={css.numberButton}
              onClick={e => {
                e.preventDefault();
                this.onButtonClick(1);
              }}
            >
              +
            </Button>
          </div>
        </div>
        <ValidationError fieldMeta={fieldMeta} />
      </div>
    );
  }
}

FieldNumberInputComponent.defaultProps = {
  rootClassName: null,
  className: null,
  inputRootClass: null,
  onUnmount: null,
  customErrorText: null,
  id: null,
  label: null,
  isUncontrolled: false,
  inputRef: null,
};

FieldNumberInputComponent.propTypes = {
  rootClassName: string,
  className: string,
  inputRootClass: string,

  onUnmount: func,

  // Error message that can be manually passed to input field,
  // overrides default validation message
  customErrorText: string,

  // Label is optional, but if it is given, an id is also required so
  // the label can reference the input in the `for` attribute
  id: string,
  label: string,

  // Uncontrolled input uses defaultValue prop, but doesn't pass value from form to the field.
  // https://reactjs.org/docs/uncontrolled-components.html#default-values
  isUncontrolled: bool,
  // a ref object passed for input element.
  inputRef: object,

  // Generated by final-form's Field component
  input: shape({
    onChange: func.isRequired,
    // Either 'textarea' or something that is passed to the input element
    type: string.isRequired,
  }).isRequired,
  meta: object.isRequired,
};

class FieldNumberInput extends Component {
  componentWillUnmount() {
    // Unmounting happens too late if it is done inside Field component
    // (Then Form has already registered its (new) fields and
    // changing the value without corresponding field is prohibited in Final Form
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }

  render() {
    return <Field component={FieldNumberInputComponent} {...this.props} />;
  }
}

export default FieldNumberInput;
