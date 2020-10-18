import React from 'react';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import {  } from '..';
import css from './PriceDisplayGrid.css'
const PriceDisplayGrid = props => {
  const { className, prices } = props;
  const classes = classNames(css.root, className);
console.log(prices)
  return (
    <div className={classes}>
      <div className={css.gridRow}>
        <div className={css.gridBlock}>Hourly</div>
        <div className={css.gridBlock}>Daily</div>
      </div>
      <div className={css.gridRow}>
        <div className={css.gridBlock}>$$$$</div>
        <div className={css.gridBlock}>$$$$</div>
      </div>
      <div className={css.gridRow}>
        <div className={css.gridBlock}>$$$$</div>
        <div className={css.gridBlock}>$$$$</div>
      </div>
    </div>
  );
};

export default PriceDisplayGrid;
