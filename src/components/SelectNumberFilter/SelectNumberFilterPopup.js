import React, { Component } from 'react';
import { arrayOf, func, node, number, object, shape, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { Button } from '../../components';
import ReactTooltip from 'react-tooltip';

import { Menu, MenuContent, MenuItem, MenuLabel } from '..';
import css from './SelectNumberFilterPopup.css';

const optionLabel = (options, key) => {
  const option = options?.find(o => o.key === key);
  return (
    <div data-tip={'Please select a date first'}>
      {option ? option.label : key}
      <ReactTooltip />
    </div>
  );
};

const getQueryParamName = queryParamNames => {
  return Array.isArray(queryParamNames) ? queryParamNames[0] : queryParamNames;
};

class SelectNumberFilterPopup extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false, count: 1 };
    this.onToggleActive = this.onToggleActive.bind(this);
    this.selectOption = this.selectOption.bind(this);
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
  onToggleActive(isOpen) {
    this.setState({ isOpen: isOpen });
  }

  selectOption(queryParamName, option) {
    this.setState({ isOpen: false });
    this.props.onSelect({ [queryParamName]: option });
  }

  render() {
    const {
      rootClassName,
      className,
      label,
      options,
      queryParamNames,
      initialValues,
      contentPlacementOffset,
      disabled,
    } = this.props;
    const queryParamName = getQueryParamName(queryParamNames);
    const initialValue =
      initialValues && initialValues[queryParamNames] ? initialValues[queryParamNames] : null;
    // clear seat search if no dates
    if (disabled && initialValue) {
      console.log(111111);
      this.props.onSelect({ [queryParamName]: null });
    }
    // resolve menu label text and class
    const menuLabel = initialValue ? (
      optionLabel(options, initialValue)
    ) : (
      <div data-tip={'Please select a date first'}>
        {label}
        {disabled && <ReactTooltip />}
      </div>
    );
    const menuLabelClass = initialValue ? css.menuLabelSelected : css.menuLabel;
    const inputClasses = classNames(css.input);
    const classes = classNames(rootClassName || css.root, className);
    console.log(this.state);
    return (
      <Menu
        className={classes}
        useArrow={false}
        contentPlacementOffset={contentPlacementOffset}
        onToggleActive={this.onToggleActive}
        isOpen={this.state.isOpen}
      >
        <MenuLabel className={menuLabelClass} disabled={disabled}>{menuLabel}</MenuLabel>
        <MenuContent className={css.menuContent}>
          <MenuItem className={css.inputItem} key={'key'}>
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
                className={inputClasses}
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
          </MenuItem>
          <MenuItem key={'clearLink'}>
            <div className={css.buttonsWrapper}>
              <button
                className={css.clearButton}
                onClick={() => this.selectOption(queryParamName, null)}
                disabled={disabled}
              >
                <FormattedMessage id={'SelectNumberFilter.popupClear'} />
              </button>
              <button
                className={css.submitButton}
                onClick={() => this.selectOption(queryParamName, this.state.count)}
                disabled={disabled}
              >
                <FormattedMessage id={'SelectNumberFilter.popupSubmit'} />
              </button>
            </div>
          </MenuItem>
        </MenuContent>
      </Menu>
    );
  }
}

SelectNumberFilterPopup.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  contentPlacementOffset: 0,
};

SelectNumberFilterPopup.propTypes = {
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
  contentPlacementOffset: number,
};

export default SelectNumberFilterPopup;
