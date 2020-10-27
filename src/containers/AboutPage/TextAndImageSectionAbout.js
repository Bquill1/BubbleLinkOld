import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { NamedLink, SectionSearchBlock, IconBubbleMarker } from '../../components';

import css from './AboutPage.css';
import { Icon } from '../../components/IconAdd/IconAdd.example';

const TextAndImageSection = props => {
  const { className, title, subtitle, image, imageLeft, smallImage, content } = props;

  const classes = classNames(className);

  return (
    <div className={classes}>
      <div
        className={classNames(css.TextAndImageWrapper, { [css.TextAndImageImageLeft]: imageLeft })}
      >
        <div className={css.TextAndImageWrapperLeft}>
          {title && <h1 className={css.TextAndImageMainTitle}>{title}</h1>}
          {subtitle && <h2 className={css.TextAndImageSubTitle}>{subtitle}</h2>}
          {content && <div className={css.TextAndImageContent}>{content}</div>}
        </div>
        <div
          className={classNames(css.TextAndImageWrapperRight, {
            [css.TextAndImageImageSmall]: smallImage,
          })}
        >
          <div className={css.TextAndImageImageWrapper}>
            <img
              className={classNames(css.TextAndImageImage)}
              src={image}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

TextAndImageSection.defaultProps = { rootClassName: null, className: null };

TextAndImageSection.propTypes = {
  rootClassName: string,
  className: string,
};

export default TextAndImageSection;
