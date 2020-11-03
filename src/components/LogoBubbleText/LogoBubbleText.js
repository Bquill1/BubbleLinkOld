import React from 'react';
import { oneOf, string } from 'prop-types';
import classNames from 'classnames';
import { IconBubbleMarker } from '..';
import css from './LogoBubbleText.css';

const LogoBubbleText = props => {
  const { className, rootClassName } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <>
      <div className={css.logoTextWrapper}>
        <IconBubbleMarker />
        <h2 className={css.logoText}>BubbleLink</h2>
      </div>
    </>
  );
};

LogoBubbleText.defaultProps = {
  className: null,
  rootClassName: null,
};

LogoBubbleText.propTypes = {
  className: string,
  rootClassName: string,
};

export default LogoBubbleText;
