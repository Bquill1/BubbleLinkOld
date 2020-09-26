import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import {  required } from '../../util/validators';
import { Form, Button,  FieldRangeSlider, FieldSelect } from '../../components';
import CustomCategorySelectFieldMaybe from './CustomCategorySelectFieldMaybe';
import CustomPropertyTypeSelectFieldMaybe from './CustomPropertyTypeSelectFieldMaybe';

import css from './EditListingBasicsForm.css';

const TITLE_MAX_LENGTH = 60;
const MIN_GUESTS = 1;
const MAX_GUESTS = 100;
const STEP_GUESTS = 1;
const EditListingBasicsFormComponent = props => (
  <FinalForm
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
        values,
      } = formRenderProps;
      console.log(initialValues);
      console.log(values);
      const capacityLabel = intl.formatMessage({ id: 'EditListingBasicsForm.capacityLabel' });
      const spaceTypeLabel = intl.formatMessage({ id: 'EditListingBasicsForm.spaceTypeLabel' });


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

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}

          <CustomPropertyTypeSelectFieldMaybe
            id="propertyType"
            name="propertyType"
            propertyType={propertyType}
            intl={intl}
          />

          <CustomCategorySelectFieldMaybe
            id="category"
            name="category"
            categories={categories}
            intl={intl}
          />
          <div className={css.sliderWrapper}>
            <FieldRangeSlider
              id={'capacity'}
              name="capacity"
              className={''}
              label={capacityLabel}
              min={MIN_GUESTS}
              max={MAX_GUESTS}
              step={STEP_GUESTS}
              handles={[initialValues.capacity]}
            />
            <span className={css.sliderLabel}> {values.capacity || initialValues.capacity || 0} </span>
          </div>
          <FieldSelect
            className={css.category}
            name={'spaceType'}
            id={'spaceType'}
            label={spaceTypeLabel}
            validate={required('Please select a space type.')}
          >
            <option disabled value="">
              {'blank'}
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
