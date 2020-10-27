import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { NamedLink, SectionSearchBlock, IconBubbleMarker } from '../../components';

import css from './AboutPage.css';

const MultiColumnSection = props => {
  const { className, title, subtitle, showGraphics, content } = props;

  const classes = classNames(className);

  return (
    <div className={classes}>
      <div className={css.multiColumnWrapper}>
        {title && <h1 className={css.multiColumnMainTitle}>{title}</h1>}
        {subtitle && <h2 className={css.multiColumnSubTitle}>{subtitle}</h2>}
        <div className={css.multiColumnContentWrapper}>
          {content?.map(c => {
            return (
              <>
                <div className={css.multiColumnContentBlock}>
                  <div className={css.multiColumnContentHeader}>
                    {showGraphics && (
                      <div className={css.multiColumnGraphic}>
                        <IconBubbleMarker />
                      </div>
                    )}
                    {c.title && <div className={css.multiColumnContentTitle}>{c.title}</div>}
                  </div>
                  {c.content && <div className={css.multiColumnContent}>{c.content}</div>}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

MultiColumnSection.defaultProps = { rootClassName: null, className: null };

MultiColumnSection.propTypes = {
  rootClassName: string,
  className: string,
};

export default MultiColumnSection;
