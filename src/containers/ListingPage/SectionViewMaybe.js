import React from 'react';
import { formatMoney } from '../../util/currency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { faUniversity } from '@fortawesome/free-solid-svg-icons';
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faCalendarTimes } from '@fortawesome/free-solid-svg-icons';
import { PriceDisplayGrid } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';

// Import css from existing CSS Modules file:
import css from './ListingPage.css';

const BlockIcon = props => {
  const { icon, tip } = props;
  return (
    <>
      <FontAwesomeIcon icon={icon} data-tip={tip} />
      <ReactTooltip />
    </>
  );
};
const ViewBlock = props => {
  const { icon, valueFirst, valueSecond } = props;

  console.log(props);
  return (
    <div className={css.viewBlock}>
      {icon}
      <div className={css.viewBlockContent}>
        <div className={css.viewBlockFirstContent}>{valueFirst}</div>
        {valueSecond && <div className={css.viewBlockSecondContent}>{valueSecond}</div>}
      </div>
    </div>
  );
};
// Create new React component
const SectionViewMaybe = props => {
  const { intl, propertyTypeOptions, spaceTypeOptions, publicData, prices } = props;
  if (!publicData) {
    return null;
  }
  console.log(props);
  const { capacity, propertyType, spaceType } = publicData;
  const propertyTypeKey = {
    house: <BlockIcon icon={faHome} tip="This space is in the hosts house." />,
    apartment: <BlockIcon icon={faBuilding} tip="This space is in the hosts apartment." />,
    business: <BlockIcon icon={faStore} tip="This space is in the hosts business." />,
    unique: <BlockIcon icon={faUniversity} tip="This is a unique space." />,
    other: <BlockIcon icon={faUniversity} data-tip="This space is hard to classify." />,
  };
  const spaceTypeKey = {
    private: <BlockIcon icon={faUserShield} tip="This is your own private space." />,
    sharedHost: <BlockIcon icon={faUserFriends} tip="This space is shared only with the host." />,
    sharedGuest: <BlockIcon icon={faUsers} tip="This space is shared with other guests." />,
  };
  return (
    <div className={css.sectionView}>
      <div className={css.sectionViewPriceBlock}>
        <ViewBlock
          intl={intl}
          icon={<div></div>}
          valueFirst={<BlockIcon icon={faUser} tip="Individual Spot" />}
          valueSecond={<BlockIcon icon={faHome} tip="Entire Place" />}
        />
        <ViewBlock
          intl={intl}
          icon={<BlockIcon icon={faCalendarTimes} tip="Daily" />}
          valueFirst={formatMoney(intl, prices['individual']['daily'])}
          valueSecond={formatMoney(intl, prices['entireSpace']['daily'])}
        />
        <ViewBlock
          intl={intl}
          icon={<BlockIcon icon={faClock} tip="Hourly" />}
          valueFirst={formatMoney(intl, prices['individual']['hourly'])}
          valueSecond={formatMoney(intl, prices['entireSpace']['hourly'])}
        />
      </div>
      <ViewBlock
        intl={intl}
        icon={<BlockIcon icon={faUniversalAccess} tip="Maximum Guests Allowed" />}
        valueFirst={"Capacity: " + capacity}
      />
      <ViewBlock
        intl={intl}
        icon={propertyTypeKey[propertyType]}
        valueFirst={propertyTypeOptions.find(o => o.key === propertyType).label}
      />
      <ViewBlock
        intl={intl}
        icon={spaceTypeKey[spaceType]}
        valueFirst={spaceTypeOptions.find(o => o.key === spaceType).label}
      />
    </div>
  );
};

export default SectionViewMaybe;
