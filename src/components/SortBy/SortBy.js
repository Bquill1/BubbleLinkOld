import { bool, string } from 'prop-types';
import React from 'react';
import config from '../../config';
import { injectIntl, intlShape } from '../../util/reactIntl';
import SortByPlain from './SortByPlain';
import SortByPopup from './SortByPopup';



const SortBy = props => {
  const { sort, showAsPopup, isConflictingFilterActive, intl, ...rest } = props;

  const { relevanceKey, queryParamName } = config.custom.sortConfig;

  const options = config.custom.sortConfig.options.map(option => {
    const isRelevance = option.key === relevanceKey;
    return {
      ...option,
      disabled:
        (isRelevance && !isConflictingFilterActive) || (!isRelevance && isConflictingFilterActive),
    };
  });
  const defaultValue = 'createdAt';
  const componentProps = {
    urlParam: queryParamName,
    label: intl.formatMessage({ id: 'SortBy.heading' }),
    options,
    initialValue: isConflictingFilterActive ? relevanceKey : sort || defaultValue,
    ...rest,
  };
  return showAsPopup ? <SortByPopup {...componentProps} /> : <SortByPlain {...componentProps} />;
};

SortBy.defaultProps = {
  sort: null,
  showAsPopup: false,
};

SortBy.propTypes = {
  sort: string,
  showAsPopup: bool,
  isConflictingFilterActive: bool.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(SortBy);
