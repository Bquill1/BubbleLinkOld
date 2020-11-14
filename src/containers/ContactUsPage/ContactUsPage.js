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
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { NamedLink } from '../../components';

import css from './ContactUsPage.css';


const ContactUsPage = (rootClassName,
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
          <FormattedMessage id="ContactUsPage.Title" />
          </h1>

          <div className={css.steps}>
                    <div className={css.step}>
                      <div className={css.iconWrapper}>
                        <FontAwesomeIcon className={css.iconClassName} size={'2x'} icon={faUserFriends} />
                      </div>
                      <h2 className={css.stepTitle}>
                        <FormattedMessage id="ContactUsPage.hostTitle" />
                      </h2>
                      <p>
                     <a href="mailto:hosting@mybubblelink.com">hosting@mybubblelink.com</a>
                      </p>
                    </div>

                    <div className={css.step}>
                     <div className={css.iconWrapper}>
                       <FontAwesomeIcon className={css.iconClassName} size={'2x'} icon={faQuestionCircle} />
                        </div>
                        <h2 className={css.stepTitle}>
                         <FormattedMessage id="ContactUsPage.supportTitle" />
                         </h2>
                         <p>
                         <a href="mailto:support@mybubblelink.com">support@mybubblelink.com</a>
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

export default ContactUsPage;
