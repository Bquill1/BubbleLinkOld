import React from 'react';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage, TopbarContainer } from '../../containers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
} from '../../components';

import css from './HostPage.css';
import image from './host-welcome-1.jpg';

const HostPage = () => {
const { siteTwitterHandle, siteFacebookPage } = config;
const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  // prettier-ignore
  return (
    <StaticPage
      title="About Hosting"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'HostPage',
        description: 'About Hosting',
        name: 'About Hosting',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <h1 className={css.pageTitle}>Join the CastleBee Hive</h1>
          <img className={css.coverImage} src={image} alt="My first ice cream." />

         <div className={css.contentWrapper}>
           <div className={css.contentSide}>
            <p>Home do I become a Host?</p>
           </div>

           <div className={css.contentMain}>
           <h4>
           Click the "+Become a Host" button above to create your account. Our easy to use
           application will then guide you through the process of adding your first space.
           </h4>
           </div>
           </div>

          <div className={css.contentWrapper}>
            <div className={css.contentSide}>
              <p>What are the benefits of becoming a host?</p>
            </div>

            <div className={css.contentMain}>
              <h4>
                Easily manage your profile and listings from your personal account. Adjust the availability of your space to
                suit your schedule and set your own prices. Booking and payments are all handled by the platform.
                Use the built in chat function to arrange handover of the space with your guest.
                Gain access to the SpaceHerder user community looking for that perfect space for remote working, meetings,
                studying or somewhere to hold an events, fitness classes, meet clients, conduct interviews...
             </h4>
            </div>
          </div>
          <div className={css.contentWrapper}>
          <div className={css.contentSide}>
           <p>What are the benefits of becoming a host?</p>
            </div>
            <div className={css.contentMain}>
             <h4>
               You will gain access to the SpaceHerder user community looking for that perfect space. There
               are no subscription costs and booking and payments are handled by our easy to use platform.
                </h4>
                </div>
              </div>
              <div className={css.contentWrapper}>
                      <div className={css.contentSide}>
                        <p>What are the benefits of becoming a host?</p>
                      </div>

                      <div className={css.contentMain}>
                        <h4>
                          You will gain access to the SpaceHerder user community looking for that perfect space. There
                          are no subscription costs and booking and payments are handled by our easy to use platform.
                       </h4>
                      </div>
                    </div>

                              <div className={css.contentWrapper}>
                                <div className={css.contentSide}>
                                  <p>What are the benefits of becoming a host?</p>
                                </div>

                                <div className={css.contentMain}>
                                  <h4>
                                    You will gain access to the SpaceHerder user community looking for that perfect space. There
                                    are no subscription costs and booking and payments are handled by our easy to use platform.
                                 </h4>
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

export default HostPage;
