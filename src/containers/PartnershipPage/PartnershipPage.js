import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { StaticPage, TopbarContainer } from '../../containers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
} from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { NamedLink } from '../../components';

import css from './PartnershipPage.css';

{/*
  const {
    rootClassName,
    className
  }
*/}

const PartnershipPage = (rootClassName,
                           className) => {
  // prettier-ignore

  return (
    <StaticPage>
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>


        <LayoutWrapperMain className={css.mainWrapper}>
          <h1>
          <FormattedMessage id="PartnershipPage.title" />
          </h1>

          <div className={css.steps}>

          <div className={css.step}>
             <FontAwesomeIcon className={css.iconClassName} size={'2x'} icon={faHandshake} />
             <div className={css.iconWrapper}>
             </div>
             <h2 className={css.stepTitle}>
             <FormattedMessage id="PartnershipPage.partnershipTitle" />
             </h2>
             <p>
             <NamedLink name="HostPage">
             <FormattedMessage id="PartnershipPage.partnershipEmail" />
             </NamedLink>
             </p>
             </div>
             </div>


        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );

};

export default PartnershipPage;
