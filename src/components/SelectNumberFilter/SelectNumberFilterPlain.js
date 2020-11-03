import React, { Component } from 'react';
import { arrayOf, bool, func, node, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { Button } from '../../components';

import css from './SelectNumberFilterPlain.css';

const getQueryParamName = queryParamNames => {
  return Array.isArray(queryParamNames) ? queryParamNames[0] : queryParamNames;
};
const handleFocus = event => {
  console.log(1111);
  event.target.select();
};

class SelectNumberFilterPlain extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: true, count: 1 };
    this.selectOption = this.selectOption.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  onButtonClick(queryParamName, otherQueryParamName, val) {
    const newCount = parseInt(this.state.count) + parseInt(val);
    this.setState({ count: newCount < 1 ? 1 : newCount > 100 ? 100 : newCount });
    this.selectOption(queryParamName, otherQueryParamName, newCount);
  }

  onInputChange(queryParamName, otherQueryParamName, val) {
    const newCount = val < 1 ? 1 : val > 100 ? 100 : val;
    this.setState({ count: newCount });
    this.selectOption(queryParamName, otherQueryParamName, newCount);
  }
  selectOption(queryParamName, otherQueryParamName, option) {
    console.log(queryParamName);
    console.log(otherQueryParamName);
    console.log(option);
    const isCap = queryParamName === 'pub_capacity';
    this.setState({ isOpen: false });
    const param = !option ? option : isCap ? [option, 1000].join(',') : option;
    this.props.onSelect({ [queryParamName]: param, [otherQueryParamName]: null });
  }

  toggleIsOpen() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const {
      rootClassName,
      className,
      label,
      options,
      queryParamNames,
      initialValues,
      hasDates,
    } = this.props;
    console.log(this.props);
    const queryParamName = hasDates ? queryParamNames[0] : queryParamNames[1];
    const otherQueryParamName = hasDates ? queryParamNames[1] : queryParamNames[0];
    const isCap = queryParamName === 'pub_capacity';
    const initialValue =
      initialValues && initialValues[queryParamName]
        ? isCap
          ? initialValues[queryParamName].split(',')[0]
          : initialValues[queryParamName]
        : null;
    const labelClass = initialValue ? css.filterLabelSelected : css.filterLabel;

    const classes = classNames(rootClassName || css.root, className);
    console.log(this.state.count);
    return (
      <div className={classes}>
        <div className={labelClass}>
          <button className={css.labelButton} onClick={this.toggleIsOpen}>
            <span className={labelClass}>{label}</span>
          </button>
          <button className={css.clearButton} onClick={e => this.selectOption(null, e)}>
            <FormattedMessage id={'SelectNumberFilter.plainClear'} />
          </button>
        </div>
        <div className={css.numberWrapper}>
          <div className={css.buttonWrapper}>
            <Button
              className={css.numberButton}
              onClick={e => {
                e.preventDefault();
                this.onButtonClick(queryParamName, otherQueryParamName, -1);
              }}
            >
              -
            </Button>
          </div>
          <input
            className={className}
            value={this.state.count}
            onChange={e => {
              this.onInputChange(queryParamName, otherQueryParamName, e.target.value);
            }}
            onFocus={handleFocus}
            type="slider"
          />
          <div className={css.buttonWrapper}>
            <Button
              className={css.numberButton}
              onClick={e => {
                e.preventDefault();
                this.onButtonClick(queryParamName, otherQueryParamName, 1);
              }}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

SelectNumberFilterPlain.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  twoColumns: false,
  useBullets: false,
};

SelectNumberFilterPlain.propTypes = {
  rootClassName: string,
  className: string,
  queryParamNames: arrayOf(string).isRequired,
  label: node.isRequired,
  onSelect: func.isRequired,

  options: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ).isRequired,
  initialValues: object,
  twoColumns: bool,
  useBullets: bool,
};

export default SelectNumberFilterPlain;
