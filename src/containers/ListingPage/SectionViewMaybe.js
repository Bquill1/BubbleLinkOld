import React from 'react';
import { formatMoney } from '../../util/currency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { faUniversity } from '@fortawesome/free-solid-svg-icons';
import { faDungeon } from '@fortawesome/free-solid-svg-icons';
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faCalendarTimes } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { PriceDisplayGrid } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';

// Import css from existing CSS Modules file:
import css from './ListingPage.css';

const BlockIcon = props => {
  const { icon, tip, size = '2x', className } = props;
  return (
    <>
      <FontAwesomeIcon
        className={className || css.blockIconClass}
        size={size}
        icon={icon}
        data-tip={tip}
      />
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
  const {
    intl,
    propertyTypeOptions,
    spaceTypeOptions,
    categoryOptions,
    publicData,
    prices,
  } = props;
  if (!publicData) {
    return null;
  }
  console.log(props);
  const { capacity, propertyType, spaceType, category } = publicData;
  const propertyTypeKey = {
    house: <BlockIcon icon={faHome} tip="This space is in the hosts house." />,
    apartment: <BlockIcon icon={faBuilding} tip="This space is in the hosts apartment." />,
    business: <BlockIcon icon={faStore} tip="This space is in the hosts business." />,
    unique: <BlockIcon icon={faUniversity} tip="This is a unique space." />,
    other: <BlockIcon icon={faDungeon} tip="This space is hard to classify." />,
  };
  const spaceTypeKey = {
    private: <BlockIcon icon={faUserShield} tip="You'll have your own private space." />,
    sharedHost: <BlockIcon icon={faUserFriends} tip="You may be sharing with the host." />,
    sharedGuest: <BlockIcon icon={faUsers} tip="You may be sharing with other guests." />,
  };
  return (
    <div className={css.sectionView}>
      <div className={css.sectionViewPriceBlock}>
        <ViewBlock
          intl={intl}
          icon={<div className={css.emptyIcon}></div>}
          valueFirst={<BlockIcon icon={faUser} tip="Individual Space" />}
          valueSecond={<BlockIcon icon={faHome} tip="Entire Space" />}
        />
        <ViewBlock
          intl={intl}
          icon={<BlockIcon icon={faCalendarTimes} tip="Per day" />}
          valueFirst={
            (prices['individual']['daily'] && formatMoney(intl, prices['individual']['daily'])) ||
            '--'
          }
          valueSecond={
            (prices['entireSpace']['daily'] && formatMoney(intl, prices['entireSpace']['daily'])) ||
            '--'
          }
        />
        <ViewBlock
          intl={intl}
          icon={<BlockIcon icon={faClock} tip="Per hour" />}
          valueFirst={
            (prices['individual']['hourly'] && formatMoney(intl, prices['individual']['hourly'])) ||
            '--'
          }
          valueSecond={
            (prices['entireSpace']['hourly'] &&
              formatMoney(intl, prices['entireSpace']['hourly'])) ||
            '--'
          }
        />
      </div>

      <div className={css.sectionViewDetailsBlock}>
        <div className={css.sectionViewDetailsTop}>
          <div className={css.gridRow}>
            {categoryOptions.map(o => {
              return (
                <div className={css.gridCol}>
                  <>
                    <div className={css.gridBlock}>{o.label}</div>
                    {category.includes(o.key) ? (
                      <BlockIcon
                        className={css.greenCheck}
                        icon={faCheck}
                        tip={o.label}
                        size={'1x'}
                      />
                    ) : (
                      <BlockIcon className={css.redX} icon={faTimes} tip={o.label} size={'1x'} />
                    )}
                  </>
                </div>
              );
            })}
          </div>
        </div>
        <div className={css.sectionViewDetailsBottom}>
          <ViewBlock
            intl={intl}
            icon={
              <BlockIcon
                icon={faUniversalAccess}
                tip={`This space holds a maximum of ${capacity} guests.`}
              />
            }
            valueFirst={'Capacity: ' + capacity}
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
      </div>
    </div>
  );
};

export default SectionViewMaybe;
