import React, { useState, useRef, useEffect } from 'react';
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
  FieldCheckbox,
  EditListingHelperCard,
} from '../../components';
import css from './EditListingPricingForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

const { Money } = sdkTypes;
const MIN_PRICE_PER_PERSON = 5;
const MAX_PRICE_PER_PERSON = 1000;
const MIN_PRICE_FOR_ENTIRE = 5;
const MAX_PRICE_FOR_ENTIRE = 1000;
const STEP_PRICE = 1;

export const EditListingPricingFormComponent = props => {
  function useTraceUpdate(props) {
    const prev = useRef(props);
    useEffect(() => {
      const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
        if (prev.current[k] !== v) {
          ps[k] = [prev.current[k], v];
        }
        return ps;
      }, {});
      if (Object.keys(changedProps).length > 0) {
        console.log('Changed props:', changedProps);
      }
      prev.current = props;
    });
  }
  useTraceUpdate(props);
  console.log(props);

  return (
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
          isNewListingFlow,
          bookingType_entireSpace,
          setBookingType_entireSpace,
          bookingType_individual,
          setBookingType_individual,
          spaceRentalAvailability,
          setSpaceRentalAvailability,
        } = formRenderProps;
        console.log(spaceRentalAvailability)
        console.log(values);
        console.log(initialValues);
        console.log(
          JSON.stringify(values?.bookingType_entireSpace) !==
            JSON.stringify(bookingType_entireSpace)
        );
        console.log(
          JSON.stringify(values?.bookingType_individual) !== JSON.stringify(bookingType_individual)
        );
        console.log(JSON.stringify(values) !== JSON.stringify(initialValues) && values !== {});
        if (
          JSON.stringify(values) === JSON.stringify(initialValues) &&
          values !== {} &&
          (JSON.stringify(values?.bookingType_entireSpace) !==
            JSON.stringify(bookingType_entireSpace) ||
            JSON.stringify(values?.bookingType_individual) !==
              JSON.stringify(bookingType_individual) ||
            JSON.stringify(values?.spaceRentalAvailability) !==
              JSON.stringify(bookingType_individual))
        ) {
          console.log(values);
          console.log(111);
          values.bookingType_entireSpace = bookingType_entireSpace;
          values.bookingType_individual = bookingType_individual;
          values.spaceRentalAvailability = spaceRentalAvailability;
        } else {
          setBookingType_entireSpace(values.bookingType_entireSpace);
          setBookingType_individual(values.bookingType_individual);
          setSpaceRentalAvailability(values.spaceRentalAvailability)
        }
        console.log(values);
        const newValues = {
          ...values,
          bookingType_entireSpace: bookingType_entireSpace || [],
          bookingType_individual: bookingType_individual || [],
          spaceRentalAvailability: spaceRentalAvailability || [],
        };
        console.log(newValues);
        const bookingTypeMessage = intl.formatMessage({
          id: 'EditListingPricingForm.bookingTypeMessage',
        });
        const spaceHelper = intl.formatMessage({
          id: 'EditListingPricingForm.spaceHelper',
        });
        const timeHelper = intl.formatMessage({
          id: 'EditListingPricingForm.timeHelper',
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
        const messageKey = {
          entireSpace: {
            hourly: priceForEntireLabelHour,
            daily: priceForEntireLabelDay,
          },
          individual: {
            hourly: pricePerPersonLabelHour,
            daily: pricePerPersonLabelDay,
          },
        };

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

        const missingEntireSpacePrices = !!(
          newValues.spaceRentalAvailability?.includes('entireSpace') &&
          !newValues.bookingType_entireSpace?.length
        );
        const missingIndividualPrices = !!(
          newValues.spaceRentalAvailability?.includes('individual') &&
          !newValues.bookingType_individual?.length
        );
        const missingPrices = missingEntireSpacePrices || missingIndividualPrices;
        const submitReady = (updated && pristine) || ready;
        const submitInProgress = updateInProgress;
        const submitDisabled = invalid || disabled || submitInProgress || missingPrices;
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
            <div className={''}>
              <div className={css.inputHeading}>
                <label htmlFor={'bookingType'}>{bookingTypeMessage}</label>
              </div>
              <div className={css.priceFormWrapper}>
                <div className={css.priceFormLeft}>
                  {spaceRentalAvailabilityOptions.map(c => {
                    return (
                      <>
                        <div className={css.fieldWrapper}>
                          <div className={css.fieldWrapperLeft}>
                            <div className={css.spaceRentalAvailabilityWrapper}>
                              <FieldCheckbox
                                id={`spaceRentalAvailability_${c.key}`}
                                className={css.priceOptionButton}
                                name="spaceRentalAvailability"
                                label={c.label}
                                value={c.key}
                                validationError={
                                  c.key === 'individual'
                                    ? missingIndividualPrices
                                    : missingEntireSpacePrices
                                }
                                hideCheckbox
                                selected={values?.[`spaceRentalAvailability`]?.includes(c.key)}
                                labelClassName={css.labelClassName}
                                selectedClassName={css.selectedClassName}
                                textClassName={
                                  values?.[`spaceRentalAvailability`]?.includes(c.key)
                                    ? css.selectedText
                                    : null
                                }
                              />
                            </div>
                            <div className={css.bookingTypeWrapper}>
                              {bookingTypeOptions.map(b => {
                                return (
                                  <>
                                    {newValues.spaceRentalAvailability?.includes(c.key) ? (
                                      <>
                                        <FieldCheckbox
                                          id={`${c.key}_bookingType_${b.key}`}
                                          className={css.priceOptionButton}
                                          name={`bookingType_${c.key}`}
                                          label={b.label}
                                          value={b.key}
                                          hideCheckbox
                                          selected={values?.[`bookingType_${c.key}`]?.includes(
                                            b.key
                                          )}
                                          labelClassName={css.labelClassName}
                                          selectedClassName={css.selectedClassName}
                                          textClassName={
                                            values?.[`bookingType_${c.key}`]?.includes(b.key)
                                              ? css.selectedText
                                              : null
                                          }
                                        />
                                        {values?.[`bookingType_${c.key}`]?.includes(b.key) ? (
                                          <div className={css.sliderWrapper}>
                                            <FieldCurrencyInput
                                              id={`price_${c.key}_${b.key}`}
                                              name={`price_${c.key}_${b.key}`}
                                              disabled={
                                                !values?.[`bookingType_${c.key}`]?.includes(b.key)
                                              }
                                              className={css.priceInput}
                                              label={messageKey[c.key][b.key]}
                                              placeholder={pricePlaceholderMessage}
                                              currencyConfig={config.currencyConfig}
                                              validate={priceValidators}
                                              min={MIN_PRICE_PER_PERSON}
                                              max={MAX_PRICE_PER_PERSON}
                                            />
                                          </div>
                                        ) : null}
                                      </>
                                    ) : null}
                                  </>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                  <Button
                    className={css.submitButton}
                    type="submit"
                    inProgress={submitInProgress}
                    disabled={submitDisabled}
                    ready={submitReady}
                  >
                    {saveActionMsg}
                  </Button>
                </div>
                <div className={css.priceFormRight}>
                  <div className={css.fieldWrapperRight}>
                    <EditListingHelperCard
                      title={
                        <FontAwesomeIcon
                          className={css.iconClassName}
                          size={'2x'}
                          icon={faLightbulb}
                        />
                      }
                      content={spaceHelper}
                    />
                    <EditListingHelperCard
                      title={
                        <FontAwesomeIcon
                          className={css.iconClassName}
                          size={'2x'}
                          icon={faLightbulb}
                        />
                      }
                      content={timeHelper}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    />
  );
};
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
