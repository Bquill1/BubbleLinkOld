import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import {
  autocompleteSearchRequired,
  autocompletePlaceSelected,
  composeValidators,
} from '../../util/validators';
import {
  Form,
  LocationAutocompleteInputField,
  Button,
  FieldTextInput,
  MapHelper,
  EditListingHelperCard,
} from '../../components';

import css from './EditListingLocationForm.css';

const identity = v => v;

export const EditListingLocationFormComponent = props => (
  <FinalForm
    {...props}
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
        values,
      } = formRenderProps;
      console.log(values);
      const titleRequiredMessage = intl.formatMessage({ id: 'EditListingLocationForm.address' });
      const addressPlaceholderMessage = intl.formatMessage({
        id: 'EditListingLocationForm.addressPlaceholder',
      });
      const addressRequiredMessage = intl.formatMessage({
        id: 'EditListingLocationForm.addressRequired',
      });
      const addressNotRecognizedMessage = intl.formatMessage({
        id: 'EditListingLocationForm.addressNotRecognized',
      });

      const optionalText = intl.formatMessage({
        id: 'EditListingLocationForm.optionalText',
      });

      const buildingMessage = intl.formatMessage(
        { id: 'EditListingLocationForm.building' },
        { optionalText: optionalText }
      );
      const buildingPlaceholderMessage = intl.formatMessage({
        id: 'EditListingLocationForm.buildingPlaceholder',
      });

      const { updateListingError, showListingsError } = fetchErrors || {};
      const errorMessage = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingLocationForm.updateFailed" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingLocationForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const locationHelper = intl.formatMessage({ id: 'EditListingBasicsForm.locationHelper' });

      return (
        <Form
        className={classes} onSubmit={handleSubmit}>
          {errorMessage}
          {errorMessageShowListing}
          <div className={css.formWrapper}>
            <div className={css.formLeft}>

          <LocationAutocompleteInputField
            className={css.locationAddress}
            inputClassName={css.locationAutocompleteInput}
            iconClassName={css.locationAutocompleteInputIcon}
            predictionsClassName={css.predictionsRoot}
            validClassName={css.validLocation}
            autoFocus
            name="location"
            label={titleRequiredMessage}
            placeholder={addressPlaceholderMessage}
            useDefaultPredictions={false}
            format={identity}
            valueFromForm={values.location}
            validate={composeValidators(
              autocompleteSearchRequired(addressRequiredMessage),
              autocompletePlaceSelected(addressNotRecognizedMessage)
            )}
          />

          <FieldTextInput
            className={css.building}
            type="text"
            name="building"
            id="building"
            label={buildingMessage}
            placeholder={buildingPlaceholderMessage}
          />

          <MapHelper
            mapClassName={css.editListingLocationMap}
            geolocation={values?.location?.selectedPlace?.origin}
            address={values?.location?.selectedPlace?.address}
          />
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
             content={locationHelper}
             />
          </div>
          </div>
        </Form>
      );
    }}
  />
);

EditListingLocationFormComponent.defaultProps = {
  selectedPlace: null,
  fetchErrors: null,
};

EditListingLocationFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  selectedPlace: propTypes.place,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingLocationFormComponent);
