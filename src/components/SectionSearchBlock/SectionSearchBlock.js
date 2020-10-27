import React, { useState } from 'react';
import { bool, func, object, node, number, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { withRouter } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import { types as sdkTypes } from '../../util/sdkLoader';

import routeConfiguration from '../../routeConfiguration';
import { createResourceLocatorString } from '../../util/routes';
import { BookingPanelOptionButton, Form, LocationAutocompleteInput, Button } from '..';
import css from './SectionSearchBlock.css';
const identity = v => v;

const { LatLng, LatLngBounds } = sdkTypes;
const SectionSearchBlockComponent = props => {
  const { rootClassName, className, filters, history, intl } = props;
  console.log(props);

  const handleSearchSubmit = values => {
    console.log(values);

    const { search, selectedPlace } = values?.location || {};
    const { origin, bounds } = selectedPlace || {};

    const pub_category = activeCategoryFilter;
    const pub_spaceRentalAvailability = activeSpaceRentalAvailabilityFilter;
    const pub_capacity = capacityFilter && [capacityFilter, 100 ].join(',');
    const searchParams = {
      address: search || 'Europe',
      origin: origin || new LatLng(51.937444, -2.36966957036279),
      bounds:
        bounds ||
        new LatLngBounds(
          new LatLng(72.38791777, 19.51756912),
          new LatLng(26.99431866, -26.40454597)
        ),
      pub_category,
      pub_spaceRentalAvailability,
      pub_capacity,
    };
    console.log(searchParams)
    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, searchParams));
  };

  const classes = classNames(rootClassName || css.root, className);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('work');
  const [activeSpaceRentalAvailabilityFilter, setActiveSpaceRentalAvailabilityFilter] = useState(
    'entireSpace'
  );
  const [capacityFilter, setCapacityFilter] = useState(1);
  const searchBlockHeader = <FormattedMessage id="SectionSearchBlock.header" />;
  const searchBlockWhatKindOfPlace = <FormattedMessage id="SectionSearchBlock.whatKindOfPlace" />;

  const categoryOptionKey = {
    work: 'Work',
    event: 'Event',
    meeting: 'Meeting',
    study: 'Study',
    other: 'Other',
  };
  const spaceRentalAvailabilityKey = {
    entireSpace: 'I want it all to myself',
    individual: "I'm happy to share",
  };
  const categoryFilter = filters.find(f => f.id === 'category');
  console.log(categoryFilter);
  const spaceRentalAvailabilityFilter = filters.find(f => f.id === 'spaceRentalAvailability');
  return (
    <div className={classes}>
      <div className={css.searchResultSummary}>{searchBlockHeader}</div>
      <div className={css.filtersWrapper}>
        <FinalForm
          {...props}
          render={formRenderProps => {
            const { rootClassName, className, values, intl, isMobile } = formRenderProps;
            console.log(formRenderProps);
            console.log(values);
            const classes = classNames(className, css.searchLink);

            return (
              <Form className={classes} onSubmit={handleSearchSubmit}>
                <BookingPanelOptionButton
                  options={categoryFilter.config.options.map(o => {
                    console.log(o);
                    return o.key;
                  })}
                  activeOption={activeCategoryFilter}
                  setOption={setActiveCategoryFilter}
                  labelKey={categoryOptionKey}
                />
                <Field
                  name="location"
                  format={identity}
                  render={({ input, meta }) => {
                    const { onChange, ...restInput } = input;

                    // Merge the standard onChange function with custom behaviur. A better solution would
                    // be to use the FormSpy component from Final Form and pass this.onChange to the
                    // onChange prop but that breaks due to insufficient subscription handling.
                    // See: https://github.com/final-form/react-final-form/issues/159
                    const searchOnChange = value => {
                      onChange(value);
                      onChange(value);
                    };

                    let searchInput = { ...restInput, onChange: searchOnChange };
                    return (
                      <LocationAutocompleteInput
                        className={css.desktopInputRoot}
                        iconClassName={css.desktopIcon}
                        inputClassName={css.desktopInput}
                        predictionsClassName={css.desktopPredictions}
                        placeholder={intl.formatMessage({ id: 'TopbarSearchForm.placeholder' })}
                        closeOnBlur={!isMobile}
                        inputRef={node => {
                          searchInput = node;
                        }}
                        input={searchInput}
                        meta={meta}
                      />
                    );
                  }}
                />
                <div className={css.searchResultSummary}>{searchBlockWhatKindOfPlace}</div>
                <BookingPanelOptionButton
                  options={spaceRentalAvailabilityFilter.config.options.map(o => {
                    return o.key;
                  })}
                  activeOption={activeSpaceRentalAvailabilityFilter}
                  setOption={setActiveSpaceRentalAvailabilityFilter}
                  labelKey={spaceRentalAvailabilityKey}
                />
                <div className={css.capacityWrapper}>
                  <div className={css.searchResultSummary}>
                  Seats:
                  </div>
                  <div className={css.numberWrapper}>
                    <div className={css.buttonWrapper}>
                      <Button
                        className={css.numberButton}
                        onClick={e => {
                          e.preventDefault();
                          setCapacityFilter(capacityFilter - 1);
                        }}
                      >
                        -
                      </Button>
                    </div>
                    <input
                      className={css.capacityInput}
                      value={capacityFilter}
                      onChange={e => {
                        setCapacityFilter(e.target.value);
                      }}
                      type="slider"
                    />
                    <div className={css.buttonWrapper}>
                      <Button
                        className={css.numberButton}
                        onClick={e => {
                          e.preventDefault();
                          setCapacityFilter(capacityFilter + 1);
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <div className={css.submitButtonWrapper}>
                  <Button
                    className={css.submitButton}
                    type="submit"
                    onClick={e => {
                      e.preventDefault();
                      handleSearchSubmit(values);
                    }}
                    inProgress={false}
                    disabled={false}
                    ready={false}
                  >
                    <FormattedMessage id="SectionSearchBlock.submitButton" />
                  </Button>
                </div>
              </Form>
            );
          }}
        />
      </div>
    </div>
  );
};

SectionSearchBlockComponent.defaultProps = {
  rootClassName: null,
  className: null,
  sortByComponent: null,
  resultsCount: null,
  searchInProgress: false,
  selectedFiltersCount: 0,
};

SectionSearchBlockComponent.propTypes = {
  rootClassName: string,
  className: string,
  urlQueryParams: object.isRequired,
  sortByComponent: node,
  resultsCount: number,
  searchInProgress: bool,
  showAsModalMaxWidth: number.isRequired,
  onMapIconClick: func.isRequired,
  onOpenModal: func.isRequired,
  onCloseModal: func.isRequired,
  resetAll: func.isRequired,
  selectedFiltersCount: number,

  // from injectIntl
  intl: intlShape.isRequired,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
};

const SectionSearchBlock = injectIntl(withRouter(SectionSearchBlockComponent));

export default SectionSearchBlock;
