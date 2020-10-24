import React, { Component } from 'react';
import { arrayOf, bool, func, node, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { Button } from '../../components';

import css from './SelectNumberFilterPlain.css';

const getQueryParamName = queryParamNames => {
  return Array.isArray(queryParamNames) ? queryParamNames[0] : queryParamNames;
};

class SelectNumberFilterPlain extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: true, count: 0 };
    this.selectOption = this.selectOption.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  onButtonClick(val) {
    const newCount = parseInt(this.state.count) + parseInt(val);
    this.setState({ count: newCount < 1 ? 1 : newCount });
  }

  onInputChange(queryParamName, val) {
    this.setState({ count: val });
  }
  selectOption(option, e) {
    const { queryParamNames, onSelect } = this.props;
    const queryParamName = getQueryParamName(queryParamNames);
    onSelect({ [queryParamName]: option });

    // blur event target if event is passed
    if (e && e.currentTarget) {
      e.currentTarget.blur();
    }
  }

  toggleIsOpen() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const {
      rootClassName,
      className,
      label,
      queryParamNames,
      initialValues,
      disabled,
    } = this.props;

    const queryParamName = getQueryParamName(queryParamNames);
    const initialValue =
      initialValues && initialValues[queryParamName] ? initialValues[queryParamName] : null;
    // clear seat search if no dates
    if (disabled && initialValue) {
      console.log(111111);
      this.props.onSelect({ [queryParamName]: null });
    }
    const labelClass = initialValue ? css.filterLabelSelected : css.filterLabel;

    const classes = classNames(rootClassName || css.root, className);

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
                this.onButtonClick(-1);
              }}
              disabled={disabled}
            >
              -
            </Button>
          </div>
          <input
            className={className}
            value={this.state.count}
            onChange={e => {
              this.onInputChange(queryParamName, e.target.value);
            }}
            type="slider"
            disabled={disabled}
          />
          <div className={css.buttonWrapper}>
            <Button
              className={css.numberButton}
              onClick={e => {
                e.preventDefault();
                this.onButtonClick(1);
              }}
              disabled={disabled}
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
