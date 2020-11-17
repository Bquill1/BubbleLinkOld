import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { bool, func, node, number, object, shape, string } from 'prop-types';
import React, { useState } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import { withRouter } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { BookingPanelOptionButton, Button, Form, LocationAutocompleteInput } from '..';
import routeConfiguration from '../../routeConfiguration';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { createResourceLocatorString } from '../../util/routes';
import { types as sdkTypes } from '../../util/sdkLoader';
import css from './SectionSearchBlock.css';

const identity = v => v;

const { LatLng, LatLngBounds } = sdkTypes;
const SectionSearchBlockComponent = props => {
  const { rootClassName, className, filters, history, isMobile, intl } = props;
  console.log(props);

  const handleSearchSubmit = values => {
    console.log(values);

    const { search, selectedPlace } = values?.location || {};
    const { origin, bounds } = selectedPlace || {};

    const pub_category = activeCategoryFilter;
    const pub_spaceRentalAvailability = activeSpaceRentalAvailabilityFilter;
    const pub_capacity = capacityFilter && [capacityFilter, 1000].join(',');
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
    console.log(searchParams);
    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, searchParams));
  };

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('work');
  const [activeSpaceRentalAvailabilityFilter, setActiveSpaceRentalAvailabilityFilter] = useState(
    'entireSpace'
  );
  const [capacityFilter, setCapacityFilter] = useState(1);
  const [isFocused, setIsFocused] = useState(false);

  const handleButtonCapacityFilter = val => {
    const newCount = parseInt(capacityFilter) + parseInt(val);
    setCapacityFilter(newCount < 1 ? 1 : newCount > 100 ? 100 : newCount);
  };

  const handleSetCapacityFilter = val => {
    setCapacityFilter(val < 1 ? 1 : val > 100 ? 100 : val);
  };

  const classes = classNames(rootClassName || css.root, className, {
    [css.focusedBlock]: isFocused,
  });

  const searchBlockHeader = <FormattedMessage id="SectionSearchBlock.header" />;
  const searchBlockWhatKindOfPlace = <FormattedMessage id="SectionSearchBlock.whatKindOfPlace" />;
  const searchBlockCapacity = <FormattedMessage id="SectionSearchBlock.capacity" />;

  const categoryOptionKey = {
    work: 'WORK',
    event: 'EVENT',
    meeting: 'MEETING',
    study: 'STUDY',
    other: 'OTHER',
  };
  const spaceRentalAvailabilityKey = {
    entireSpace: 'I want it all',
    individual: "I'm happy to share",
  };
  const categoryFilter = filters.find(f => f.id === 'category');
  const spaceRentalAvailabilityFilter = filters.find(f => f.id === 'spaceRentalAvailability');
  const handleFocus = event => {
    event.target.select();
  };
  const windowLoaded = typeof window !== 'undefined';
  const collapsibleCss = classNames({ [css.hidden]: !isFocused }, { [css.show]: isFocused });

  return (
    <div
      className={classes}
      // onFocus={e => setIsFocused(true)}
      onMouseLeave={e => setIsFocused(false)}
    >
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
                <div className={collapsibleCss}>
                  {((isMobile && isFocused) || !isMobile) && (
                    <div className={css.searchResultSummary}>
                      {searchBlockHeader}
                      <FontAwesomeIcon
                        className={css.iconClassName}
                        size={'1x'}
                        icon={faQuestionCircle}
                        data-tip={
                          '"Other" contains all spaces not in the core categories, try it and see what you can find!'
                        }
                        data-for="type-of-space"
                      />
                      {windowLoaded && (
                        <ReactTooltip id="type-of-space" className={css.tooltip} place={'top'} />
                      )}
                    </div>
                  )}
                  <BookingPanelOptionButton
                    options={categoryFilter.config.options.map(o => {
                      console.log(o);
                      return o.key;
                    })}
                    activeOption={activeCategoryFilter}
                    setOption={setActiveCategoryFilter}
                    labelKey={categoryOptionKey}
                  />

                  <div className={css.searchResultSummary}>{searchBlockCapacity}</div>
                  <div className={css.capacityWrapper}>
                    <div className={css.searchResultSummary}></div>
                    <div className={css.numberWrapper}>
                      <div className={css.buttonWrapper}>
                        <Button
                          className={css.numberButton}
                          onClick={e => {
                            e.preventDefault();
                            handleButtonCapacityFilter(-1);
                          }}
                        >
                          -
                        </Button>
                      </div>
                      <input
                        className={css.capacityInput}
                        value={capacityFilter}
                        onChange={e => {
                          e.preventDefault();
                          handleSetCapacityFilter(e.target.value);
                        }}
                        onFocus={handleFocus}
                        type="slider"
                      />
                      <div className={css.buttonWrapper}>
                        <Button
                          className={css.numberButton}
                          onClick={e => {
                            e.preventDefault();
                            handleButtonCapacityFilter(1);
                          }}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className={css.searchResultSummary}>
                    {searchBlockWhatKindOfPlace}
                    <FontAwesomeIcon
                      className={css.iconClassName}
                      size={'1x'}
                      icon={faQuestionCircle}
                      data-tip={
                        'Hosts with space for more than one guest can rent it in its entirety and/or as individual spaces. If you want the entire space to yourself you can choose this option and pay the full price or else choose to share.'
                      }
                      data-for="space-availability"
                    />
                    {windowLoaded && (
                      <ReactTooltip id="space-availability" className={css.tooltip} />
                    )}
                    {/* <ReactTooltip id = 'test' /> */}
                  </div>

                  <BookingPanelOptionButton
                    options={spaceRentalAvailabilityFilter.config.options.map(o => {
                      return o.key;
                    })}
                    activeOption={activeSpaceRentalAvailabilityFilter}
                    setOption={setActiveSpaceRentalAvailabilityFilter}
                    labelKey={spaceRentalAvailabilityKey}
                  />
                </div>
                {((isMobile && isFocused) || !isMobile) && (
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
                )}
                <div className={css.submitButtonWrapper}>
                  <Button
                    className={css.submitButton}
                    type={isFocused ? 'submit' : null}
                    onClick={e => {
                      e.preventDefault();
                      console.log(!isFocused);
                      if (isMobile && !isFocused) {
                        setIsFocused(true);
                      } else {
                        handleSearchSubmit(values);
                      }
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
