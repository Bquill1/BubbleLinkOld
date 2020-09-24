import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import arrayMutators from 'final-form-arrays';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import { formatMoney } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import {
  Button,
  Form,
  FieldCurrencyInput,
  FieldRadioButton,
  FieldRangeSlider,
  FieldCurrencySliderInput,
} from '../../components';
import css from './EditListingPricingForm.css';

const { Money } = sdkTypes;
const MIN_PRICE_PER_PERSON = 5;
const MAX_PRICE_PER_PERSON = 1000;
const MIN_PRICE_FOR_ENTIRE = 5;
const MAX_PRICE_FOR_ENTIRE = 1000;

const STEP_PRICE = 1;
export const EditListingPricingFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        bookingTypeOptions,
        spaceRentalAvailabilityOptions,
        values,
        initialValues,
      } = formRenderProps;
      console.log(values);
      console.log(initialValues);
      const unitType = config.bookingUnitType;
      const isNightly = unitType === LINE_ITEM_NIGHT;
      const isDaily = unitType === LINE_ITEM_DAY;

      const translationKey = isNightly
        ? 'EditListingPricingForm.pricePerNight'
        : isDaily
        ? 'EditListingPricingForm.pricePerDay'
        : 'EditListingPricingForm.pricePerUnit';

      const pricePerUnitMessage = intl.formatMessage({
        id: translationKey,
      });
      const bookingTypeMessage = intl.formatMessage({
        id: 'EditListingPricingForm.bookingTypeMessage',
      });
      const pricePerPersonLabelHour = intl.formatMessage({
        id: 'EditListingPricingForm.pricePerPersonLabelHour',
      });
      const pricePerPersonLabelDay = intl.formatMessage({
        id: 'EditListingPricingForm.pricePerPersonLabelDay',
      });
      const priceForEntireLabelHour = intl.formatMessage({
        id: 'EditListingPricingForm.priceForEntireLabelHour',
      });
      const priceForEntireLabelDay = intl.formatMessage({
        id: 'EditListingPricingForm.priceForEntireLabelDay',
      });
      const spaceRentalAvailabilityMessage = intl.formatMessage({
        id: 'EditListingPricingForm.spaceRentalAvailabilityMessage',
      });
      const pricePlaceholderMessage = intl.formatMessage({
        id: 'EditListingPricingForm.priceInputPlaceholder',
      });

      const priceRequired = validators.required(
        intl.formatMessage({
          id: 'EditListingPricingForm.priceRequired',
        })
      );
      const minPrice = new Money(config.listingMinimumPriceSubUnits, config.currency);
      const minPriceRequired = validators.moneySubUnitAmountAtLeast(
        intl.formatMessage(
          {
            id: 'EditListingPricingForm.priceTooLow',
          },
          {
            minPrice: formatMoney(intl, minPrice),
          }
        ),
        config.listingMinimumPriceSubUnits
      );
      const priceValidators = config.listingMinimumPriceSubUnits
        ? validators.composeValidators(priceRequired, minPriceRequired)
        : priceRequired;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const { updateListingError, showListingsError } = fetchErrors || {};

      return (
        <Form onSubmit={handleSubmit} className={classes}>
          {updateListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.updateFailed" />
            </p>
          ) : null}
          {showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.showListingFailed" />
            </p>
          ) : null}
          <div className={css.bookingTypeWrapper}>
            <div className={css.inputHeading}>
              <label htmlFor={'bookingType'}>{bookingTypeMessage}</label>
            </div>
            <div className={css.buttonWrapper}>
              {bookingTypeOptions.map(b => {
                return (
                  <FieldRadioButton
                    id={`bookingType-${b.key}`}
                    className={css.priceOptionButton}
                    name="bookingType"
                    label={b.label}
                    value={b.key}
                  />
                );
              })}
            </div>
          </div>
          <div className={css.spaceRentalAvailabilityWrapper}>
            <div className={css.inputHeading}>
              <label htmlFor={'bookingType'}>{spaceRentalAvailabilityMessage}</label>
            </div>
            <div className={css.buttonWrapper}>
              {spaceRentalAvailabilityOptions.map(b => {
                return (
                  <FieldRadioButton
                    id={`spaceRentalAvailability-${b.key}`}
                    className={css.priceOptionButton}
                    name="spaceRentalAvailability"
                    label={b.label}
                    value={b.key}
                  />
                );
              })}
            </div>
          </div>
          {values.spaceRentalAvailability === 'both' ||
          values.spaceRentalAvailability === 'individual' ? (
            <div className={css.sliderWrapper}>
              <FieldCurrencySliderInput
                id="price"
                name="price"
                className={css.priceInput}
                autoFocus
                label={
                  values.bookingType === 'hourly' ? pricePerPersonLabelHour : pricePerPersonLabelDay
                }
                placeholder={pricePlaceholderMessage}
                currencyConfig={config.currencyConfig}
                validate={priceValidators}
                min={MIN_PRICE_PER_PERSON}
                max={MAX_PRICE_PER_PERSON}
              />
              <span className={css.sliderLabel}>
                {(values && values.price && values.price.amount / 100) ||
                  (initialValues &&
                    initialValues.price &&
                    initialValues.price.amount / 100)}
              </span>
            </div>
          ) : null}
          {values.spaceRentalAvailability === 'both' ||
          values.spaceRentalAvailability === 'entireSpace' ? (
            <div className={css.sliderWrapper}>
              <FieldCurrencySliderInput
                id="priceForEntire"
                name="priceForEntire"
                className={css.priceInput}
                autoFocus
                label={
                  values.bookingType === 'hourly' ? priceForEntireLabelHour : priceForEntireLabelDay
                }
                placeholder={pricePlaceholderMessage}
                currencyConfig={config.currencyConfig}
                validate={priceValidators}
                min={MIN_PRICE_FOR_ENTIRE}
                max={MAX_PRICE_FOR_ENTIRE}
              />
              <span className={css.sliderLabel}>
                {(values && values.priceForEntire && values.priceForEntire.amount / 100) ||
                  (initialValues &&
                    initialValues.priceForEntire &&
                    initialValues.priceForEntire.amount / 100)}
              </span>
            </div>
          ) : null}
          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingPricingFormComponent.defaultProps = { fetchErrors: null };

EditListingPricingFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingPricingFormComponent);
