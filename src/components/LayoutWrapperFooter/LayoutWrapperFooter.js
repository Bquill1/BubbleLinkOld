/**
 * This is a wrapper component for different Layouts. Footer content should be added to this wrapper.
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import css from './LayoutWrapperFooter.css';


const LayoutWrapperFooter = props => {
  const { className, rootClassName, children } = props;
  const classes = classNames(rootClassName || css.root, className);

  return <div className={classes}>{children}</div>;
};

LayoutWrapperFooter.defaultProps = {
  className: null,
  rootClassName: null,
};

const { node, string } = PropTypes;

LayoutWrapperFooter.propTypes = {
  children: node.isRequired,
  className: string,
  rootClassName: string,
};

export default LayoutWrapperFooter;
