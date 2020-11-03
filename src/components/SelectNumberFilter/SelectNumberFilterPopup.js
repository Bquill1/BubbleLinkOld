import React, { Component } from 'react';
import { arrayOf, func, node, number, object, shape, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { Button } from '../../components';

import { Menu, MenuContent, MenuItem, MenuLabel } from '..';
import css from './SelectNumberFilterPopup.css';

const optionLabel = (options, key) => {
  const option = options?.find(o => o.key === key);
  return option ? option.label : key;
};
const handleFocus = event => {
  event.target.select();
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
    this.setState({ count: newCount < 1 ? 1 : newCount > 100 ? 100 : newCount });
  }

  onInputChange(queryParamName, val) {
    this.setState({ count: val < 1 ? 1 : val > 100 ? 100 : val });
  }
  onToggleActive(isOpen) {
    this.setState({ isOpen: isOpen });
  }

  selectOption(queryParamName, otherQueryParamName, option) {
    const isCap = queryParamName === 'pub_capacity';
    this.setState({ isOpen: false });
    const param = !option ? option : isCap ? [option, 1000].join(',') : option;
    this.props.onSelect({ [queryParamName]: param, [otherQueryParamName]: null });
  }
  componentDidMount() {
    const { queryParamNames, initialValues, hasDates } = this.props;
    const queryParamName = hasDates ? queryParamNames[0] : queryParamNames[1];
    const isCap = queryParamName === 'pub_capacity';
    const initialValue =
      initialValues && initialValues[queryParamName]
        ? isCap
          ? initialValues[queryParamName][0]
          : initialValues[queryParamName]
        : 0;
    if (this.state.count !== initialValue) {
      this.setState({ count: initialValue });
    }
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
      hasDates,
    } = this.props;
    const queryParamName = hasDates ? queryParamNames[0] : queryParamNames[1];
    const otherQueryParamName = hasDates ? queryParamNames[1] : queryParamNames[0];
    const isCap = queryParamName === 'pub_capacity';
    const initialValue =
      initialValues && initialValues[queryParamName]
        ? isCap
          ? initialValues[queryParamName].split(',')[0]
          : initialValues[queryParamName]
        : null;
    const menuLabel = initialValue ? optionLabel(options, initialValue) : label;
    const menuLabelClass = initialValue ? css.menuLabelSelected : css.menuLabel;
    const inputClasses = classNames(css.input);
    const classes = classNames(rootClassName || css.root, className);
    return (
      <Menu
        className={classes}
        useArrow={false}
        contentPlacementOffset={contentPlacementOffset}
        onToggleActive={this.onToggleActive}
        isOpen={this.state.isOpen}
      >
        <MenuLabel className={menuLabelClass}>Guests: {menuLabel}</MenuLabel>
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
                onFocus={handleFocus}
                type="slider"
              />
              <div className={css.buttonWrapper}>
                <Button
                  className={css.numberButton}
                  onClick={e => {
                    e.preventDefault();
                    this.onButtonClick(1);
                  }}
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
                onClick={() => this.selectOption(queryParamName, otherQueryParamName, null)}
              >
                <FormattedMessage id={'SelectNumberFilter.popupClear'} />
              </button>
              <button
                className={css.submitButton}
                onClick={() =>
                  this.selectOption(queryParamName, otherQueryParamName, this.state.count)
                }
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
