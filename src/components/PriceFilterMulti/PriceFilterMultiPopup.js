import classNames from 'classnames';
import { arrayOf, func, node, number, shape, string } from 'prop-types';
import React, { Component } from 'react';
import config from '../../config';
import { PriceFilterFormMulti } from '../../forms';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import css from './PriceFilterMultiPopup.css';


const KEY_CODE_ESCAPE = 27;
const RADIX = 10;

const getPriceQueryParamName = queryParamNames => {
  return Array.isArray(queryParamNames)
    ? queryParamNames[0]
    : typeof queryParamNames === 'string'
    ? queryParamNames
    : 'price';
};

// Parse value, which should look like "0,1000"
const parseHour = priceRange => {
  const [minPricePerHour, maxPricePerHour] = !!priceRange
    ? priceRange.split(',').map(v => Number.parseInt(v, RADIX))
    : [];
  // Note: we compare to null, because 0 as minPrice is falsy in comparisons.
  return !!priceRange && minPricePerHour != null && maxPricePerHour != null
    ? { minPricePerHour, maxPricePerHour }
    : null;
};
// Parse value, which should look like "0,1000"
const parseDay = priceRange => {
  const [minPricePerDay, maxPricePerDay] = !!priceRange
    ? priceRange.split(',').map(v => Number.parseInt(v, RADIX))
    : [];
  // Note: we compare to null, because 0 as minPrice is falsy in comparisons.
  return !!priceRange && minPricePerDay != null && maxPricePerDay != null
    ? { minPricePerDay, maxPricePerDay }
    : null;
};

// Format value, which should look like { minPrice, maxPrice }
const format = (range, queryParamName) => {
  const { minPricePerHour, maxPricePerHour, minPricePerDay, maxPricePerDay } = range || {};
  // Note: we compare to null, because 0 as minPrice is falsy in comparisons.
  const valueHour =
    minPricePerHour != null && maxPricePerHour != null
      ? `${minPricePerHour * 100},${maxPricePerHour * 100}`
      : null;
  const valueDay =
    minPricePerDay != null && maxPricePerDay != null
      ? `${minPricePerDay * 100},${maxPricePerDay * 100}`
      : null;
  return {
    pub_price_entireSpace_daily: valueDay,
    pub_price_entireSpace_hourly: valueHour,
    pub_price_individual_daily: valueDay,
    pub_price_individual_hourly: valueHour,
  };
};

