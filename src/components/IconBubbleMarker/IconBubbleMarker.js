import classNames from 'classnames';
import { string } from 'prop-types';
import React from 'react';
import css from './IconBubbleMarker.css';



const IconBubbleMarker = props => {
  const { className, rootClassName, } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <svg
    className={classes}
      class="iconLeft"
      width="30"
      height="40"
      data-v-423bf9ae=""
      version="1.1"
      viewBox="0 0 79.212 90"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs data-v-423bf9ae="">
        <linearGradient
          id="linearGradient826"
          x1="25.332"
          x2="81.262"
          y1="18.591"
          y2="18.591"
          gradientTransform="matrix(1.4163 0 0 1.6092 -35.877 -29.916)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="rgb(162, 31, 56)" data-v-423bf9ae="" offset="0" />
          <stop stop-color="rgb(216, 128, 107)" data-v-423bf9ae="" offset="1" />
        </linearGradient>
      </defs>
      <path
        d="m21.884 10.942a10.942 10.942 0 1 0-21.884 0 10.942 10.942 0 0 0 21.884 0zm-13.33-5.1328c-1.1881 0.55404-2.1527 1.5096-2.7189 2.6932a1.1307 1.1307 0 0 1-1.5096 0.53139 1.1322 1.1322 0 0 1-0.5329-1.5096 7.9603 7.9603 0 0 1 3.8028-3.7681 1.1329 1.1329 0 1 1 0.95862 2.0531zm53.351 11.475c-6.73 0-12.556 3.8481-15.418 9.4624 1.0115 0.33514 1.9927 0.73066 2.9604 1.1564 1.2409-2.2509 3.1446-4.0896 5.483-5.1811a1.1329 1.1329 0 0 1 0.95862 2.0531 9.8987 9.8987 0 0 0-4.4006 4.1107c8.4072 4.4021 14.74 12.242 17.085 21.657 6.2439-2.6117 10.64-8.7665 10.64-15.951 0-9.559-7.749-17.308-17.308-17.308zm-25.943 10.029c-17.282 0-31.343 14.061-31.343 31.345 0 17.282 14.059 31.343 31.343 31.343 17.284 0 31.343-14.059 31.343-31.343 0-17.284-14.061-31.345-31.343-31.345zm-10.409 8.4977a25.769 25.769 0 0 0-12.323 12.199 1.1322 1.1322 0 1 1-2.0425-0.97523c2.7868-5.8287 7.5482-10.543 13.409-13.276a1.1322 1.1322 0 1 1 0.95711 2.0516z"
        fill="url(#linearGradient826)"
      />
    </svg>
  );
};

IconBubbleMarker.defaultProps = {
  className: null,
  rootClassName: null,
};

IconBubbleMarker.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconBubbleMarker;
