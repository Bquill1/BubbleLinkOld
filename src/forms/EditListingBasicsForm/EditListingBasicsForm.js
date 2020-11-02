import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import arrayMutators from 'final-form-arrays';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { required, requiredFieldArrayCheckbox } from '../../util/validators';
import {
  Form,
  Button,
  FieldRangeSlider,
  FieldSelect,
  FieldNumberInput,
  FieldCheckboxGroup,
  EditListingHelperCard,
} from '../../components';
import CustomCategorySelectFieldMaybe from './CustomCategorySelectFieldMaybe';
import CustomPropertyTypeSelectFieldMaybe from './CustomPropertyTypeSelectFieldMaybe';
import * as validators from '../../util/validators';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

import css from './EditListingBasicsForm.css';

const TITLE_MAX_LENGTH = 60;
const MIN_GUESTS = 1;
const MAX_GUESTS = 100;
const STEP_GUESTS = 1;
const EditListingBasicsFormComponent = props => (
  <FinalForm
    mutators={{ ...arrayMutators }}
    {...props}
    render={formRenderProps => {
      const {
        categories,
        propertyType,
        spaceTypeOptions,
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
        initialValues,
        isNewListingFlow,
        values,
      } = formRenderProps;
      console.log(formRenderProps);
      console.log(props);
      console.log(values);
      const isNew = Object.values(initialValues).every(el => el === undefined);

      const capacityLabel = intl.formatMessage({ id: 'EditListingBasicsForm.capacityLabel' });
      const spaceTypeLabel = intl.formatMessage({ id: 'EditListingBasicsForm.spaceTypeLabel' });
      const basicsHelper = intl.formatMessage({ id: 'EditListingBasicsForm.basicsMessage' });
      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingBasicsForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingBasicsForm.createListingDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingBasicsForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const numberRequired = validators.required(
        intl.formatMessage({
          id: 'EditListingBasicsForm.numberRequired',
        }),
        MIN_GUESTS,
        MAX_GUESTS
      );

      const numberValidators = numberRequired;
      if (false && !pristine && !submitDisabled && !isNewListingFlow) {
        handleSubmit();
      }
      return (
        <Form
          className={classes}
          onSubmit={handleSubmit}
          onMouseLeave={_ => {
            if (!isNewListingFlow) {
              handleSubmit();
            }
          }}
          onBlur={_ => {
            if (!isNewListingFlow) {
              handleSubmit();
            }
          }}
        >
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}
          <div className={css.formWrapper}>
            <div className={css.formLeft}>
              <FieldCheckboxGroup
                className={css.features}
                name={'category'}
                id={'category'}
                label={'What can your space be used for?'}
                validate={requiredFieldArrayCheckbox('Please select at least one option')}
                options={categories}
                twoColumns
              />

              <FieldSelect
                className={css.category}
                name={'propertyType'}
                id={'propertyType'}
                label={'What type of property is your space located in?'}
                validate={required('Please choose a property type.')}
              >
                <option disabled value="">
                  {'Select an option...'}
                </option>
                {propertyType.map(c => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </FieldSelect>
              {/* <CustomPropertyTypeSelectFieldMaybe
                id="propertyType"
                name="propertyType"
                propertyType={propertyType}
                intl={intl}
              /> */}

              {/* <CustomCategorySelectFieldMaybe
                id="category"
                name="category"
                categories={categories}
                intl={intl}
              /> */}
              <div className={css.sliderWrapper}>
                <FieldNumberInput
                  id={'capacity'}
                  name="capacity"
                  className={''}
                  type={'text'}
                  label={capacityLabel}
                  min={MIN_GUESTS}
                  max={MAX_GUESTS}
                  values={values.capacity || 1}
                  validate={numberValidators}
                />
              </div>
              <FieldSelect
                className={css.category}
                name={'spaceType'}
                id={'spaceType'}
                label={spaceTypeLabel}
                validate={required('Please select a privacy type.')}
              >
                <option disabled value="">
                  {'Select an option...'}
                </option>
                {spaceTypeOptions.map(c => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </FieldSelect>

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
            <div className={css.formRight}>
              <EditListingHelperCard
                title={
                  <FontAwesomeIcon className={css.iconClassName} size={'2x'} icon={faLightbulb} />
                }
                content={basicsHelper}
              />
            </div>
          </div>
        </Form>
      );
    }}
  />
);

EditListingBasicsFormComponent.defaultProps = { className: null, fetchErrors: null };

EditListingBasicsFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  categories: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
  propertyType: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
};

export default compose(injectIntl)(EditListingBasicsFormComponent);