class PriceFilterMultiPopup extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.filter = null;
    this.filterContent = null;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.positionStyleForContent = this.positionStyleForContent.bind(this);
  }

  handleSubmit(values) {
    const { onSubmit, queryParamNames } = this.props;
    this.setState({ isOpen: false });
    const priceQueryParamName = getPriceQueryParamName(queryParamNames);
    onSubmit(format(values, priceQueryParamName));
  }

  handleClear() {
    const { onSubmit, queryParamNames } = this.props;
    this.setState({ isOpen: false });
    const priceQueryParamName = getPriceQueryParamName(queryParamNames);
    onSubmit(format(null, priceQueryParamName));
  }

  handleCancel() {
    const { onSubmit, initialValues } = this.props;
    this.setState({ isOpen: false });
    onSubmit(initialValues);
  }

  handleBlur(event) {
    // FocusEvent is fired faster than the link elements native click handler
    // gets its own event. Therefore, we need to check the origin of this FocusEvent.
    if (!this.filter.contains(event.relatedTarget)) {
      this.setState({ isOpen: false });
    }
  }

  handleKeyDown(e) {
    // Gather all escape presses to close menu
    if (e.keyCode === KEY_CODE_ESCAPE) {
      this.toggleOpen(false);
    }
  }

  toggleOpen(enforcedState) {
    if (enforcedState) {
      this.setState({ isOpen: enforcedState });
    } else {
      this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    }
  }

  positionStyleForContent() {
    if (this.filter && this.filterContent) {
      // Render the filter content to the right from the menu
      // unless there's no space in which case it is rendered
      // to the left
      const distanceToRight = window.innerWidth - this.filter.getBoundingClientRect().right;
      const labelWidth = this.filter.offsetWidth;
      const contentWidth = this.filterContent.offsetWidth;
      const contentWidthBiggerThanLabel = contentWidth - labelWidth;
      const renderToRight = distanceToRight > contentWidthBiggerThanLabel;
      const contentPlacementOffset = this.props.contentPlacementOffset;

      const offset = renderToRight
        ? { left: contentPlacementOffset }
        : { right: contentPlacementOffset };
      // set a min-width if the content is narrower than the label
      const minWidth = contentWidth < labelWidth ? { minWidth: labelWidth } : null;

      return { ...offset, ...minWidth };
    }
    return {};
  }

  render() {
    const {
      rootClassName,
      className,
      id,
      label,
      queryParamNames,
      urlQueryParams,
      initialValues,
      min,
      max,
      step,
      intl,
      currencyConfig,
    } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    const initialPricePerHour =
      initialValues &&
      (initialValues['pub_price_entireSpace_hourly'] ||
        initialValues['pub_price_individual_hourly'])
        ? parseHour(
            initialValues['pub_price_entireSpace_hourly'] ||
              initialValues['pub_price_individual_hourly']
          )
        : {};
    const initialPricePerDay =
      initialValues &&
      (initialValues['pub_price_entireSpace_daily'] || initialValues['pub_price_individual_daily'])
        ? parseDay(
            initialValues['pub_price_entireSpace_daily'] ||
              initialValues['pub_price_individual_daily']
          )
        : {};

    const { minPricePerHour, maxPricePerHour } = initialPricePerHour || {};
    const { minPricePerDay, maxPricePerDay } = initialPricePerDay || {};
    const hasValue = value => value != null;
    const hasInitialValues =
      initialValues &&
      hasValue(minPricePerHour || minPricePerDay) &&
      hasValue(maxPricePerHour || maxPricePerDay);
    const currentLabel = hasInitialValues
      ? intl.formatMessage(
          { id: 'PriceFilterMulti.labelSelectedButton' }
          // {
          //   minPrice: formatCurrencyMajorUnit(intl, currencyConfig.currency, minPrice),
          //   maxPrice: formatCurrencyMajorUnit(intl, currencyConfig.currency, maxPrice),
          // }
        )
      : label
      ? label
      : intl.formatMessage({ id: 'PriceFilter.label' });

    const labelStyles = hasInitialValues ? css.labelSelected : css.label;
    const contentStyle = this.positionStyleForContent();

    return (
      <div
        className={classes}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
        ref={node => {
          this.filter = node;
        }}
      >
        <button className={labelStyles} onClick={() => this.toggleOpen()}>
          {currentLabel}
        </button>
        <PriceFilterFormMulti
          id={id}
          initialValues={{
            minPricePerDay: minPricePerDay && minPricePerDay / 100,
            maxPricePerDay: maxPricePerDay && maxPricePerDay / 100,
            minPricePerHour: minPricePerHour && minPricePerHour / 100,
            maxPricePerHour: maxPricePerHour && maxPricePerHour / 100,
          }}
          onClear={this.handleClear}
          onCancel={this.handleCancel}
          onSubmit={this.handleSubmit}
          intl={intl}
          contentRef={node => {
            this.filterContent = node;
          }}
          style={contentStyle}
          min={min}
          max={max}
          step={step}
          showAsPopup
          isOpen={this.state.isOpen}
          priceFilterParams={urlQueryParams.pub_bookingTypes}
        />
      </div>
    );
  }
}

PriceFilterMultiPopup.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  contentPlacementOffset: 0,
  liveEdit: false,
  step: number,
  currencyConfig: config.currencyConfig,
};

PriceFilterMultiPopup.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  label: node,
  queryParamNames: arrayOf(string).isRequired,
  onSubmit: func.isRequired,
  initialValues: shape({
    price: string,
  }),
  contentPlacementOffset: number,
  min: number.isRequired,
  max: number.isRequired,
  step: number,
  currencyConfig: propTypes.currencyConfig,

  // form injectIntl
  intl: intlShape.isRequired,
};

export default injectIntl(PriceFilterMultiPopup);
