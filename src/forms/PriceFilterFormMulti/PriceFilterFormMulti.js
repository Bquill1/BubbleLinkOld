import React from 'react';
import { bool, func, number, object, string } from 'prop-types';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { Field, Form as FinalForm, FormSpy } from 'react-final-form';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';

import { Form, RangeSlider } from '../../components';
import css from './PriceFilterFormMulti.css';

const DEBOUNCE_WAIT_TIME = 400;

// Helper function to parse value for min handle
// Value needs to be between slider's minimum value and current maximum value
const parseMin = (min, currentMax) => value => {
  const parsedValue = Number.parseInt(value, 10);
  if (isNaN(parsedValue)) {
    return '';
  }
  return parsedValue < min ? min : parsedValue > currentMax ? currentMax : parsedValue;
};

// Helper function to parse value for max handle
// Value needs to be between slider's max value and current minimum value
const parseMax = (max, currentMin) => value => {
  const parsedValue = Number.parseInt(value, 10);
  if (isNaN(parsedValue)) {
    return '';
  }
  return parsedValue < currentMin ? currentMin : parsedValue > max ? max : parsedValue;
};

// PriceFilterForm component
const PriceFilterFormComponent = props => {
  const { liveEdit, onChange, onSubmit, onCancel, onClear, ...rest } = props;
  if (liveEdit && !onChange) {
    throw new Error('PriceFilterForm: if liveEdit is true you need to provide onChange function');
  }

  if (!liveEdit && !(onCancel && onClear && onSubmit)) {
    throw new Error(
      'PriceFilterForm: if liveEdit is false you need to provide onCancel, onClear, and onSubmit functions'
    );
  }

  const handleChange = debounce(
    formState => {
      if (formState.dirty) {
        const { minPrice, maxPrice, ...restValues } = formState.values;
        onChange({
          minPrice: minPrice === '' ? rest.min : minPrice,
          maxPrice: maxPrice === '' ? rest.max : maxPrice,
          ...restValues,
        });
      }
    },
    DEBOUNCE_WAIT_TIME,
    { leading: false, trailing: true }
  );

  const handleSubmit = values => {
    const {
      minPricePerDay,
      maxPricePerDay,
      minPricePerHour,
      maxPricePerHour,
      ...restValues
    } = values;
    return onSubmit({
      minPricePerDay: minPricePerDay === '' ? rest.min : minPricePerDay,
      maxPricePerDay: maxPricePerDay === '' ? rest.max : maxPricePerDay,
      minPricePerHour: minPricePerHour === '' ? rest.min : minPricePerHour,
      maxPricePerHour: maxPricePerHour === '' ? rest.max : maxPricePerHour,
      ...restValues,
    });
  };

  const formCallbacks = liveEdit
    ? { onSubmit: () => null }
    : { onSubmit: handleSubmit, onCancel, onClear };
  return (
    <FinalForm
      {...rest}
      {...formCallbacks}
      render={formRenderProps => {
        const {
          form,
          handleSubmit,
          id,
          showAsPopup,
          onClear,
          onCancel,
          isOpen,
          contentRef,
          style,
          intl,
          values,
          priceFilterParams,
          initialValues,
          min,
          max,
          step,
        } = formRenderProps;
        const {
          minPricePerDay: minPricePerDayRaw,
          maxPricePerDay: maxPricePerDayRaw,
          minPricePerHour: minPricePerHourRaw,
          maxPricePerHour: maxPricePerHourRaw,
        } = values;
        const minPricePerHour = typeof minPricePerHourRaw !== 'string' ? minPricePerHourRaw : min;
        const maxPricePerHour = typeof maxPricePerHourRaw !== 'string' ? maxPricePerHourRaw : max;
        const minPricePerDay = typeof minPricePerDayRaw !== 'string' ? minPricePerDayRaw : min;
        const maxPricePerDay = typeof maxPricePerDayRaw !== 'string' ? maxPricePerDayRaw : max;
        const handleCancel = () => {
          // reset the final form to initialValues
          form.reset();
          onCancel();
        };

        const clear = intl.formatMessage({ id: 'PriceFilterForm.clear' });
        const cancel = intl.formatMessage({ id: 'PriceFilterForm.cancel' });
        const submit = intl.formatMessage({ id: 'PriceFilterForm.submit' });

        const classes = classNames(css.root, {
          [css.popup]: showAsPopup,
          [css.isOpenAsPopup]: showAsPopup && isOpen,
          [css.plain]: !showAsPopup,
          [css.isOpen]: !showAsPopup && isOpen,
        });

        return (
          <Form
            className={classes}
            onSubmit={handleSubmit}
            tabIndex="0"
            contentRef={contentRef}
            style={{ minWidth: '300px', ...style }}
          >
            <div className={css.contentWrapper}>
              {!priceFilterParams || priceFilterParams === 'hourly' ? (
                <div className={css.pricePerHourWrapper}>
                  <span className={css.label}>
                    <FormattedMessage id="PriceFilterForm.labelHour" />
                  </span>
                  <div className={css.inputsWrapper}>
                    <Field
                      className={css.minPrice}
                      id={`${id}.hour.minPrice`}
                      name="minPricePerHour"
                      component="input"
                      type="number"
                      placeholder={min}
                      min={min}
                      max={max}
                      step={step}
                      parse={parseMin(min, maxPricePerHour)}
                    />
                    <span className={css.priceSeparator}>-</span>
                    <Field
                      className={css.maxPrice}
                      id={`${id}.hour.maxPrice`}
                      name="maxPricePerHour"
                      component="input"
                      type="number"
                      placeholder={max}
                      min={min}
                      max={max}
                      step={step}
                      parse={parseMax(max, minPricePerHour)}
                    />
                  </div>
                  <div className={css.sliderWrapper}>
                    <RangeSlider
                      min={min}
                      max={max}
                      step={step}
                      handles={[minPricePerHour || min, maxPricePerHour || max]}
                      onChange={handles => {
                        form.change('minPricePerHour', handles[0]);
                        form.change('maxPricePerHour', handles[1]);
                      }}
                    />
                  </div>
                </div>
              ) : null}
              {!priceFilterParams || priceFilterParams === 'daily' ? (
                <div className={css.pricePerDayWrapper}>
                  <span className={css.label}>
                    <FormattedMessage id="PriceFilterForm.labelDay" />
                  </span>
                  <div className={css.inputsWrapper}>
                    <Field
                      className={css.minPrice}
                      id={`${id}.day.minPrice`}
                      name="minPricePerDay"
                      component="input"
                      type="number"
                      placeholder={min}
                      min={min}
                      max={max}
                      step={step}
                      parse={parseMin(min, maxPricePerDay)}
                    />
                    <span className={css.priceSeparator}>-</span>
                    <Field
                      className={css.maxPrice}
                      id={`${id}.day.maxPrice`}
                      name="maxPricePerDay"
                      component="input"
                      type="number"
                      placeholder={max}
                      min={min}
                      max={max}
                      step={step}
                      parse={parseMax(max, minPricePerDay)}
                    />
                  </div>

                  <div className={css.sliderWrapper}>
                    <RangeSlider
                      min={min}
                      max={max}
                      step={step}
                      handles={[minPricePerDay || min, maxPricePerDay || max]}
                      onChange={handles => {
                        form.change('minPricePerDay', handles[0]);
                        form.change('maxPricePerDay', handles[1]);
                      }}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            {liveEdit ? (
              <FormSpy onChange={handleChange} subscription={{ values: true, dirty: true }} />
            ) : (
              <div className={css.buttonsWrapper}>
                <button className={css.clearButton} type="button" onClick={onClear}>
                  {clear}
                </button>
                <button className={css.cancelButton} type="button" onClick={handleCancel}>
                  {cancel}
                </button>
                <button className={css.submitButton} type="submit">
                  {submit}
                </button>
              </div>
            )}
          </Form>
        );
      }}
    />
  );
};

PriceFilterFormComponent.defaultProps = {
  liveEdit: false,
  showAsPopup: false,
  isOpen: false,
  contentRef: null,
  style: null,
  min: 0,
  step: 1,
  onCancel: null,
  onChange: null,
  onClear: null,
  onSubmit: null,
};

PriceFilterFormComponent.propTypes = {
  id: string.isRequired,
  liveEdit: bool,
  showAsPopup: bool,
  onCancel: func,
  onChange: func,
  onClear: func,
  onSubmit: func,
  isOpen: bool,
  contentRef: func,
  style: object,
  min: number.isRequired,
  max: number.isRequired,
  step: number,

  // form injectIntl
  intl: intlShape.isRequired,
};

const PriceFilterForm = injectIntl(PriceFilterFormComponent);

export default PriceFilterForm;
